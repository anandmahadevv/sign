import { Resend } from 'resend';

// Configure the Resend client using the API key
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendInvoiceEmail({
  clientEmail,
  clientName,
  agencyEmail,
  projectName,
  invoiceNumber,
  amount,
  dueDate,
  link
}: {
  clientEmail: string;
  clientName: string;
  agencyEmail: string;
  projectName: string;
  invoiceNumber: string;
  amount: number;
  dueDate: string;
  link: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set in environment variables. Skipping email sending.");
    return;
  }

  const subject = `New Invoice ${invoiceNumber} for ${projectName}`;
  
  const htmlBody = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
      <h2 style="margin-top: 0;">Invoice ${invoiceNumber}</h2>
      <p>Hello ${clientName},</p>
      <p>A new invoice has been generated for the project: <strong>${projectName}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-radius: 6px; margin: 20px 0;">
        <p style="margin: 0 0 10px 0;"><strong>Amount Due:</strong> $${amount.toFixed(2)}</p>
        <p style="margin: 0;"><strong>Due Date:</strong> ${dueDate}</p>
      </div>
      <p>You can view and pay your invoice securely using the link below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #28c840; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Invoice</a>
      </div>
      <p>If you have any questions, please reply directly to this email to reach us at ${agencyEmail}.</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Sent via Agency OS</p>
    </div>
  `;

  // Resend requires a verified domain to send from custom email addresses. 
  // If you haven't verified a domain on Resend, you MUST use 'onboarding@resend.dev' 
  // and it will ONLY send to the email address registered on your Resend account.
  // Once you add your domain (e.g., youragency.com), change this to "Agency OS <billing@youragency.com>"
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Agency OS <onboarding@resend.dev>';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [clientEmail],
      cc: [agencyEmail],
      replyTo: agencyEmail,
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API error:", error);
    }
  } catch (error) {
    console.error("Error sending email with Resend:", error);
  }
}

export async function sendAgreementEmail({
  clientEmail,
  clientName,
  agencyEmail,
  projectName,
  link
}: {
  clientEmail: string;
  clientName: string;
  agencyEmail: string;
  projectName: string;
  link: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set in environment variables. Skipping agreement email.");
    return;
  }

  const subject = `New Agreement for ${projectName}`;
  
  const htmlBody = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
      <h2 style="margin-top: 0;">Project Agreement</h2>
      <p>Hello ${clientName},</p>
      <p>A new agreement has been generated for the project: <strong>${projectName}</strong>.</p>
      <p>Please review and sign the agreement using the secure link below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #28c840; color: #000; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Review & Sign Agreement</a>
      </div>
      <p>If you have any questions, please reply directly to this email to reach us at ${agencyEmail}.</p>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Sent via Agency OS</p>
    </div>
  `;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Agency OS <onboarding@resend.dev>';

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [clientEmail],
      cc: [agencyEmail],
      replyTo: agencyEmail,
      subject,
      html: htmlBody,
    });

    if (error) {
      console.error("Resend API error:", error);
    }
  } catch (error) {
    console.error("Error sending agreement email with Resend:", error);
  }
}

export async function sendAgreementSignedEmail({
  agencyEmail,
  clientName,
  projectName,
  link
}: {
  agencyEmail: string;
  clientName: string;
  projectName: string;
  link: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not set. Skipping signed notification email.");
    return;
  }

  const subject = `Signed: ${projectName} by ${clientName}`;
  
  const htmlBody = `
    <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; padding: 20px;">
      <h2 style="margin-top: 0; color: #28c840;">Agreement Signed! 🎉</h2>
      <p>Great news!</p>
      <p><strong>${clientName}</strong> has successfully signed the agreement for <strong>${projectName}</strong>.</p>
      <p>You can view the finalized, legally binding document and its audit trail using the link below:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${link}" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Signed Agreement</a>
      </div>
      <hr style="border: none; border-top: 1px solid #eaeaea; margin: 20px 0;" />
      <p style="font-size: 12px; color: #888;">Agency OS Notifications</p>
    </div>
  `;

  const fromEmail = process.env.RESEND_FROM_EMAIL || 'Agency OS <onboarding@resend.dev>';

  try {
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [agencyEmail],
      subject,
      html: htmlBody,
    });

    if (error) console.error("Resend API error:", error);
  } catch (error) {
    console.error("Error sending signed notification:", error);
  }
}
