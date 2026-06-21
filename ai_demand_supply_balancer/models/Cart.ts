import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    image: string;
    quantity: number;
}

export interface ICart extends Document {
    customerId: mongoose.Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const CartSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        quantity: { type: Number, required: true, default: 1 }
    }],
    updatedAt: { type: Date, default: Date.now }
});

CartSchema.pre('save', function () {
    this.updatedAt = new Date();
});

export default mongoose.models.Cart || mongoose.model<ICart>('Cart', CartSchema);
