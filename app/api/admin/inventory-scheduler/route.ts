// app/api/admin/inventory-scheduler/route.ts
import { NextResponse } from 'next/server';
import { startInventoryScheduler, stopInventoryScheduler, getInventorySchedulerStatus } from '@/lib/inventory-scheduler';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// Initialize scheduler
let initialized = false;

// GET endpoint to check scheduler status
export async function GET(request: Request) {
  try {
    // Only admins can access this endpoint
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return current status
    return NextResponse.json(getInventorySchedulerStatus());
  } catch (error) {
    console.error('Error checking scheduler status:', error);
    return NextResponse.json({ error: 'Failed to check scheduler status' }, { status: 500 });
  }
}

// POST endpoint to start scheduler
export async function POST(request: Request) {
  try {
    // Only admins can access this endpoint
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Start scheduler if it's not already running
    const interval = startInventoryScheduler();
    initialized = true;

    return NextResponse.json({ 
      message: 'Inventory scheduler started',
      status: getInventorySchedulerStatus()
    });
  } catch (error) {
    console.error('Error starting scheduler:', error);
    return NextResponse.json({ error: 'Failed to start scheduler' }, { status: 500 });
  }
}

// DELETE endpoint to stop scheduler
export async function DELETE(request: Request) {
  try {
    // Only admins can access this endpoint
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Stop the scheduler
    stopInventoryScheduler();
    
    return NextResponse.json({ 
      message: 'Inventory scheduler stopped',
      status: getInventorySchedulerStatus()
    });
  } catch (error) {
    console.error('Error stopping scheduler:', error);
    return NextResponse.json({ error: 'Failed to stop scheduler' }, { status: 500 });
  }
}
