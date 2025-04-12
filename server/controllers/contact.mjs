import Contact from "../models/Contact.mjs";
import mail from "../config/_mail.mjs";


export const contact = async (req, res) => {
  try {
    const { name, email, message, subject } = req.body;
    const newContact = new Contact({ name: name, email: email, subject: subject, message: message });
    const result = await newContact.save();
    if (result) {
      mail(email, subject, `
                <div style="font-family: Arial; padding: 20px;">
                  <h2 style="color: #2d3436;">New Guest Inquiry</h2>
                  <p><strong>Name:</strong> ${name}</p>
                  <p><strong>Email:</strong> ${email}</p>
                  <p><strong>Message:</strong></p>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 5px;">
                    ${message}
                  </div>
                  <p style="margin-top: 20px; color: #636e72;">
                    Sent from: ${req.headers.origin}
                  </p>
                </div>
              `)

    
      return res.status(200).json({ status: true, message: "Your message has been sent successfully!" });
    } else {
      return res.status(400).json({ status: false, message: "Failed to send message. Please try again laterd" });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ status: false, message: "Some error occupied!" })
  }
} 