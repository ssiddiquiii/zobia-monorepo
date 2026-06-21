import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    userId?: string; // Optional: for multi-user support in future
    type: 'success' | 'warning' | 'error' | 'info';
    title: string;
    message: string;
    isRead: boolean;
    severity?: 'low' | 'medium' | 'high' | 'critical';
    relatedEntity?: {
        type: 'product' | 'order' | 'warehouse';
        id: string;
    };
    timestamp: Date;
}

const NotificationSchema: Schema = new Schema({
    userId: { type: String, required: false },
    type: { type: String, enum: ['success', 'warning', 'error', 'info'], required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'medium' },
    relatedEntity: {
        type: { type: String, enum: ['product', 'order', 'warehouse'] },
        id: { type: String }
    },
    timestamp: { type: Date, default: Date.now }
});

// Index for efficient queries
NotificationSchema.index({ timestamp: -1 });
NotificationSchema.index({ isRead: 1 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);
