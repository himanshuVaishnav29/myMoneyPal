import nodemailer from "nodemailer";
import dotenv from 'dotenv';
dotenv.config();

// const mail= process.env.EMAIL;
// const key= process.env.PASS_KEY;


// console.log("mail",process.env.EMAIL);
// console.log("key",process.env.PASS_KEY);
// console.log("hello");

const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE ,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: true, 
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS_KEY,
    },
});

// const mailOptions = {
//     from: "your_email@gmail.com",
//     to: "recipient@example.com",
//     subject: "Hello from Nodemailer",
//     text: "This is a test email sent using Nodemailer.",
//   };



export async function sendMailAtFirstDayOfMonth() {

  try {
    const info = await transporter.sendMail({
        from: process.env.EMAIL, // sender address
        to: ["himanshu.29vaishnav@gmail.com","himanshu1268.be21@chitkarauniversity.edu.in"], // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });
      // console.log("Message sent: %s", info.messageId);
    console.log("Mail sent Successfully");
  } catch (error) {
    console.log("Error sending mail",error);
  }

}

