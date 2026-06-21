import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Warehouse from '@/models/Warehouse';

export async function GET() {
    try {
        await dbConnect();
        const warehouses = await Warehouse.find({}).sort({ createdAt: -1 });
        return NextResponse.json(warehouses);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching warehouses', error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const warehouse = await Warehouse.create(body);
        return NextResponse.json(warehouse, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error creating warehouse', error: error.message }, { status: 400 });
    }
}
