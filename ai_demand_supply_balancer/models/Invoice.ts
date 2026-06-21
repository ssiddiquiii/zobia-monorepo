import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
    invoiceNumber: string;
    orderId: mongoose.Types.ObjectId;
    customerName: string;
    customerEmail: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
    billingAddress: {
        street: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
    issuedDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

const InvoiceSchema: Schema = new Schema(
    {
        invoiceNumber: { type: String, required: true, unique: true },
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        customerName: { type: String, required: true },
        customerEmail: { type: String, required: true },
        amount: { type: Number, required: true },
        status: { type: String, enum: ['Paid', 'Pending', 'Cancelled'], default: 'Paid' },
        items: [{
            name: { type: String, required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true }
        }],
        billingAddress: {
            street: { type: String },
            city: { type: String },
            state: { type: String },
            zip: { type: String },
            country: { type: String }
        },
        issuedDate: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

export default mongoose.models.Invoice || mongoose.model<IInvoice>('Invoice', InvoiceSchema);
