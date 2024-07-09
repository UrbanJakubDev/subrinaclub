import {
    createSavingPeriod,
    getSavingPeriodById,
    updateSavingPeriod,
} from '@/db/queries/savingPeridos';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const savingPeriodId = searchParams.get('id');

    if (!savingPeriodId) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const savingPeriod = await getSavingPeriodById(Number(savingPeriodId));

    return NextResponse.json(savingPeriod);
}

export async function PUT(request: Request) {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const savingPeriodId = searchParams.get('id');

    try {
        const savingPeriod = await updateSavingPeriod(Number(savingPeriodId), body);
        return NextResponse.json(savingPeriod);
    } catch (error) {
        console.error('Error updating saving period:', error);
        return NextResponse.json({ error: 'Error updating saving period' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get('account_id');

    try {
        const savingPeriod = await createSavingPeriod(Number(accountId), body);
        return NextResponse.json(savingPeriod);
    } catch (error) {
        console.error('Error creating saving period:', error);
        return NextResponse.json({ error: 'Error creating saving period' }, { status: 500 });
    }
}
