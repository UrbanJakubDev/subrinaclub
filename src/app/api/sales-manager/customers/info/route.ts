import { prisma } from '@/lib/db/pgDBClient';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const salesManagerId = searchParams.get('salesManagerId');
    const year = searchParams.get('year');

    if (!salesManagerId || !year) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Your existing logic here
    const customers = await prisma.customer.findMany({
      where: {
        salesManagerId: parseInt(salesManagerId)
      },
      include: {
        account: true
      }
    });

    const allCustomers = customers.length;
    const systemActiveCustomers = customers.filter(customer => customer.active).length;
    const activeCustomers = customers.filter(customer => customer.active && customer?.account?.currentYearPoints > 0).length;
    
    
    
    return NextResponse.json({
      allCustomers,
      systemActiveCustomers,
      activeCustomers
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
