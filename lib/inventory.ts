import { sendInventoryStatusReport, sendLowstokAlert } from '@/lib/email';
import { prisma } from '@/lib/prisma';

// Update product stok when an order is placed
export async function updateInventoryForOrder(orderId: number) {
  // Get order with product details
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  });

  if (!order || !order.product) {
    throw new Error('Order or product not found');
  }

  // Calculate new stok level
  const newstok = order.product.stok - order.orderAmount;

  if (newstok < 0) {
    throw new Error('Insufficient stok for product: ' + order.product.name);
  }

  // Update product stok
  await prisma.product.update({
    where: { id: order.productId },
    data: { stok: newstok }
  });

  // Check if stok is running low and notify admins
  if (newstok <= 10) {
    await createLowstokAlert(order.product.id, newstok);
  }

  return newstok;
}

// Create a low stok alert
async function createLowstokAlert(productId: number, currentstok: number) {
  try {
    // Create a record of the low stok alert (only if notification table exists)
    // Comment out if you don't have a notification table
    /*
    await prisma.notification.create({
      data: {
        type: 'LOW_stok',
        message: `Product ID ${productId} is running low on stok (${currentstok} remaining)`,
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
            await sendLowstokAlert(admin.email, {
              ...product,
              stok: currentstok // Make sure we use the current stok level
            });
          } catch (error) {
            console.error('Failed to send low stok alert email:', error);
            // Continue with other admins even if one email fails
          }
        }
      }
    }

    return admins;
  } catch (error) {
    console.error('Error creating low stok alert:', error);
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

  if (product.stok < quantity) {
    return {
      available: false,
      currentstok: product.stok,
      requested: quantity
    };
  }

  return {
    available: true,
    currentstok: product.stok,
    requested: quantity
  };
}

// Return inventory to stok when order is cancelled
export async function restokInventoryForCancelledOrder(orderId: number) {
  // Get order with product details
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  });

  if (!order || !order.product) {
    throw new Error('Order or product not found');
  }

  // Calculate new stok level
  const newstok = order.product.stok + order.orderAmount;
  
  // Update product stok
  await prisma.product.update({
    where: { id: order.productId },
    data: { stok: newstok }
  });
  
  return newstok;
}

// Check all products for low inventory and send weekly report
export async function generateInventoryStatusReport() {
  try {
    // Get all products with low stok (less than 20 items)
    const lowstokProducts = await prisma.product.findMany({
      where: {
        stok: {
          lte: 20 // Products with 20 or fewer items are considered low stok
        }
      },
      orderBy: {
        stok: 'asc' // Order by stok ascending (lowest first)
      }
    });
    
    if (lowstokProducts.length === 0) {
      console.log('No low stok products found.');
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
        promises.push(sendInventoryStatusReport(admin.email, lowstokProducts));
      }
    }
    
    await Promise.all(promises);
    
    console.log(`Inventory status report sent to ${promises.length} admins.`);
    return lowstokProducts.length;
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
          stok: {
            increment: order.orderAmount
          }
        }
      });
      console.log(`Restored ${order.orderAmount} units to product ${order.productId} stok due to cancellation`);
    }
    
    // If order was cancelled and now is being un-cancelled, reduce inventory again
    if (order.status === 'CANCELLED' && newStatus !== 'CANCELLED') {
      // First check if we have enough stok
      const product = await prisma.product.findUnique({
        where: { id: order.productId }
      });
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      if (product.stok < order.orderAmount) {
        throw new Error(`Insufficient stok. Available: ${product.stok}, Required: ${order.orderAmount}`);
      }
      
      await prisma.product.update({
        where: { id: order.productId },
        data: {
          stok: {
            decrement: order.orderAmount
          }
        }
      });
      console.log(`Reduced ${order.orderAmount} units from product ${order.productId} stok due to order reactivation`);
    }
  } catch (error) {
    console.error('Error updating inventory on status change:', error);
    throw error;
  }
}

// Helper function to reduce stok when order is confirmed/processed
export async function reducestokForOrder(orderId: number): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { product: true }
  });

  if (!order || !order.product) {
    throw new Error('Order or product not found');
  }

  // Check if we have enough stok
  if (order.product.stok < order.orderAmount) {
    throw new Error(`Insufficient stok for ${order.product.name}. Available: ${order.product.stok}, Required: ${order.orderAmount}`);
  }

  // Reduce the stok
  await prisma.product.update({
    where: { id: order.productId },
    data: {
      stok: {
        decrement: order.orderAmount
      }
    }
  });

  // Check for low stok and alert if necessary
  const updatedProduct = await prisma.product.findUnique({
    where: { id: order.productId }
  });

  if (updatedProduct && updatedProduct.stok <= 10) {
    await createLowstokAlert(updatedProduct.id, updatedProduct.stok);
  }
}

// Helper function to get current stok level
export async function getCurrentstok(productId: number): Promise<number> {
  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { stok: true }
  });

  if (!product) {
    throw new Error('Product not found');
  }

  return product.stok;
}

// Helper function to check if product has sufficient stok
export async function hasSufficientstok(productId: number, quantity: number): Promise<boolean> {
  const currentstok = await getCurrentstok(productId);
  return currentstok >= quantity;
}