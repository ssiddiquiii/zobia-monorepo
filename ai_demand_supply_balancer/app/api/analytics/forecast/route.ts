import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Product from '@/models/Product';
import Forecast from '@/models/Forecast';
import { getSupplyRecommendation } from '@/lib/ai/recommendations';

export async function GET() {
    try {
        await dbConnect();

        // Fetch all products
        const products = await Product.find({});

        // Process each product to get AI insights
        const forecastData = await Promise.all(products.map(async (product) => {
            // Check if we have a valid cached forecast
            const cachedForecast = await Forecast.findOne({
                productId: product._id,
                validUntil: { $gt: new Date() }
            }).sort({ calculatedAt: -1 });

            if (cachedForecast) {
                // Return cached forecast
                return {
                    _id: product._id,
                    name: product.name,
                    stock: product.stock,
                    needsRestock: cachedForecast.recommendedReorderQty > 0,
                    reorderPoint: cachedForecast.reorderPoint,
                    recommendedQuantity: cachedForecast.recommendedReorderQty,
                    forecastedMonthlyDemand: cachedForecast.predictedDemand,
                    safetyStock: cachedForecast.safetyStock,
                    confidence: cachedForecast.confidence,
                    cached: true
                };
            }

            // No valid cache, calculate new forecast
            // Note: In a real system, we'd query actual order history
            const mockHistory = [
                { date: new Date(Date.now() - 30 * 86400000), quantity: 20 },
                { date: new Date(Date.now() - 20 * 86400000), quantity: 15 },
                { date: new Date(Date.now() - 10 * 86400000), quantity: 25 },
                { date: new Date(Date.now() - 5 * 86400000), quantity: 10 },
            ];

            const insight = getSupplyRecommendation(product.stock, mockHistory);

            // Save forecast to database (valid for 7 days)
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + 7);

            await Forecast.create({
                productId: product._id,
                productName: product.name,
                predictedDemand: insight.forecastedMonthlyDemand,
                forecastPeriodDays: 30,
                recommendedReorderQty: insight.recommendedQuantity,
                reorderPoint: insight.reorderPoint,
                safetyStock: insight.safetyStock,
                confidence: 75, // Default confidence
                validUntil,
                basedOnOrders: mockHistory.length
            });

            return {
                _id: product._id,
                name: product.name,
                stock: product.stock,
                ...insight,
                cached: false
            };
        }));

        return NextResponse.json(forecastData);
    } catch (error: any) {
        return NextResponse.json({ message: 'Error fetching forecast', error: error.message }, { status: 500 });
    }
}
