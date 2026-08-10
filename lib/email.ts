import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const getTeamInviteTemplate = (teamName: string, inviteLink: string) => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f4f5; padding: 40px 0; width: 100%;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);">
        <div style="background: linear-gradient(135deg, #18181b 0%, #27272a 100%); padding: 40px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">YT Notes</h1>
          <p style="color: #a1a1aa; margin-top: 8px; font-size: 16px;">Enterprise Workspace</p>
        </div>
        <div style="padding: 48px 40px;">
          <h2 style="color: #18181b; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 16px;">You've been invited!</h2>
          <p style="color: #52525b; font-size: 16px; line-height: 26px; margin-bottom: 32px;">
            You have been invited to join the <strong>${teamName}</strong> team workspace on YT Notes. 
            Access shared AI summaries, collaborate with your team, and supercharge your learning.
          </p>
          <div style="text-align: center; margin-bottom: 40px;">
            <a href="${inviteLink}" style="display: inline-block; background-color: #3b82f6; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(59, 130, 246, 0.25);">
              Accept Invitation
            </a>
          </div>
          <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 32px 0;" />
          <p style="color: #71717a; font-size: 14px; line-height: 22px; margin-top: 0; margin-bottom: 0;">
            If the button doesn't work, copy and paste this link into your browser:
            <br>
            <a href="${inviteLink}" style="color: #3b82f6; word-break: break-all; text-decoration: none;">${inviteLink}</a>
          </p>
        </div>
      </div>
    </div>
  `;
};
