import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import QRCode from 'qrcode';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const limit = searchParams.get('limit');

        let query = {};
        if (category) {
            // Case-insensitive regex for category to be safe
            query = { category: { $regex: new RegExp(`^${category}$`, 'i') } };
        }

        let productsQuery = Product.find(query).sort({ createdAt: -1 });

        if (limit) {
            productsQuery = productsQuery.limit(parseInt(limit));
        }

        const products = await productsQuery.lean();
        return NextResponse.json(products);
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Error processing request';
        return NextResponse.json({ message: 'Error processing request', error: message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // 1. Create the product first to get the ID
        const product = new Product(body);

        // 2. Generate QR Code based on the product ID (or a specific URL if provided)
        // We'll encode the product ID as a starting point, or a deep link
        const qrData = `product:${product._id}`;
        const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
            color: {
                dark: '#d98a6c', // Brand color
                light: '#0000', // Transparent
            }
        });

        product.qrCode = qrCodeDataUrl;
        await product.save();

        return NextResponse.json(product, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error creating product', error: error.message }, { status: 400 });
    }
}
