import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Admin from '@/models/Admin';
import Customer from '@/models/Customer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import NotificationModel from '@/models/Notification';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request: Request) {
    try {
        if (!JWT_SECRET) {
            return NextResponse.json({ message: 'Server configuration error: JWT_SECRET missing' }, { status: 500 });
        }

        await dbConnect();
        const body = await request.json();
        const { name, email, password, role = 'customer' } = body;

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: 'Please provide all required fields' },
                { status: 400 }
            );
        }

        // Check if user already exists as Admin or Customer
        const existingAdmin = await Admin.findOne({ email });
        const existingCustomer = await Customer.findOne({ email });

        if (existingAdmin || existingCustomer) {
            return NextResponse.json(
                { message: 'Account with this email already exists' },
                { status: 400 }
            );
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let newUser;
        if (role === 'admin') {
            // Create new Admin
            newUser = await Admin.create({
                name,
                email,
                password: hashedPassword,
                role: 'admin'
            });
        } else {
            // Create new Customer
            newUser = await Customer.create({
                name,
                email,
                password: hashedPassword,
                status: 'active'
            });
        }

        // Create notification for admins
        try {
            await NotificationModel.create({
                type: 'info',
                title: role === 'admin' ? 'New Admin Registered' : 'New Customer Registered',
                message: `${role === 'admin' ? 'Admin' : 'Customer'} ${name} (${email}) has joined the portal.`,
                isRead: false,
                severity: 'low',
                timestamp: new Date()
            });
        } catch (notifError) {
            console.error('Failed to create signup notification:', notifError);
        }

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, role },
            JWT_SECRET,
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

        return NextResponse.json(
            {
                message: `${role === 'admin' ? 'Admin' : 'Customer'} account created successfully`,
                user: { id: newUser._id, name: newUser.name, email: newUser.email, role },
                token
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Signup API error:', error);
        const errorMessage = error.name === 'ValidationError'
            ? Object.values(error.errors).map((err: any) => err.message).join(', ')
            : error.message || 'Unknown database error';

        return NextResponse.json(
            { message: `Error creating user: ${errorMessage}`, error: error.message },
            { status: 500 }
        );
    }
}
