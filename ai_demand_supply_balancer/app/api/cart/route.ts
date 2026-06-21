import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Cart from '@/models/Cart';
import Product from '@/models/Product';
import { getUserIdFromToken } from '@/lib/auth';
import { checkLowStockAndNotify } from '@/lib/notifications';

export async function GET(request: NextRequest) {
    try {
        await dbConnect();
        const userId = getUserIdFromToken(request);

        if (!userId) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const cart = await Cart.findOne({ customerId: userId });
        if (!cart) return NextResponse.json([]);

        // Get latest stock for each item
        const itemsWithStock = await Promise.all(cart.items.map(async (item: any) => {
            const product = await Product.findById(item.productId);
            return {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
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

        // Validate stock for each item
        for (const item of items) {
            const product = await Product.findById(item.id || item.productId);
            if (!product) {
                return NextResponse.json({ message: `Product ${item.name} not found` }, { status: 404 });
            }
            if (item.quantity > product.stock) {
                return NextResponse.json({
                    message: `Only ${product.stock} units of ${product.name} are available.`
                }, { status: 400 });
            }

            // Proactively check for low stock notification
            await checkLowStockAndNotify(product._id);
        }

        const cart = await Cart.findOneAndUpdate(
            { customerId: userId },
            {
                customerId: userId,
                items: items.map((item: any) => ({
                    productId: item.id || item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    quantity: item.quantity
                }))
            },
            { upsert: true, new: true }
        );

        // Fetch latest stock for the response
        const itemsWithStock = await Promise.all(cart.items.map(async (item: any) => {
            const product = await Product.findById(item.productId);
            return {
                id: item.productId,
                name: item.name,
                price: item.price,
                image: item.image,
                quantity: item.quantity,
                stock: product ? product.stock : 0
            };
        }));

        return NextResponse.json(itemsWithStock);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
