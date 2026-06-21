import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';
import Customer from '@/models/Customer';

export async function GET() {
    try {
        await dbConnect();

        // Aggregate Total Revenue
        const revenueResult = await Order.aggregate([
            { $match: { status: { $ne: 'Cancelled' } } },
            { $group: { _id: null, totalRevenue: { $sum: '$total' } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Active Orders (Processing or Shipped)
        const activeOrdersCount = await Order.countDocuments({
            status: { $in: ['Processing', 'Shipped'] }
        });

        // Total Products
        const totalProductsCount = await Product.countDocuments({});

        // Total Customers
        const totalCustomersCount = await Customer.countDocuments({});

        return NextResponse.json({
            totalRevenue: `$${totalRevenue.toLocaleString()}`,
            activeOrders: activeOrdersCount,
            totalProducts: totalProductsCount,
            customers: totalCustomersCount,
            // Change percentages (Mocked for now as we don't have historical data)
            revenueChange: '+12%',
            ordersChange: '+5',
            productsChange: '+2',
            customersChange: '+18%'
        });
    } catch (error: any) {
        console.error('Stats API Error:', error);
        return NextResponse.json({ message: 'Error fetching stats', error: error.message }, { status: 500 });
    }
}
