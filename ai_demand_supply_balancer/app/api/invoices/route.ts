import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';

export async function GET() {
    try {
        await dbConnect();
        const invoices = await Invoice.find({}).sort({ issuedDate: -1 });
        return NextResponse.json(invoices);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching invoices', error: error.message }, { status: 500 });
    }
}
