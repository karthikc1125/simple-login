import nodemailer from "nodemailer";

interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
}

// Function to create transporter based on environment variables
const createTransporter = () => {
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587");
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;

    if (!host || !user || !pass) {
        return null;
    }

    return nodemailer.createTransport({
        host,
        port,
        secure: port === 465, // true for 465, false for other ports
        auth: {
            user,
            pass,
        },
    });
};

export async function sendOTP(email: string, otp: string): Promise<boolean> {
    const transporter = createTransporter();

    if (!transporter) {
        console.log(`[EMAIL MOCK] Would send OTP ${otp} to ${email}`);
        console.log("To enable real email sending, set SMTP_HOST, SMTP_PORT, SMTP_USER, and SMTP_PASS in backend/.env");
        return true; // Pretend we sent it
    }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || '"City Info App" <no-reply@cityinfo.com>',
            to: email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is: ${otp}. It expires in 10 minutes.`,
            html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Your OTP is:</p>
          <h1 style="color: #4CAF50; letter-spacing: 5px;">${otp}</h1>
          <p>This OTP will expire in 10 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
        });

        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
