import mongoose, { Schema, Document } from 'mongoose';

export interface IWarehouse extends Document {
    name: string;
    location: string; // e.g., "Aisle 1, Shelf A"
    capacity: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const WarehouseSchema: Schema = new Schema(
    {
        name: { type: String, required: [true, 'Please provide a warehouse name'], trim: true },
        location: { type: String, required: [true, 'Please provide a location description'], trim: true },
        capacity: { type: Number, default: 1000 },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.models.Warehouse || mongoose.model<IWarehouse>('Warehouse', WarehouseSchema);
