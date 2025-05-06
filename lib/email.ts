// lib/email.ts
import nodemailer from 'nodemailer';

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
    from: `"Quail Farm" <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email Address</h2>
        <p>Thank you for signing up! Please click the button below to verify your email address:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; margin: 20px 0;">
          Verify Email
        </a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
      </div>
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