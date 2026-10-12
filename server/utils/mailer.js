// Placeholder delivery: replace with a real email provider (for example
// Nodemailer, Resend or Amazon SES) before going to production.
const sendPasswordResetEmail = async (email, resetUrl) => {
  if (process.env.NODE_ENV === "production") {
    console.error(
      `Password reset requested for ${email}, but no email provider is configured`,
    );
    return;
  }

  console.log(`Password reset link for ${email}: ${resetUrl}`);
};

module.exports = {
  sendPasswordResetEmail,
};
