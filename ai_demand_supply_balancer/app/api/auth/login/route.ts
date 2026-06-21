import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Customer from '@/models/Customer';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { email, password, requiredRole } = body;

        // Validation
        if (!email || !password) {
            return NextResponse.json(
                { message: 'Please provide email and password' },
                { status: 400 }
            );
        }

        let user = null;
        let role = '';

        if (requiredRole === 'admin') {
            user = await Admin.findOne({ email }).select('+password');
            role = user ? user.role : 'admin';
        } else if (requiredRole === 'customer') {
            user = await Customer.findOne({ email }).select('+password');
            role = 'customer';
        } else {
            // Maintening backwards compatibility or default behavior
            // Try to find as Admin first
            user = await Admin.findOne({ email }).select('+password');
            role = user ? user.role : 'admin';

            if (!user) {
                // Try to find as Customer
                user = await Customer.findOne({ email }).select('+password');
                role = 'customer';
            }
        }

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password || '');
        if (!isMatch) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, role },
            JWT_SECRET!,
            { expiresIn: '1d' }
        );

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 1 day
        });

        // Return user data
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role
        };

        return NextResponse.json(
            {
                message: 'Login successful',
                user: userData,
                admin: role === 'admin' ? userData : null, // Support for frontend expecting 'admin'
                token
            },
            { status: 200 }
        );

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Error logging in', error: error.message },
            { status: 500 }
        );
    }
}
