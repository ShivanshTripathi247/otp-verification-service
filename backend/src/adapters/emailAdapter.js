/**
 * This file connects our application to our gmail
 * account for OTP delivery service
 */

import { EMAIL, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../utils/helper.js";
import nodemailer from 'nodemailer';


class emailSender {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT,
            secure: true,
            auth: {
                user: SMTP_USER,
                pass: SMTP_PASS,
            }
        });
    }
    sendEmail(email, code) {
        const mailOptions = {
            from: EMAIL,
            to: email,
            subject: "Distributed OTP Verification Service",
            html: `
                <div style="font-family: Arial, Helvetica, sans-serif; background:#f6f7fb; padding:30px;">
                    <div style="max-width:520px; margin:0 auto; background:#ffffff; border-radius:14px; overflow:hidden; box-shadow:0 8px 30px rgba(0,0,0,0.08);">
                    
                    <div style="background:#111827; padding:22px 26px;">
                        <h1 style="margin:0; font-size:18px; font-weight:600; color:#ffffff;">
                        Distributed OTP Verification Service
                        </h1>
                        <p style="margin:6px 0 0; font-size:13px; color:#cbd5e1;">
                        Secure login verification
                        </p>
                    </div>

                    <div style="padding:26px;">
                        <p style="margin:0 0 14px; font-size:15px; color:#111827;">
                        Hi,
                        </p>

                        <p style="margin:0 0 18px; font-size:14px; color:#374151; line-height:1.6;">
                        Use the OTP below to complete your verification. This OTP is valid for 5 minutes and should not be shared with anyone.
                        </p>

                        <div style="text-align:center; margin:22px 0;">
                        <div style="display:inline-block; background:#f3f4f6; border:1px dashed #9ca3af; border-radius:12px; padding:14px 20px;">
                            <span style="letter-spacing:6px; font-size:26px; font-weight:700; color:#111827;">
                            ${code}
                            </span>
                        </div>
                        </div>

                        <p style="margin:0; font-size:13px; color:#6b7280; line-height:1.6;">
                        If you didn’t request this OTP, you can safely ignore this email.
                        </p>
                    </div>

                    <div style="background:#f9fafb; padding:14px 22px; text-align:center;">
                        <p style="margin:0; font-size:12px; color:#9ca3af;">
                        © ${new Date().getFullYear()} Distributed OTP Verification Service
                        </p>
                    </div>
                    </div>
                </div>
                `

        };
        this.transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log("Error sending email: ", err);
            } else {
                console.log(`Email sent: `+ info.response);
                
            }
        });
    }
}

export const emailSenderObj = new emailSender();

