import { prisma } from '@/lib/prisma';
import { sendLowStockAlert, sendInventoryStatusReport } from '@/lib/email';

// Update product stock when an order is placed
export async function updateInventoryForOrder(orderId: number) {
  // Get order with product details
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  });

  if (!order || !order.product) {
    throw new Error('Order or product not found');
  }

  // Calculate new stock level
  const newStock = order.product.stock - order.orderAmount;
  
  if (newStock < 0) {
    throw new Error('Insufficient stock for product: ' + order.product.name);
  }

  // Update product stock
  await prisma.product.update({
    where: { id: order.productId },
    data: { stock: newStock }
  });

  // Check if stock is running low and notify admins
  if (newStock <= 10) {
    await createLowStockAlert(order.product.id, newStock);
  }

  return newStock;
}

// Create a low stock alert
async function createLowStockAlert(productId: number, currentStock: number) {
  try {
    // Create a record of the low stock alert (only if notification table exists)
    // Comment out if you don't have a notification table
    /*
    await prisma.notification.create({
      data: {
        type: 'LOW_STOCK',
        message: `Product ID ${productId} is running low on stock (${currentStock} remaining)`,
        read: false
      }
    });
    */
    
    // Get all admin users to notify
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    // Get the product details
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (product) {
      // Send email to all admins
      for (const admin of admins) {
        if (admin.email) {
          try {
            await sendLowStockAlert(admin.email, {
              ...product,
              stock: currentStock // Make sure we use the current stock level
            });
          } catch (error) {
            console.error('Failed to send low stock alert email:', error);
            // Continue with other admins even if one email fails
          }
        }
      }
    }

    return admins;
  } catch (error) {
    console.error('Error creating low stock alert:', error);
    throw error;
  }
}

// Check if inventory is sufficient before order creation
export async function checkInventoryAvailability(productId: number, quantity: number) {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  if (product.stock < quantity) {
    return {
      available: false,
      currentStock: product.stock,
      requested: quantity
    };
  }

  return {
    available: true,
    currentStock: product.stock,
    requested: quantity
  };
}

// Return inventory to stock when order is cancelled
export async function restockInventoryForCancelledOrder(orderId: number) {
  // Get order with product details
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  });

  if (!order || !order.product) {
    throw new Error('Order or product not found');
  }

  // Calculate new stock level
  const newStock = order.product.stock + order.orderAmount;
  
  // Update product stock
  await prisma.product.update({
    where: { id: order.productId },
    data: { stock: newStock }
  });
  
  return newStock;
}

// Check all products for low inventory and send weekly report
export async function generateInventoryStatusReport() {
  try {
    // Get all products with low stock (less than 20 items)
    const lowStockProducts = await prisma.product.findMany({
      where: {
        stock: {
          lte: 20 // Products with 20 or fewer items are considered low stock
        }
      },
      orderBy: {
        stock: 'asc' // Order by stock ascending (lowest first)
      }
    });
    
    if (lowStockProducts.length === 0) {
      console.log('No low stock products found.');
      return;
    }
    
    // Get all admin users
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });
    
    if (admins.length === 0) {
      console.log('No admin users found to notify.');
      return;
    }
    
    // Send report to each admin
    const promises = [];
    for (const admin of admins) {
      if (admin.email) {
        promises.push(sendInventoryStatusReport(admin.email, lowStockProducts));
      }
    }
    
    await Promise.all(promises);
    
    console.log(`Inventory status report sent to ${promises.length} admins.`);
    return lowStockProducts.length;
  } catch (error) {
    console.error('Failed to generate inventory status report:', error);
    throw error;
  }
}

// Update inventory based on order status changes
export async function updateInventoryOnStatusChange(
  order: any, 
  newStatus: string
): Promise<void> {
  try {
    // If order is being cancelled, add the quantity back to inventory
    if (newStatus === 'CANCELLED' && order.status !== 'CANCELLED') {
      await prisma.product.update({
        where: { id: order.productId },
        data: {
          stock: {
            increment: order.orderAmount
          }
        }
      });
      console.log(`Restored ${order.orderAmount} units to product ${order.productId} stock due to cancellation`);
    }
    
    // If order was cancelled and now is being un-cancelled, reduce inventory again
    if (order.status === 'CANCELLED' && newStatus !== 'CANCELLED') {
      // First check if we have enough stock
      const product = await prisma.product.findUnique({
        where: { id: order.productId }
      });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (product.stock < order.orderAmount) {
        throw new Error(`Insufficient stock. Available: ${product.stock}, Required: ${order.orderAmount}`);
      }
      
      await prisma.product.update({
        where: { id: order.productId },
        data: {
          stock: {
            decrement: order.orderAmount
          }
        }
      });
      console.log(`Reduced ${order.orderAmount} units from product ${order.productId} stock due to order reactivation`);
    }
  } catch (error) {
    console.error('Error updating inventory on status change:', error);
    throw error;
  }
}

// Helper function to reduce stock when order is confirmed/processed
export async function reduceStockForOrder(orderId: number): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  });

  if (!order || !order.product) {
    throw new Error('Order or product not found');
  }

  // Check if we have enough stock
  if (order.product.stock < order.orderAmount) {
    throw new Error(`Insufficient stock for ${order.product.name}. Available: ${order.product.stock}, Required: ${order.orderAmount}`);
  }

  // Reduce the stock
  await prisma.product.update({
    where: { id: order.productId },
    data: {
      stock: {
        decrement: order.orderAmount
      }
    }
  });

  // Check for low stock and alert if necessary
  const updatedProduct = await prisma.product.findUnique({
    where: { id: order.productId }
  });

  if (updatedProduct && updatedProduct.stock <= 10) {
    await createLowStockAlert(updatedProduct.id, updatedProduct.stock);
  }
}

// Helper function to get current stock level
export async function getCurrentStock(productId: number): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stock: true }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product.stock;
}

// Helper function to check if product has sufficient stock
export async function hasSufficientStock(productId: number, quantity: number): Promise<boolean> {
  const currentStock = await getCurrentStock(productId);
  return currentStock >= quantity;
}