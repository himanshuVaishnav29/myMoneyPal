import nodemailer from "nodemailer";
import mongoose from "mongoose";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';
import handlebars from 'handlebars';
import pdf from 'html-pdf-node';
import fs from 'fs';
import path from 'path';
import USER from "../models/userSchema.js";
import TRANSACTION from "../models/transactionSchema.js";
import { formatName } from "../helpers/index.js";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
handlebars.registerHelper('increment', function(value) {
  return value + 1;
});

async function generatePDF(data) {
  // const __dirname = path.dirname(new URL(import.meta.url).pathname);
  const templatePath = path.join(__dirname, 'pdfTemplate.html');
  const templateSource = fs.readFileSync(templatePath, 'utf-8');
  const template = handlebars.compile(templateSource, {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true
  });
  const html = template(data);

  const options = { format: 'A4' };
  const file = { content: html };

  const pdfBuffer = await pdf.generatePdf(file, options);
  return pdfBuffer;
}

export async function sendMailAtFirstDayOfMonth() {
  try {

    const users = await USER.find({});
    // const now = new Date();
    // const lastMonth = new Date(today.setMonth(today.getMonth() - 1));
    // const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1); 
    // const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0); 

    // const startOfLastMonth = new Date(now.getUTCFullYear(), now.getUTCMonth() - 1, 1);
    // const endOfLastMonth = new Date(now.getUTCFullYear(), now.getUTCMonth(), 0); // 0 gives the last day of the previous month
    
    const now = new Date();
    const startOfLastMonthUTC = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const endOfLastMonthUTC = new Date(now.getFullYear(), now.getMonth(), 0);

    const convertToIST = (date) => {
        const offset = 5.5 * 60 * 60 * 1000; 
        return new Date(date.getTime() + offset);
    };
    const startOfLastMonth = convertToIST(startOfLastMonthUTC);
    const endOfLastMonth = convertToIST(endOfLastMonthUTC);
    console.log(startOfLastMonth,"str");
    console.log(endOfLastMonth,'end');

    const previousMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const previousMonth = previousMonthDate.toLocaleString('default', {
        month: 'long',
        year: 'numeric'
    });
    for (const user of users) {

        const userId=user._id;
        const transactions=await TRANSACTION.find({
          userId:userId,
          date: { $gte: startOfLastMonth, $lte: endOfLastMonth }
        });
  
        const categorizedTransactions = {
            expense: [],
            saving: [],
            investment: [],
        };

        let totalExpense = 0;
        let totalSaving = 0;
        let totalInvestment = 0;
        let upiTotal=0;
        let cashTotal=0;
        let cardTotal=0;
        const spendingByTag = {};

        // for (const transaction of transactions) {
        //     categorizedTransactions[transaction.category].push(transaction);

        //     // Calculate totals by category
        //     if (transaction.category === 'expense') totalExpense += transaction.amount;
        //     if (transaction.category === 'saving') totalSaving += transaction.amount;
        //     if (transaction.category === 'investment') totalInvestment += transaction.amount;

        //     if (transaction.paymentType === 'upi') upiTotal += transaction.amount;
        //     if (transaction.paymentType === 'card') cashTotal += transaction.amount;
        //     if (transaction.paymentType === 'cash') cardTotal += transaction.amount;
        // }

        const formattedTransactions = transactions.map(transaction => {
          const formattedTransaction = {
              ...transaction.toObject(),
              date: transaction.date ? transaction.date.toLocaleDateString() : '',
          };

          // Category and sum totals
          if (formattedTransaction.category === 'expense') {
              categorizedTransactions.expense.push(formattedTransaction);
              totalExpense += formattedTransaction.amount;
          }
          if (formattedTransaction.category === 'saving') {
              categorizedTransactions.saving.push(formattedTransaction);
              totalSaving += formattedTransaction.amount;
          }
          if (formattedTransaction.category === 'investment') {
              categorizedTransactions.investment.push(formattedTransaction);
              totalInvestment += formattedTransaction.amount;
          }
          if (formattedTransaction.paymentType === 'upi') upiTotal += formattedTransaction.amount;
          if (formattedTransaction.paymentType === 'cash') cashTotal += formattedTransaction.amount;
          if (formattedTransaction.paymentType === 'card') cardTotal += formattedTransaction.amount;

          const tag = formattedTransaction.tag || 'Uncategorized';
          spendingByTag[tag] = (spendingByTag[tag] || 0) + formattedTransaction.amount;

          return formattedTransaction;
        });

        const maxSpendingTag = Object.entries(spendingByTag).reduce(
          (maxTag, [tag, amount]) => amount > maxTag.amount ? { tag, amount } : maxTag,
          { tag: null, amount: 0 }
        );

        const data = {
            month: previousMonth,
            preparedBy: user.fullName,
            userName: formatName(user.fullName),
            email: user.email,
            accountCreationDate: user.createdAt ? user.createdAt.toLocaleDateString() : '',
            totalTransactionsMadeThisMonth:transactions.length,
            totalExpenses: totalExpense,
            totalInvestment:totalInvestment,
            totalSaving:totalSaving,
            upiTotal:upiTotal,
            maxSpendingTag:maxSpendingTag.tag,
            cashTotal:cashTotal,
            cardTotal:cardTotal,
            expenseRows: categorizedTransactions.expense,
            savingRows: categorizedTransactions.saving,
            investmentRows: categorizedTransactions.investment,
            transactionHistory: formattedTransactions.reverse(),
            notes: [
                'This is a monthly financial report generated by MyMoneyPal.',
                'Please check the transaction details and reach out for any discrepancies.',
                'In case of any queries, feel free to contact us back on this email'
            ]
        };

        let tagMessage = "";
            if (maxSpendingTag.amount > 0) {
                tagMessage = `It looks like <strong>"${maxSpendingTag.tag}"</strong> was your biggest spending area with a whopping <strong>₹${maxSpendingTag.amount}!</strong>`;
            }
        let totalTransactionMessage = transactions.length > 30
            ? "And whoa, you’ve been busy! Over 30 transactions this month alone? Budgeting must be your full-time job!"
            : transactions.length > 20
                ? "Seems like you've been swiping/scanning quite a bit! 20+ transactions – let's hope they were worth it!"
                : "A quiet month with fewer transactions. Maybe you're saving up for something big?";

        let expenseMessage = totalExpense > (totalSaving + totalInvestment)
            ? "Anyway, your expenses are leading the charge! A little less spending and a little more saving, perhaps?"
            : "Anyway, Nice job, keeping expenses under control! Your savings and investments are looking solid.";
        
        const pdfBuffer = await generatePDF(data);
        const name=formatName(user.fullName);
        await transporter.sendMail({
            from: process.env.EMAIL, // sender address
            to: user.email, 
            subject: `My MoneyPal Monthly Report for - ${data.month}`,
            // text: `
            //   Hey ${name}, Let's see how you did this month.<br>
            //   ${tagMessage}
            //   ${totalTransactionMessage}<
            //   ${expenseMessage}<br><br>
            //   Keep up the great work with your finances!<br>
            //   Best Regards,<br>
            //   Himanshu Vaishnav from MoneyPal
            // `,
            html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <p>Hey <strong>${name}</strong>,</p>
                <p>Let's take a quick look at how you did this month:</p>
                <p style="margin-top: 10px;">${tagMessage}</p>
                <p>${totalTransactionMessage}</p>
                <p>${expenseMessage}</p>
                <br>
                <p>Keep up the great work with your finances!</p>
                <p>Best Regards,</p>
                <p>
                  <strong>Himanshu Vaishnav</strong>
                  <br>
                  My MoneyPal [Master Your Finances!]
                </p>
            </div>
          `,
            attachments: [
                {
                    filename: "Monthly_Report.pdf",
                    content: pdfBuffer,
                    contentType: 'application/pdf',
                },
            ],
        });
    }
  } catch (error) {
    console.log("Error sending mail",error);
  }finally{
    console.log("Mail sent Successfully");
  }

}

export async function sendOTPEmail(email, otp) {
  try {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', { 
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
    
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: `Password Reset OTP - My MoneyPal (${formattedDate})`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 15px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
          <div style="background: white; margin: 3px; border-radius: 12px; padding: 40px 30px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #e91e63; font-size: 28px; margin: 0; font-weight: 700;">🔐 My MoneyPal</h1>
              <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Secure Password Reset</p>
            </div>
            
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 2px; border-radius: 12px; margin: 25px 0;">
              <div style="background: white; padding: 25px; border-radius: 10px; text-align: center;">
                <p style="margin: 0 0 15px 0; color: #555; font-size: 16px;">Your verification code is:</p>
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; margin: 15px 0;">
                  <h1 style="color: white; font-size: 36px; margin: 0; letter-spacing: 8px; font-weight: 700; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${otp}</h1>
                </div>
                <p style="margin: 15px 0 0 0; color: #e91e63; font-weight: 600; font-size: 14px;">⏰ Valid for 10 minutes only</p>
              </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #e91e63; margin: 25px 0;">
              <p style="margin: 0; color: #555; font-size: 14px;">🛡️ <strong>Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account remains secure.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">Best Regards,</p>
              <p style="margin: 5px 0 0 0; color: #e91e63; font-weight: 600;">My MoneyPal Team</p>
              <p style="margin: 10px 0 0 0; color: #ccc; font-size: 11px;">Master Your Finances 💰</p>
            </div>
          </div>
        </div>
      `
    });
    console.log("OTP email sent successfully");
  } catch (error) {
    console.log("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
}

