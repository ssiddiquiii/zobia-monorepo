import mongoose, { Schema, Document } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    email?: string;
    password?: string;
    phone?: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate?: Date;
    status: 'active' | 'inactive';
    createdAt: Date;
}

const CustomerSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true },
    password: { type: String, select: false }, // Don't return password by default
    phone: { type: String },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

// Index for efficient queries
CustomerSchema.index({ totalSpent: -1 });

export default mongoose.models.Customer || mongoose.model<ICustomer>('Customer', CustomerSchema);
