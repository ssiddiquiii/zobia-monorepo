import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
    customerName: string;
    total: number;
    status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    date: Date;
    phone?: string;
    shippingAddress?: {
        address: string;
        city: string;
        postalCode: string;
    };
    paymentMethod?: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
        customerName: { type: String, required: [true, 'Please provide a customer name'], trim: true },
        total: { type: Number, required: [true, 'Please provide an order total'], min: 0 },
        status: {
            type: String,
            enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
            default: 'Processing',
        },
        items: [{
            productId: { type: Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String, required: true },
            quantity: { type: Number, required: true, min: 1 },
            price: { type: Number, required: true },
            image: { type: String }
        }],
        phone: { type: String },
        shippingAddress: {
            address: { type: String },
            city: { type: String },
            postalCode: { type: String }
        },
        paymentMethod: { type: String, default: 'COD' },
        paymentStatus: { type: String, enum: ['Paid', 'Pending', 'Failed'], default: 'Pending' },
        date: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
