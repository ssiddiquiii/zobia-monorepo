/**
 * Supply Recommendation Algorithm
 * Suggests reorder quantities based on current stock, AI forecast, and safety margins
 */
import { calculateDemandForecast } from './forecasting';

export const getSupplyRecommendation = (
    currentStock: number,
    orderHistory: any[],
    leadTimeDays: number = 7 // Default 7 days to restock
) => {
    const MonthlyForecast = calculateDemandForecast(orderHistory, 30);
    const dailyDemand = MonthlyForecast / 30;

    // Safety Stock = (Max Daily Sales * Max Lead Time) - (Avg Daily Sales * Avg Lead Time)
    // Simplified for this MVP: 3 days of extra buffer
    const safetyStock = Math.ceil(dailyDemand * 3);

    // Reorder Point = (Daily Demand * Lead Time) + Safety Stock
    const reorderPoint = Math.ceil(dailyDemand * leadTimeDays) + safetyStock;

    // Optimal Reorder Quantity (Economic Order Quantity simplified)
    // Target: Maintain 45 days of stock
    const targetStock = Math.ceil(dailyDemand * 45);

    const needsRestock = currentStock <= reorderPoint;
    const recommendedQuantity = needsRestock ? Math.max(targetStock - currentStock, 0) : 0;

    return {
        needsRestock,
        reorderPoint,
        recommendedQuantity,
        forecastedMonthlyDemand: MonthlyForecast,
        safetyStock
    };
};
