import nodemailer from 'nodemailer'
const mail = (userEmail, subject, htmlContent) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gamil',
      host: "smtp.gmail.com",
      port: 587,
      auth: {
        user: 'mohdbinsufiyan@gmail.com',
        pass: 'myex olvy kmnf cuze'
      } 
    });
    const mailOptions = {
      from: process.env.webEmail,
      to: userEmail,
      subject: subject,
      html: htmlContent,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error.message);
      } else {
        return info.response
      }
    });

  } catch (error) {
    console.log(error)
  }
}
export default mail;
