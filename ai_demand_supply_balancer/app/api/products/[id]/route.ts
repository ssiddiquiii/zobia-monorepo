import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import QRCode from 'qrcode';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error fetching product';
        return NextResponse.json({ message: 'Error fetching product', error: message }, { status: 500 });
    }
}

export async function PATCH(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id } = await params;

        // If name or other identifying info changed, we might want to regenerate the QR code
        // For now, let's just update the product
        const product = await Product.findByIdAndUpdate(id, body, { new: true });

        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }

        // Regenerate QR code to ensure it's still valid/consistent if needed
        // (Optional: only if specific fields change)
        const qrData = `product:${product._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            color: {
                dark: '#d98a6c',
                light: '#0000',
            }
        });
        product.qrCode = qrCodeDataUrl;
        await product.save();

        // Check for low stock notification after update
        const { checkLowStockAndNotify } = await import('@/lib/notifications');
        await checkLowStockAndNotify(product._id.toString());

        return NextResponse.json(product);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error updating product';
        return NextResponse.json({ message: 'Error updating product', error: message }, { status: 400 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();
        const { id } = await params;
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.json({ message: 'Product not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error deleting product';
        return NextResponse.json({ message: 'Error deleting product', error: message }, { status: 500 });
    }
}
