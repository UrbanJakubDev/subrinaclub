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
    
    return NextResponse.json({ 
      allCustomers: 0,
      systemActiveCustomers: 0,
      activeCustomers: 0
    });

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
