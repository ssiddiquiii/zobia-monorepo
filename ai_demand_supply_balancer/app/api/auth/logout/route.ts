import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
    try {
        const cookieStore = await cookies();

        // Clear the 'token' cookie used for authentication
        cookieStore.set('token', '', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 0, // Expire immediately
            path: '/'
        });

        return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    } catch (error: any) {
        console.error('Logout error:', error);
        return NextResponse.json({ message: 'Error logging out', error: error.message }, { status: 500 });
    }
}
