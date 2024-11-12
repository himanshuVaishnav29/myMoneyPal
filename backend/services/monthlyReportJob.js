// import { sendMailAtFirstDayOfMonth as sendMail } from "./mailService.js";
// import cron from 'node-cron';


// // Schedule the job to run on the first day of every month at 00:00 (midnight)

// export function monthlyReportJob(){
//   cron.schedule('50 16 12 * *', async () => {
//     console.log("Cron job running: Sending monthly email...");
//     await sendMail();
//   });
// }