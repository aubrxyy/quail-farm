// lib/inventory.ts
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
  // Create a record of the low stock alert
  await prisma.notification.create({
    data: {
      type: 'LOW_STOCK',
      message: `Product ID ${productId} is running low on stock (${currentStock} remaining)`,
      read: false
    }
  });
  
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
      // The sendInventoryStatusReport is already imported at the top of the file
    
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