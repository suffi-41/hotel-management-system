import bcrypt from 'bcrypt';
import otpGenerator from "otp-generator"

// conver password to hash format
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// compare password with hash password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

export const otpGen = async () => {
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false, lowerCaseAlphabets: false });
  return otp;
}

export const htmlContentForTop = (digits) => {
  const htmlContent = `<div style="font-family: Arial; padding: 20px;">
                    <h2 style="color: #2d3436;">Account Verification</h2>
                    <p><strong>Message:</strong></p>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; ">
                      <p>Your verification code is:</p>
                      <div style="display:flex; gap:2; justify-content:space-around;">
                      <strong style="padding:5px; background:black; margin-left:2px; color:white; font:bold; font-size:1rem; border:2px soild black;">${digits[0]}</strong>
                      <strong style="padding:5px; background:black; margin-left:2px; color:white; font:bold; font-size:1rem; border:2px soild black;">${digits[1]}</strong>
                      <strong style="padding:5px; background:black; margin-left:2px; color:white; font:bold; font-size:1rem; border:2px soild black;">${digits[2]}</strong>
                      <strong style="padding:5px; background:black; margin-left:2px; color:white; font:bold; font-size:1rem; border:2px soild black;">${digits[3]}</strong>
                      <strong style="padding:5px; background:black; margin-left:2px; color:white; font:bold; font-size:1rem; border:2px soild black;">${digits[4]}</strong>
                      <strong style="padding:5px; background:black; margin-left:2px; color:white; font:bold; font-size:1rem; border:2px soild black;">${digits[5]}</strong>
                      </div>
                      <p></p>
                      <p>Don't share your otp wiht anyone !.</p>
                    </div>
                    <div style="margin-top: 20px;">
                      <p>Thank you for using our service.</p>
                      <p>Best regards,</p>
                      <p>Your Team</p>
                    </div>
                    <div style="margin-top: 20px;">
                      <p>Note: This is an automated message. Please do not reply to this email.</p>
                    </div>
                    </div>
                  </div>`;

  return htmlContent;
}

