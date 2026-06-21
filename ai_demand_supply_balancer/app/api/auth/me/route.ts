import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Admin from '@/models/Admin';

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token || !JWT_SECRET) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token ID:', decoded.id, 'Role:', decoded.role);
        await dbConnect();

        let user;
        if (decoded.role === 'admin') {
            user = await Admin.findById(decoded.id);
        } else {
            user = await Customer.findById(decoded.id);
        }

        if (!user) {
            console.log('User not found in database for ID:', decoded.id);
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: decoded.role
            },
            token
        });
    } catch (error) {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
}
