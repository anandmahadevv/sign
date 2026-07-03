import nodemailer from 'nodemailer';
import fs from 'fs';

// 1. Read the list of emails from our JSON file
const emailList = JSON.parse(fs.readFileSync('./email_list.json', 'utf-8'));

// 2. Configure your email transporter
// (For Gmail, you need to use an "App Password" if you have 2FA enabled. 
// Go to Google Account -> Security -> 2-Step Verification -> App Passwords to create one)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'YOUR_GMAIL_ADDRESS@gmail.com', // ⚠️ CHANGE THIS
    pass: 'YOUR_APP_PASSWORD_HERE'        // ⚠️ CHANGE THIS
  }
});

// 3. The Email Content
const subject = "I built a free Bonsai alternative for freelancers!";
const textBody = `Hey there,

I noticed you're a freelancer and wanted to reach out. I recently got tired of paying expensive monthly subscriptions to tools like Bonsai or Adobe just to send simple client contracts and invoices.

So, I built a 100% free alternative called Sign by HackArena. 
You can generate client agreements, collect e-signatures, and send invoices for free in just 3 clicks.

I'd love for you to check it out and let me know your brutally honest feedback!
https://sign.hackarena.dev/

Cheers,
Anand`;

const htmlBody = `
  <div style="font-family: sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
    <p>Hey there,</p>
    <p>I noticed you're a freelancer and wanted to reach out. I recently got tired of paying expensive monthly subscriptions to tools like Bonsai or Adobe just to send simple client contracts and invoices.</p>
    <p>So, I built a 100% free alternative called <strong>Sign by HackArena</strong>.</p>
    <p>You can generate client agreements, collect e-signatures, and send invoices for free in just 3 clicks.</p>
    <p>I'd love for you to check it out and let me know your brutally honest feedback!</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sign.hackarena.dev/" style="background-color: #111; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Check out Sign by HackArena</a>
    </div>
    <p>Cheers,<br/>Anand</p>
  </div>
`;

async function sendInvites() {
  console.log(`Preparing to send ${emailList.length} invitations...`);

  let successCount = 0;
  let failCount = 0;

  for (const email of emailList) {
    if (!email || !email.includes('@')) continue; // Skip invalid emails

    try {
      const info = await transporter.sendMail({
        from: '"Sign by HackArena" <YOUR_GMAIL_ADDRESS@gmail.com>', // ⚠️ CHANGE THIS
        to: email,
        subject: subject,
        text: textBody,
        html: htmlBody,
      });

      console.log(`✅ Sent to: ${email}`);
      successCount++;
      
      // Wait 2 seconds between emails to avoid spam filters / rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error(`❌ Failed to send to ${email}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Finished sending!`);
  console.log(`Successfully sent: ${successCount}`);
  console.log(`Failed to send: ${failCount}`);
}

sendInvites().catch(console.error);
