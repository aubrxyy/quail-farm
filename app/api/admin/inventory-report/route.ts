// app/api/admin/inventory-report/route.ts
import { NextResponse } from 'next/server';
import { generateInventoryStatusReport } from '@/lib/inventory';
import { decrypt } from '@/lib/session';
import { cookies } from 'next/headers';

// POST endpoint to generate a report on demand
export async function POST() {
  try {
    // Only admins can access this endpoint
    const session = (await cookies()).get('session')?.value;
    const payload = await decrypt(session);
    
    if (!payload || payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Generate inventory report
    const productsCount = await generateInventoryStatusReport();
    
    return NextResponse.json({ 
      message: `Inventory report generated for ${productsCount || 0} low stock products`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating inventory report:', error);
    return NextResponse.json({ error: 'Failed to generate inventory report' }, { status: 500 });
  }
}
