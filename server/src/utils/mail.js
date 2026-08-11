import Mailgen from 'mailgen';
import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Generate textual and HTML email content using Mailgen
    const mailgenerator = new Mailgen({
        theme: "default",
        product: {
            name: "ASTRO",
            link: process.env.CLIENT_URL || "https://demomailtrap.co"
        }
    });

    const emailTextual = options.mailgenContent
        ? mailgenerator.generatePlaintext(options.mailgenContent)
        : options.text || "";

    const emailHtml = options.mailgenContent
        ? mailgenerator.generate(options.mailgenContent)
        : options.html || "";

    // 2. Create Mailtrap SMTP transport using environment variables
    const smtpHost = (process.env.MAILTRAP_SMTP_HOST || "live.smtp.mailtrap.io")
        .trim()
        .replace("sanbox", "sandbox");

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.MAILTRAP_SMTP_PORT) || 587,
        auth: {
            user: (process.env.MAILTRAP_SMTP_USER || "api").trim(),
            pass: (process.env.MAILTRAP_SMTP_PASS || "").trim()
        }
    });

    // 3. Define mail options
    const mail = {
        from: process.env.MAIL_FROM || "ASTRO <hello@demomailtrap.co>",
        to: options.email,
        subject: options.subject,
        text: emailTextual,
        html: emailHtml
    };

    // 4. Send email and log message ID
    try {
        const info = await transporter.sendMail(mail);
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("EMAIL SERVICE FAILED");
        console.error("Error:", error);
        throw error;
    }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,
            intro: "WELCOME TO OUR APP! EXCITED TO HAVE YOU.",
            action: {
                instructions: "TO VERIFY YOUR EMAIL PLEASE CLICK ON THE FOLLOWING BUTTON:",
                button: {
                    color: "#22BC66",
                    text: "VERIFY YOUR EMAIL",
                    link: verificationUrl
                }
            },
            outro: "NEED HELP, OR HAVE ANY QUESTIONS? REPLY TO THIS EMAIL."
        }
    };
};

const forgotPasswordMailgenContent = (username, PasswordResetUrl) => {
    return {
        body: {
            name: username,
            intro: "WE RECEIVED A REQUEST TO RESET YOUR PASSWORD. CLICK ON THE FOLLOWING BUTTON:",
            action: {
                instructions: "TO RESET YOUR PASSWORD PLEASE CLICK ON THE FOLLOWING BUTTON:",
                button: {
                    color: "#22BC66",
                    text: "RESET PASSWORD",
                    link: PasswordResetUrl
                }
            },
            outro: "NEED HELP, OR HAVE ANY QUESTIONS? REPLY TO THIS EMAIL."
        }
    };
};

export {
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
    sendEmail
};