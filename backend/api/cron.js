// api/cron.js
import { sendMailAtFirstDayOfMonth } from '../services/mailService';

export default async function handler(req, res) {
    if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
        return res.status(401).end('Unauthorized');
    }
    try {
        await sendMailAtFirstDayOfMonth();
        res.status(200).send('Monthly report sent successfully.');
    } catch (error) {
        console.error('Error sending monthly report:', error);
        res.status(500).send('Failed to send monthly report.');
    }
}
