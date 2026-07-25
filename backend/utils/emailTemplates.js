export const otpEmail = (otp) => {

    return {
      subject: 'Your OTP for CollegeBazaar Signup',
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p>Here is your <strong>OTP</strong> to complete signup on <b>CollegeBazaar</b>:</p>
          <h1 style="letter-spacing: 2px;">${otp}</h1>
          <p>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone.</p>
          <br/>
          <p style="color: grey; font-size: 12px;">If you didn’t request this, you can ignore this email.</p>
        </div>
      `
    };

};
  
  
export const signupSuccess = (name) => {

    return {
      subject: 'Welcome to CollegeBazaar 🎉',
      html: `
        <div style="font-family: sans-serif;">
          <h2>Welcome, ${name}!</h2>
          <p>You've successfully signed up on <b>CollegeBazaar</b>.</p>
          <p>Start browsing products or post your own now!</p>
          <br/>
          <p>We're glad to have you onboard 🚀</p>
          <hr />
          <p style="font-size: 12px; color: gray;">This is an automated email, please don’t reply.</p>
        </div>
      `
    };
    
};

export const loginNotification = (email, loginTime, ipAddress) => {

    return {
      subject: 'New Login Alert on CollegeBazaar',
      html: `
        <div style="font-family: sans-serif;">
          <p>A new login was detected on your account: ${email}</p>
          <ul>
            <li><strong>Time:</strong> ${loginTime}</li>
            <li><strong>IP Address:</strong> ${ipAddress}</li>
          </ul>
          <p>If this was you, you’re good to go. If not, please change your password immediately.</p>
          <br/>
          <p style="font-size: 12px; color: gray;">CollegeBazaar Security Team</p>
        </div>
      `
    };

};
  
  
    