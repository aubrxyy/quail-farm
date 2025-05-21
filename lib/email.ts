// lib/email.ts
import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Configure transporter (update with your SMTP settings)
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Cimahpar Quail Farm" <noreply@cimahparquailfarm.com>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <body style="margin: 0; padding: 0; background: #fcfaef; font-family: Arial, sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #fcfaef; min-height: 80vh; padding: 20px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background: #fff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
                <tr>
                  <td align="center" style="padding: 40px 20px;">
                    <h2 style="font-size: 24px; font-weight: bold; color: #333; margin-bottom: 20px;">Verify Your Email Address</h2>
                    <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
                      Thank you for signing up! Please click the button below to verify your email address:
                    </p>
                    <a href="${verificationUrl}" 
                      style="display: inline-block; background: linear-gradient(90deg, #f6c343 0%, #f6a700 100%); color: #fff; font-weight: bold; font-size: 16px; padding: 12px 30px; border-radius: 6px; text-decoration: none;">
                      Verify Email
                    </a>
                    <p style="font-size: 14px; color: #777; margin-top: 30px;">
                      If you didn't create an account, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
                <tr>
                  <td>
                    <!-- Footer -->
                    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px; border-top: 1px solid #ddd; background: linear-gradient(90deg, #f6c343 0%, #f6a700 100%); padding: 20px 0;">
                      <tr>
                        <td align="center" style="font-size: 14px; color: #555; line-height: 1.5; font-family: Arial, sans-serif;">
                          <strong>CIMAHPAR QUAIL</strong><br />
                          © 2025 Cimahpar Quail Farm by AR3<br />
                          <a href="${process.env.NEXTAUTH_URL}" style="color: #007bff; text-decoration: none;">Visit our website</a>
                        </td>
                      </tr>
                    </table>
                    <!-- End Footer -->
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendOrderCreatedEmail(email: string, order: any) {
  const mailOptions = {
    from: `"Quail Farm" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Order Confirmation #${order.id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order Has Been Placed!</h2>
        <p>Thank you for your order. We're processing it right away.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/orders/${order.id}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View Order Details
        </a>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendOrderStatusUpdateEmail(email: string, order: any) {
  const mailOptions = {
    from: `"Quail Farm" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `Order #${order.id} Status Update`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Your Order Status Has Been Updated</h2>
        <p>The status of your order #${order.id} has been updated to <strong>${order.status}</strong>.</p>
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> #${order.id}</p>
          <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> ${order.status}</p>
          <p><strong>Total:</strong> $${order.totalPrice.toFixed(2)}</p>
        </div>
        <a href="${process.env.NEXTAUTH_URL}/orders/${order.id}" style="display: inline-block; background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">
          View Order Details
        </a>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendNewsletterEmail(email: string, content: string) {
  const mailOptions = {
    from: `"Quail Farm" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Quail Farm Newsletter',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Quail Farm Newsletter</h2>
        ${content}
        <p style="margin-top: 30px; font-size: 12px; color: #6c757d;">
          If you no longer wish to receive these emails, you can <a href="${process.env.NEXTAUTH_URL}/unsubscribe?email=${email}">unsubscribe here</a>.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Add to lib/email.ts

// Enhanced order notification that goes to both customer and admins
export async function sendOrderNotifications(order: any) {
  try {
    // First get the user who placed the order
    const customer = await prisma.user.findUnique({
      where: { id: order.userId }
    });

    // Find all admins
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' }
    });

    const promises = [];
    
    // Send to customer if they have an email
    if (customer?.email) {
      promises.push(sendOrderCreatedEmail(customer.email, order));
    }
    
    // Send to all admins
    for (const admin of admins) {
      if (admin.email) {
        promises.push(
          sendAdminOrderNotification(
            admin.email, 
            order, 
            customer?.name || order.customerName
          )
        );
      }
    }
    
    // Wait for all emails to be sent
    await Promise.all(promises);
    
    return true;
  } catch (error) {
    console.error('Failed to send order notifications:', error);
    // We don't want to fail the order if email fails
    return false;
  }
}

// Admin-specific order notification with more details
export async function sendAdminOrderNotification(email: string, order: any, customerName: string) {
  const mailOptions = {
    from: `"Quail Farm Orders" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `🚨 New Order #${order.id} Received`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="background-color: #4CAF50; color: white; padding: 10px 15px; border-radius: 5px;">
          New Order Received
        </h2>
        <p><strong>Admin Alert:</strong> A new order has been placed and requires your attention.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; border-bottom: 1px solid #dee2e6; padding-bottom: 10px;">
            Order #${order.id} Details
          </h3>
          <p><strong>Customer:</strong> ${customerName}</p>
          <p><strong>Product:</strong> ${order.product?.name || 'Product #' + order.productId}</p>
          <p><strong>Quantity:</strong> ${order.orderAmount}</p>
          <p><strong>Total Price:</strong> Rp${order.totalPrice.toLocaleString('id-ID')}</p>
          <p><strong>Address:</strong> ${order.customerAddress}</p>
          <p><strong>Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
          <p><strong>Status:</strong> <span style="color: #ff9800; font-weight: bold;">${order.status}</span></p>
        </div>
        
        <div style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL}/admin/orders/${order.id}" 
             style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Process Order
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 15px;">
          This is an automated message from the Quail Farm order system.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Low stock notification for admins
export async function sendLowStockAlert(email: string, product: any) {
  const mailOptions = {
    from: `"Quail Farm Inventory" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `⚠️ Low Stock Alert: ${product.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="background-color: #f44336; color: white; padding: 10px 15px; border-radius: 5px;">
          Low Stock Alert
        </h2>
        <p>The following product is running low on inventory and requires your attention:</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #f44336;">${product.name}</h3>
          <p><strong>Current Stock:</strong> ${product.stock} units</p>
          <p><strong>Product ID:</strong> ${product.id}</p>
          <p><strong>Price:</strong> Rp${product.harga.toLocaleString('id-ID')}</p>
        </div>
        
        <div style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL}/admin/products/${product.id}" 
             style="background-color: #007bff; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
            Update Inventory
          </a>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

// Batch send inventory status report to admins
export async function sendInventoryStatusReport(email: string, lowStockProducts: any[]) {
  const productRows = lowStockProducts.map(product => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">${product.name}</td>
      <td style="padding: 8px; border-bottom: 1px solid #dee2e6; text-align: center; ${
        product.stock <= 5 ? 'color: #f44336; font-weight: bold;' : ''
      }">${product.stock}</td>
      <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">Rp${product.harga.toLocaleString('id-ID')}</td>
      <td style="padding: 8px; border-bottom: 1px solid #dee2e6;">
        <a href="${process.env.NEXTAUTH_URL}/admin/products/${product.id}" 
           style="color: #007bff; text-decoration: none; display: block; text-align: center;">
          Update
        </a>
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Quail Farm Inventory System" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: `📊 Inventory Status Report - Low Stock Items`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h2 style="background-color: #343a40; color: white; padding: 15px; border-radius: 5px;">
          Inventory Status Report
        </h2>
        <p>The following products are currently low on stock and may need replenishment:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #dee2e6;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Product Name</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Current Stock</th>
              <th style="padding: 12px; text-align: left; border-bottom: 2px solid #dee2e6;">Price</th>
              <th style="padding: 12px; text-align: center; border-bottom: 2px solid #dee2e6;">Action</th>
            </tr>
          </thead>
          <tbody>
            ${productRows}
          </tbody>
        </table>
        
        <div style="margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL}/admin/products" 
             style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">
            View All Products
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6c757d; border-top: 1px solid #dee2e6; padding-top: 15px;">
          This report was automatically generated by the Quail Farm inventory management system.
        </p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}