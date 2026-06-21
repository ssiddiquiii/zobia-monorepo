import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    stock: number;
    category: string;
    image?: string;
    qrCode?: string;
    warehouseStock: Array<{
        warehouseId: mongoose.Types.ObjectId;
        quantity: number;
    }>;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: [true, 'Please provide a product name'], trim: true },
        price: { type: Number, required: [true, 'Please provide a price'], min: 0 },
        stock: { type: Number, required: [true, 'Please provide stock count'], min: 0 },
        category: { type: String, required: [true, 'Please provide a category'], trim: true },
        image: { type: String },
        qrCode: { type: String },
        warehouseStock: [
            {
                warehouseId: { type: Schema.Types.ObjectId, ref: 'Warehouse' },
                quantity: { type: Number, default: 0 },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
