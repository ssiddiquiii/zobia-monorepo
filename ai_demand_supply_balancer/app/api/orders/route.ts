import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Product from '@/models/Product';
import Customer from '@/models/Customer';
import Notification from '@/models/Notification';
import { checkLowStockAndNotify } from '@/lib/notifications';

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle CORS preflight from mobile app
export async function OPTIONS() {
    return NextResponse.json({}, { headers: CORS_HEADERS });
}

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const customerId = searchParams.get('customerId');

        const filter = customerId ? { customerId } : {};
        const orders = await Order.find(filter)
            .sort({ date: -1 })
            .populate('customerId', 'email');
        return NextResponse.json(orders, { headers: CORS_HEADERS });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error fetching orders';
        return NextResponse.json({ message: 'Error fetching orders', error: message }, { status: 500, headers: CORS_HEADERS });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        console.log('Order received:', body);

        // Validate and deduct stock
        if (body.items && Array.isArray(body.items)) {
            // Check all first
            for (const item of body.items) {
                const product = await Product.findById(item.productId);
                if (!product) {
                    return NextResponse.json({ message: `Product ${item.name} not found` }, { status: 404 });
                }
                if (product.stock < item.quantity) {
                    return NextResponse.json({ message: `Insufficient stock for ${product.name}` }, { status: 400 });
                }
            }

            // Deduct after validation
            for (const item of body.items) {
                const product = await Product.findById(item.productId);
                if (product) {
                    product.stock -= item.quantity;
                    await product.save();
                    // Trigger low stock check
                    await checkLowStockAndNotify(product._id.toString());
                }
            }
        }

        const order = await Order.create(body);

        // Update Customer stats
        if (body.customerId) {
            try {
                await Customer.findByIdAndUpdate(body.customerId, {
                    $inc: { totalOrders: 1, totalSpent: body.total || 0 },
                    $set: { lastOrderDate: new Date() }
                });
            } catch (custErr) {
                console.error('Failed to update customer stats:', custErr);
            }
        }

        // Create notification for admin
        try {
            await Notification.create({
                type: 'success',
                title: 'New Order Received',
                message: `New order #${order._id.toString().slice(-6).toUpperCase()} received from ${body.customerName || 'Customer'}.`,
                severity: 'medium',
                relatedEntity: {
                    type: 'order',
                    id: order._id.toString()
                }
            });
        } catch (notifError) {
            console.error('Failed to create order notification:', notifError);
        }

        console.log('Order created:', order._id);
        return NextResponse.json(order, { status: 201, headers: CORS_HEADERS });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error creating order';
        console.error('Checkout error API:', error);
        return NextResponse.json({ message: 'Error creating order', error: message }, { status: 400, headers: CORS_HEADERS });
    }
}
