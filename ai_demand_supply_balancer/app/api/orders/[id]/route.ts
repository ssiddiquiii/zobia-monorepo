import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Order from '@/models/Order';
import Invoice from '@/models/Invoice';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const order = await Order.findById(id).populate('customerId', 'email');

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching order', error: error.message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { status } = await request.json();
        const { id } = await params;

        const updateData: any = { status };
        if (status === 'Delivered') {
            updateData.paymentStatus = 'Paid';
        }

        const order = await Order.findByIdAndUpdate(id, updateData, { new: true });

        if (!order) {
            return NextResponse.json({ message: 'Order not found' }, { status: 404 });
        }

        // If status is updated to Delivered, generate invoice automatically
        if (status === 'Delivered') {
            const invoiceCount = await Invoice.countDocuments();
            const invoiceNumber = `INV-${1000 + invoiceCount + 1}`;

            await Invoice.create({
                invoiceNumber,
                orderId: order._id,
                customerName: order.customerName,
                customerEmail: 'customer@example.com', // In a real app, this would come from the Customer model
                amount: order.total,
                status: 'Paid',
                items: order.items,
                billingAddress: order.shippingAddress,
                issuedDate: new Date()
            });
        }

        return NextResponse.json(order);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating order', error: error.message }, { status: 500 });
    }
}
