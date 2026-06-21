import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

export function getUserIdFromToken(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        return decoded.id;
    } catch (error) {
        return null;
    }
}
