import mongoose, { Schema, Document } from 'mongoose';

export interface IWishlistItem {
    productId: mongoose.Types.ObjectId;
    name: string;
    price: number;
    image: string;
}

export interface IWishlist extends Document {
    customerId: mongoose.Types.ObjectId;
    items: IWishlistItem[];
    updatedAt: Date;
}

const WishlistSchema: Schema = new Schema({
    customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true }
    }],
    updatedAt: { type: Date, default: Date.now }
});

WishlistSchema.pre('save', function () {
    this.updatedAt = new Date();
});

export default mongoose.models.Wishlist || mongoose.model<IWishlist>('Wishlist', WishlistSchema);
