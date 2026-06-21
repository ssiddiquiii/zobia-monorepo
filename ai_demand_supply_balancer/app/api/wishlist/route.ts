import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';
import { getUserIdFromToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const userId = getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const wishlist = await Wishlist.findOne({ customerId: userId });
        if (!wishlist) return NextResponse.json([]);

        // Get latest stock for each item
        const itemsWithStock = await Promise.all(wishlist.items.map(async (item: any) => {
            const product = await (await import('@/models/Product')).default.findById(item.productId);
            return {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                stock: product ? product.stock : 0
            };
        }));

        return NextResponse.json(itemsWithStock);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        await dbConnect();
        const userId = getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { items } = await request.json();

        const wishlist = await Wishlist.findOneAndUpdate(
            { customerId: userId },
            {
                customerId: userId,
                items: items.map((item: any) => ({
                    productId: item.id || item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image
                }))
            },
            { upsert: true, new: true }
        );

        return NextResponse.json(wishlist.items);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
