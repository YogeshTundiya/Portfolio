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

  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      body = {};
    }
  } else if (!body || Object.keys(body).length === 0) {
    try {
      const buffers = [];
      for await (const chunk of req) {
        buffers.push(chunk);
      }
      const rawBody = Buffer.concat(buffers).toString();
      body = JSON.parse(rawBody);
    } catch (e) {
      body = {};
    }
  }

  const { name, email, message } = body || {};

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
<title>New Inquiry Received</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f9f9f6">
<tr>
<td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;margin:40px auto;border-radius:24px;overflow:hidden;border:1px solid #e3e3de;">
  <!-- Header -->
  <tr>
    <td style="padding:30px 40px;">
      <table width="100%">
        <tr>
          <td align="left" style="font-size:24px;font-weight:800;color:#1c1c1a;letter-spacing:1px;text-transform:uppercase;">
            PORTFOLIO
          </td>
          <td align="right">
            <span style="font-size:11px;background:#e8ecfe;padding:10px 18px;border-radius:30px;color:#2b50f7;border:1px solid #2b50f7;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
              ● New Client Inquiry
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Hero -->
  <tr>
    <td align="center" style="padding:20px 40px 10px;">
      <div style="font-size:80px;font-weight:900;line-height:1;color:#ececec;letter-spacing:8px;">
        INQUIRY
      </div>
      <img src="https://yogesh-tundiya.vercel.app/assets/My.png" width="280" style="display:block;margin-top:-70px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.05);" alt="Yogesh Tundiya">
    </td>
  </tr>
  <!-- Content -->
  <tr>
    <td align="center" style="padding:10px 50px 20px;">
      <div style="font-size:12px;letter-spacing:3px;font-weight:bold;color:#7a7a72;text-transform:uppercase;margin-bottom:20px;">
        Submission Details
      </div>
      <h1 style="font-size:36px;line-height:44px;color:#1c1c1a;margin:0;font-weight:800;">
        New Lead from ${escapedName}
      </h1>
      
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:25px;text-align:left;font-size:14px;line-height:24px;color:#1c1c1a;">
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0eb;color:#7a7a72;width:30%;font-weight:600;">Client Name:</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0eb;font-weight:500;">${escapedName}</td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0eb;color:#7a7a72;font-weight:600;">Client Email:</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0eb;font-weight:500;"><a href="mailto:${escapedEmail}" style="color:#2b50f7;text-decoration:none;">${escapedEmail}</a></td>
        </tr>
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0eb;color:#7a7a72;font-weight:600;">Submitted At:</td>
          <td style="padding:10px 0;border-bottom:1px solid #f0f0eb;font-weight:500;">${dateString}</td>
        </tr>
      </table>

      <p style="font-size:15px;line-height:26px;color:#1c1c1a;margin-top:25px;text-align:left;background:#f9f9f6;border-left:3px solid #2b50f7;padding:20px;border-radius:0 8px 8px 0;">
        <strong>Project Brief:</strong><br>
        "${escapedMessage}"
      </p>
    </td>
  </tr>
  <!-- CTA -->
  <tr>
    <td align="center" style="padding:10px 40px 40px;">
      <a href="mailto:${escapedEmail}" style="display:inline-block;background:#2b50f7;color:#ffffff;text-decoration:none;padding:18px 42px;border-radius:30px;font-weight:bold;letter-spacing:1px;font-size:13px;text-transform:uppercase;box-shadow:0 4px 12px rgba(43,80,247,0.25);">
        Reply to ${escapedName}
      </a>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td align="center" style="padding:35px;background:#f9f9f6;font-size:12px;color:#7a7a72;border-top:1px solid #e3e3de;">
      This notification was sent from your portfolio contact form.<br><br>
      &copy; 2026 Yogesh Tundiya. All rights reserved.
    </td>
  </tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;

  // 2. Auto-Reply Email (to Client)
  const clientHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Thank You for Getting in Touch</title>
