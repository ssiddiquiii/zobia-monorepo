import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();

        // Analyze recent sales velocity
        const recentCutoff = new Date();
        recentCutoff.setDate(recentCutoff.getDate() - 14); // Last 2 weeks

        const highVelocityTrends = await Order.aggregate([
            { $match: { date: { $gte: recentCutoff }, status: { $ne: 'Cancelled' } } },
            { $group: { _id: "$customerName", totalSpent: { $sum: "$total" }, orderCount: { $sum: 1 } } },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 }
        ]);

        // For product trends
        const productTrends = await Product.find({}).sort({ stock: 1 }).limit(5); // Products running low are "hot"

        return NextResponse.json({
            topCustomers: highVelocityTrends,
            trendingProducts: productTrends.map(p => ({
                name: p.name,
                stock: p.stock,
                category: p.category,
                trend: p.stock < 20 ? 'Critical' : 'Stable'
            }))
        });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error analyzing trends', error: error.message }, { status: 500 });
    }
}
