import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Admin from '@/models/Admin';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;

        let profile = await Customer.findById(id);

        if (!profile) {
            profile = await Admin.findById(id);
        }

        if (!profile) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Sanitize response for the modal
        const result = profile.toObject ? profile.toObject() : profile;
        const sanitizedProfile = {
            ...result,
            totalOrders: result.totalOrders || 0,
            totalSpent: result.totalSpent || 0,
            status: result.status || 'active',
            createdAt: result.createdAt || new Date()
        };

        return NextResponse.json(sanitizedProfile);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching customer', error: error.message }, { status: 500 });
    }
}