</head>
<body style="margin:0;padding:0;background:#f9f9f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f9f9f6">
<tr>
<td align="center">
<table width="640" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;margin:40px auto;border-radius:24px;overflow:hidden;border:1px solid #e3e3de;">
  <!-- Header -->
  <tr>
    <td style="padding:30px 40px;">
      <table width="100%">
        <tr>
          <td align="left" style="font-size:24px;font-weight:800;color:#1c1c1a;letter-spacing:1px;text-transform:uppercase;">
            PORTFOLIO
          </td>
          <td align="right">
            <span style="font-size:11px;background:#e8ecfe;padding:10px 18px;border-radius:30px;color:#2b50f7;border:1px solid #2b50f7;font-weight:600;text-transform:uppercase;letter-spacing:0.5px;">
              ● Available for Freelance
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Hero -->
  <tr>
    <td align="center" style="padding:20px 40px 10px;">
      <div style="font-size:80px;font-weight:900;line-height:1;color:#ececec;letter-spacing:8px;">
        YOGESH
      </div>
      <img src="https://yogesh-tundiya.vercel.app/assets/My.png" width="280" style="display:block;margin-top:-70px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,0.05);" alt="Yogesh Tundiya">
    </td>
  </tr>
  <!-- Content -->
  <tr>
    <td align="center" style="padding:10px 50px 20px;">
      <div style="font-size:12px;letter-spacing:3px;font-weight:bold;color:#7a7a72;text-transform:uppercase;margin-bottom:20px;">
        MESSAGE RECEIVED
      </div>
      <h1 style="font-size:36px;line-height:44px;color:#1c1c1a;margin:0;font-weight:800;">
        Thank You for Reaching Out!
      </h1>
      <p style="font-size:16px;line-height:28px;color:#7a7a72;margin-top:20px;max-width:480px;text-align:left;background:#f9f9f6;border-left:3px solid #2b50f7;padding:20px;border-radius:0 8px 8px 0;">
        <strong>Hello ${escapedName},</strong><br><br>
        I have received your project inquiry and message brief. I'm excited to learn more about what you're crafting! I will review the details and get back to you within 24 to 48 hours.<br><br>
        <strong>Your Project Brief:</strong><br>
        "${escapedMessage}"
      </p>
    </td>
  </tr>
  <!-- CTA -->
  <tr>
    <td align="center" style="padding:10px 40px 40px;">
      <a href="https://yogesh-tundiya.vercel.app/" style="display:inline-block;background:#2b50f7;color:#ffffff;text-decoration:none;padding:18px 42px;border-radius:30px;font-weight:bold;letter-spacing:1px;font-size:13px;text-transform:uppercase;box-shadow:0 4px 12px rgba(43,80,247,0.25);">
        Visit Portfolio
      </a>
    </td>
  </tr>
  <!-- Divider -->
  <tr>
    <td style="padding:0 40px;">
      <hr style="border:none;border-top:1px solid #e3e3de;">
    </td>
  </tr>
  <!-- Skills / Stats -->
  <tr>
    <td style="padding:35px 40px;">
      <table width="100%">
        <tr>
          <td align="center">
            <div style="font-size:24px;font-weight:800;color:#1c1c1a;">B.Tech</div>
            <div style="font-size:12px;color:#7a7a72;margin-top:4px;">Computer Science</div>
          </td>
          <td align="center">
            <div style="font-size:24px;font-weight:800;color:#1c1c1a;">15+</div>
            <div style="font-size:12px;color:#7a7a72;margin-top:4px;">Crafts Completed</div>
          </td>
          <td align="center">
            <div style="font-size:24px;font-weight:800;color:#1c1c1a;">100%</div>
            <div style="font-size:12px;color:#7a7a72;margin-top:4px;">Clean & Fluid Code</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
  <!-- Footer -->
  <tr>
    <td align="center" style="padding:35px;background:#f9f9f6;font-size:12px;color:#7a7a72;border-top:1px solid #e3e3de;">
      This auto-reply was generated from the contact form on <a href="https://yogesh-tundiya.vercel.app/" style="color:#2b50f7;text-decoration:none;font-weight:600;">yogesh-tundiya.vercel.app</a>.<br><br>
      &copy; 2026 Yogesh Tundiya. All rights reserved.
    </td>
  </tr>
</table>
</td>
</tr>
</table>
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
    // NOTE: In Resend's free tier sandbox mode, you can ONLY send emails to your verified account email (yogeshtundiya945@gmail.com).
    // Attempting to send to the client's email (escapedEmail) will cause Resend to return a 403 error.
    // Therefore, we send a [Copy] of the auto-reply to YOUR email so you get a receipt and can see what it looks like.
    // 
    // ONCE YOU VERIFY A CUSTOM DOMAIN:
    // Change 'to: "yogeshtundiya945@gmail.com"' below to 'to: escapedEmail' to send it to the client!
    const clientEmailRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Yogesh Tundiya <onboarding@resend.dev>',
        to: 'yogeshtundiya945@gmail.com', // Bypasses sandbox error. Change to escapedEmail once domain is verified!
        subject: `[Receipt Copy] Thank you for reaching out, ${escapedName}!`,
        html: clientHtml,
      }),
    });

    const clientData = await clientEmailRes.json();
    if (!clientEmailRes.ok) {
      console.error('Failed to send auto-reply receipt copy:', clientData.message || clientEmailRes.statusText);
    }

    return res.status(200).json({ success: true, message: 'Emails processed successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ error: err.message });
  }
}
