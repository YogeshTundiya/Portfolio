// api/send.js
export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, email, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, Email, and Message are required' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Resend API key is not configured' });
  }

  const dateString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' (IST)';

  // Escaping simple HTML entities to prevent HTML injection in email content
  const escapeHtml = (text) => {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  };

  const escapedName = escapeHtml(name);
  const escapedEmail = escapeHtml(email);
  const escapedMessage = escapeHtml(message);

  // 1. Notification Email (to Yogesh)
  const adminHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Inquiry</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9f9f6;
      color: #1c1c1a;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f9f9f6;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e3e3de;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(28, 28, 26, 0.03);
    }
    .header {
      background-color: #2b50f7;
      padding: 30px;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .content {
      padding: 40px 30px;
    }
    .meta-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .meta-row {
      border-bottom: 1px solid #f0f0eb;
    }
    .meta-row:last-child {
      border-bottom: none;
    }
    .meta-label {
      padding: 15px 0;
      font-size: 12px;
      color: #7a7a72;
      text-transform: uppercase;
      font-weight: 600;
      letter-spacing: 0.5px;
      width: 30%;
    }
    .meta-value {
      padding: 15px 0;
      font-size: 15px;
      color: #1c1c1a;
      font-weight: 500;
    }
    .brief-title {
      font-size: 12px;
      color: #7a7a72;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 15px;
      margin-top: 10px;
    }
    .brief-content {
      background-color: #f9f9f6;
      border-left: 3px solid #2b50f7;
      padding: 20px;
      font-size: 15px;
      line-height: 1.6;
      color: #1c1c1a;
      border-radius: 0 8px 8px 0;
      white-space: pre-wrap;
    }
    .footer {
      background-color: #f9f9f6;
      padding: 25px 30px;
      border-top: 1px solid #e3e3de;
      text-align: center;
      font-size: 12px;
      color: #7a7a72;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <h1>New Portfolio Inquiry</h1>
      </div>
      <div class="content">
        <table class="meta-table">
          <tr class="meta-row">
            <td class="meta-label">Client Name</td>
            <td class="meta-value">${escapedName}</td>
          </tr>
          <tr class="meta-row">
            <td class="meta-label">Email Address</td>
            <td class="meta-value"><a href="mailto:${escapedEmail}" style="color: #2b50f7; text-decoration: none;">${escapedEmail}</a></td>
          </tr>
          <tr class="meta-row">
            <td class="meta-label">Submitted At</td>
            <td class="meta-value">${dateString}</td>
          </tr>
        </table>
        <div class="brief-title">Project Brief</div>
        <div class="brief-content">${escapedMessage}</div>
      </div>
      <div class="footer">
        This inquiry was sent from your portfolio contact form.
      </div>
    </div>
  </div>
</body>
</html>`;

  // 2. Auto-Reply Email (to Client)
  const clientHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f9f9f6;
      color: #1c1c1a;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f9f9f6;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #e3e3de;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(28, 28, 26, 0.03);
    }
    .header {
      padding: 40px 40px 20px 40px;
      border-bottom: 1px solid #f0f0eb;
    }
    .logo {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: 1px;
      color: #1c1c1a;
      text-transform: uppercase;
    }
    .content {
      padding: 40px;
    }
    .greeting {
      font-size: 20px;
      font-weight: 600;
      margin-top: 0;
      margin-bottom: 20px;
      color: #1c1c1a;
    }
    .body-text {
      font-size: 15px;
      line-height: 1.6;
      color: #7a7a72;
      margin-bottom: 30px;
    }
    .summary-card {
      background-color: #f9f9f6;
      border: 1px solid #e3e3de;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 35px;
    }
    .summary-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1c1c1a;
      margin-top: 0;
      margin-bottom: 15px;
    }
    .summary-item {
      font-size: 14px;
      line-height: 1.5;
      color: #7a7a72;
      margin-bottom: 10px;
    }
    .summary-item strong {
      color: #1c1c1a;
    }
    .action-btn-wrapper {
      margin-bottom: 10px;
    }
    .action-btn {
      display: inline-block;
      background-color: #2b50f7;
      color: #ffffff !important;
      text-decoration: none;
      padding: 15px 30px;
      font-size: 13px;
      font-weight: 600;
      border-radius: 30px;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(43, 80, 247, 0.2);
    }
    .signature {
      border-top: 1px solid #f0f0eb;
      padding-top: 30px;
      margin-top: 35px;
    }
    .sig-name {
      font-size: 15px;
      font-weight: 600;
      color: #1c1c1a;
      margin: 0 0 5px 0;
    }
    .sig-title {
      font-size: 13px;
      color: #7a7a72;
      margin: 0;
    }
    .footer {
      background-color: #f9f9f6;
      padding: 25px 40px;
      border-top: 1px solid #e3e3de;
      font-size: 12px;
      color: #7a7a72;
    }
    .footer a {
      color: #2b50f7;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo">PORTFOLIO</div>
      </div>
      <div class="content">
        <h2 class="greeting">Hello ${escapedName},</h2>
        <p class="body-text">
          Thank you for reaching out! I've received your project inquiry. I'm excited to learn more about what you're building. I will review your message and get back to you within 24 to 48 hours.
        </p>
        
        <div class="summary-card">
          <h3 class="summary-title">Summary of Your Inquiry</h3>
          <div class="summary-item"><strong>Name:</strong> ${escapedName}</div>
          <div class="summary-item"><strong>Email:</strong> ${escapedEmail}</div>
          <div class="summary-item" style="margin-bottom: 0;"><strong>Message Brief:</strong> ${escapedMessage}</div>
        </div>

        <div class="action-btn-wrapper">
          <a href="https://yogesh.studio/" target="_blank" class="action-btn">Visit Portfolio</a>
        </div>

        <div class="signature">
          <h4 class="sig-name">Yogesh Tundiya</h4>
          <p class="sig-title">Creative Web Designer & Developer</p>
        </div>
      </div>
      <div class="footer">
        &copy; 2026 Yogesh Tundiya. All rights reserved.<br>
        Bhavnagar, Gujarat, India.
      </div>
    </div>
  </div>
</body>
</html>`;

  try {
    // 1. Send Email to Admin (Yogesh)
    const adminEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: 'yogeshtundiya945@gmail.com',
        subject: `[Inquiry] New project from ${escapedName}`,
        html: adminHtml,
      }),
    });

    const adminData = await adminEmailRes.json();
    if (!adminEmailRes.ok) {
      throw new Error(`Failed to send notification: ${adminData.message || adminEmailRes.statusText}`);
    }

    // 2. Send Email to Client (Auto-reply)
    const clientEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Yogesh Tundiya <onboarding@resend.dev>',
        to: escapedEmail,
        subject: `Thank you for reaching out, ${escapedName}!`,
        html: clientHtml,
      }),
    });

    const clientData = await clientEmailRes.json();
    if (!clientEmailRes.ok) {
      console.error('Failed to send auto-reply:', clientData.message || clientEmailRes.statusText);
    }

    return res.status(200).json({ success: true, message: 'Emails processed successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: err.message });
  }
}
