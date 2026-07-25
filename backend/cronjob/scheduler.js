import cron from 'node-cron';
import { updateProductStatus } from './updateProductStatus.js';

// Schedule to run at 00:00 UTC daily
cron.schedule('0 0 * * *', async () => {

  console.log('Running product status update job at', new Date().toISOString());

  try {
    const result = await updateProductStatus();
    console.log(result.message);
  } 
  catch (err) {
    console.error('Failed to run product status update job:', err);
  }

}, {
  scheduled: true,
  timezone: 'UTC'
});

console.log('Product status update scheduler started.');
