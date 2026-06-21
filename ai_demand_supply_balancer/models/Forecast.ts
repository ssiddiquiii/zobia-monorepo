import mongoose, { Schema, Document } from 'mongoose';

export interface IForecast extends Document {
    productId: mongoose.Types.ObjectId;
    productName: string;
    predictedDemand: number; // Units expected to sell in forecast period
    forecastPeriodDays: number; // e.g., 30 days
    recommendedReorderQty: number;
    reorderPoint: number;
    safetyStock: number;
    confidence: number; // 0-100 percentage
    calculatedAt: Date;
    validUntil: Date; // When this forecast expires
    basedOnOrders: number; // Number of historical orders used
}

const ForecastSchema: Schema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    predictedDemand: { type: Number, required: true },
    forecastPeriodDays: { type: Number, default: 30 },
    recommendedReorderQty: { type: Number, required: true },
    reorderPoint: { type: Number, required: true },
    safetyStock: { type: Number, required: true },
    confidence: { type: Number, min: 0, max: 100, default: 75 },
    calculatedAt: { type: Date, default: Date.now },
    validUntil: { type: Date, required: true },
    basedOnOrders: { type: Number, default: 0 }
});

// Index for efficient queries
ForecastSchema.index({ productId: 1, validUntil: -1 });
ForecastSchema.index({ calculatedAt: -1 });

export default mongoose.models.Forecast || mongoose.model<IForecast>('Forecast', ForecastSchema);
