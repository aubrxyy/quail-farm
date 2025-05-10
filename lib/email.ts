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