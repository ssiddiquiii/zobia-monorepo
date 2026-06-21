import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const type = searchParams.get('type') || 'monthly'; // monthly, quarterly, yearly

        const now = new Date();
        let startDate = new Date();

        if (type === 'monthly') {
            startDate.setMonth(now.getMonth() - 1);
        } else if (type === 'quarterly') {
            startDate.setMonth(now.getMonth() - 3);
        } else if (type === 'yearly') {
            startDate.setFullYear(now.getFullYear() - 1);
        }

        const data = await Order.aggregate([
            { $match: { date: { $gte: startDate }, status: { $ne: 'Cancelled' } } },
            {
                $group: {
                    _id: {
                        year: { $year: "$date" },
                        month: { $month: "$date" },
                        day: { $dayOfMonth: "$date" }
                    },
                    revenue: { $sum: "$total" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]);

        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error generating report', error: error.message }, { status: 500 });
    }
}
