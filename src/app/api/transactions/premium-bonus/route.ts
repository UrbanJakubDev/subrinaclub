import { NextResponse } from 'next/server';
import { transactionAPI } from '@/lib/services/transaction';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const quarter = searchParams.get('quarter');

        if (!year || !quarter) {
            return NextResponse.json(
                { error: 'Year and quarter parameters are required' },
                { status: 400 }
            );
        }

        const report = await transactionAPI.premiumBonusReport(
            Number(year),
            Number(quarter)
        );

        return NextResponse.json(report);
    } catch (error) {
        console.error('Error generating premium bonus report:', error);
        return NextResponse.json(
            { error: 'Error generating premium bonus report' },
            { status: 500 }
        );
    }
}
