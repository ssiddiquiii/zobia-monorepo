import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Order from '@/models/Order';

export async function GET() {
    try {
        await dbConnect();

        const alerts: {
            type: 'success' | 'warning' | 'error' | 'info';
            title: string;
            message: string;
            severity: 'low' | 'medium' | 'high' | 'critical';
            relatedEntity: {
                type: 'product' | 'order' | 'warehouse';
                id: string;
            };
            productId?: string;
            orderId?: string;
            timestamp: Date;
        }[] = [];

        // Check for low stock products (threshold: < 10 units)
        const lowStockProducts = await Product.find({ stock: { $lt: 10 } });

        for (const product of lowStockProducts) {
            alerts.push({
                type: 'warning',
                title: 'Low Stock Alert',
                message: `${product.name} has only ${product.stock} units remaining.`,
                severity: product.stock < 5 ? 'critical' : 'high',
                relatedEntity: {
                    type: 'product',
                    id: product._id.toString()
                },
                productId: product._id,
                timestamp: new Date()
            });
        }

        // Check for high-value orders in the last 24 hours
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        const highValueOrders = await Order.find({
            total: { $gt: 500 },
            date: { $gte: yesterday },
            status: { $ne: 'Cancelled' }
        }).sort({ date: -1 }).limit(5);

        for (const order of highValueOrders) {
            alerts.push({
                type: 'success',
                title: 'High-Value Order',
                message: `New order from ${order.customerName} worth $${order.total.toLocaleString()}.`,
                severity: 'medium',
                relatedEntity: {
                    type: 'order',
                    id: order._id.toString()
                },
                orderId: order._id,
                timestamp: order.date
            });
        }

        // Sort by timestamp (most recent first)
        alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

        return NextResponse.json({ alerts, count: alerts.length });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error fetching alerts';
        return NextResponse.json({ message: 'Error fetching alerts', error: message }, { status: 500 });
    }
}
