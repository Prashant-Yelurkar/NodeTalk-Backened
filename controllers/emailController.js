import { sendEmail } from "../utils/sendEmail.js";

const welcomeEmail = async({to}) =>{
    try {
    await sendEmail({
      to,
      subject: 'Welcome to NodeTalk',
      text: "Hello, welcome to NodeTalk! We're excited to have you on board.",
    });

    return ({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email sending failed:', err);
    return ({ success: false, error: 'Failed to send email' });
  }
}

const loginEmail = async({to}) =>{
    try {
    await sendEmail({
      to,
      subject: 'Welcome to NodeTalk',
      text: "Hello, welcome to NodeTalk! New Login detected",
    });

    return ({ success: true, message: 'Email sent successfully!' });
  } catch (err) {
    console.error('Email sending failed:', err);
    return ({ success: false, error: 'Failed to send email' });
  }
}

const resetPasswordEmail = async({to, resetLink}) =>{
    try {
    await sendEmail({
      to,
      subject: 'Reset Password',
      text: `Hello, to reset your password, please click on the following link: ${resetLink}
      link will expire in 5 minutes.`,
    });

    return ({ success: true, message: 'Reset password email sent successfully!' });
  } catch (err) {
    console.error('Reset password email sending failed:', err);
    return ({ success: false, error: 'Failed to send reset password email' });
  }
} 

export {welcomeEmail , loginEmail , resetPasswordEmail}