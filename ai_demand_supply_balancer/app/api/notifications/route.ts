import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Notification from '@/models/Notification';

// GET: Fetch notification history
export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
        const unreadOnly = searchParams.get('unreadOnly') === 'true';

        const query = unreadOnly ? { isRead: false } : {};

        const notifications = await Notification.find(query)
            .sort({ timestamp: -1 })
            .limit(limit)
            .lean() || [];

        const unreadCount = await Notification.countDocuments({ isRead: false }) || 0;

        return NextResponse.json({
            notifications,
            unreadCount,
            total: notifications.length
        });
    } catch (error: any) {
        console.error('Fetch notifications error:', error);
        return NextResponse.json({
            message: 'Error fetching notifications',
            error: error.message,
            notifications: [], // Return empty array to prevent frontend crash
            unreadCount: 0
        }, { status: 500 });
    }
}

// PATCH: Mark notification as read
export async function PATCH(request: Request) {
    try {
        await dbConnect();

        const { id, isRead } = await request.json();

        const notification = await Notification.findByIdAndUpdate(
            id,
            { isRead },
            { new: true }
        );

        if (!notification) {
            return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
        }

        return NextResponse.json(notification);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating notification', error: error.message }, { status: 500 });
    }
}

// DELETE: Remove notification(s)
export async function DELETE(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (id) {
            // Delete specific notification
            const result = await Notification.findByIdAndDelete(id);
            if (!result) {
                return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
            }
            return NextResponse.json({ message: 'Notification deleted' });
        }

        const deleteAll = searchParams.get('deleteAll') === 'true';
        if (deleteAll) {
            // Delete ALL notifications
            const result = await Notification.deleteMany({});
            return NextResponse.json({
                message: `Deleted ${result.deletedCount} notifications`,
                deletedCount: result.deletedCount
            });
        }

        // Keep bulk delete as fallback
        const daysOld = parseInt(searchParams.get('daysOld') || '30');
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysOld);

        const result = await Notification.deleteMany({
            timestamp: { $lt: cutoffDate },
            isRead: true
        });

        return NextResponse.json({
            message: `Deleted ${result.deletedCount} old notifications`,
            deletedCount: result.deletedCount
        });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error deleting notifications', error: error.message }, { status: 500 });
    }
}
