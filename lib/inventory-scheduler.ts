// lib/inventory-scheduler.ts
import { generateInventoryStatusReport } from './inventory';

// This is a simple interval-based scheduler for inventory checks
// In a production environment, consider using a proper cron job service like node-cron or a task scheduler

const REPORT_INTERVAL = process.env.INVENTORY_REPORT_INTERVAL 
  ? parseInt(process.env.INVENTORY_REPORT_INTERVAL) 
  : 7 * 24 * 60 * 60 * 1000; // Default to weekly (7 days)

let schedulerInterval: NodeJS.Timeout | null = null;

// Start the scheduler
export function startInventoryScheduler() {
  // Clear any existing interval
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
  }

  console.log(`Starting inventory scheduler with interval of ${REPORT_INTERVAL / (24 * 60 * 60 * 1000)} days`);
  
  // Run immediately on start
  generateInventoryStatusReport().catch(error => {
    console.error('Error in initial inventory report:', error);
  });
  
  // Set up regular interval
  schedulerInterval = setInterval(() => {
    generateInventoryStatusReport().catch(error => {
      console.error('Error in scheduled inventory report:', error);
    });
  }, REPORT_INTERVAL);
  
  return schedulerInterval;
}

// Stop the scheduler
export function stopInventoryScheduler() {
  if (schedulerInterval) {
    clearInterval(schedulerInterval);
    schedulerInterval = null;
    console.log('Inventory scheduler stopped');
  }
}

// Get the current status
export function getInventorySchedulerStatus() {
  return {
    running: schedulerInterval !== null,
    interval: REPORT_INTERVAL / (24 * 60 * 60 * 1000), // Convert to days for readability
    nextRunTime: schedulerInterval ? new Date(Date.now() + REPORT_INTERVAL) : null
  };
}
