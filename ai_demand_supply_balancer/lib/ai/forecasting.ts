/**
 * Simple Moving Average & Trend-based Forecasting Engine
 * Predicts next 30 days of demand based on order history
 */
export const calculateDemandForecast = (orderHistory: any[], daysToPredict: number = 30) => {
    if (!orderHistory || orderHistory.length < 5) {
        // Fallback if data is insufficient: return average demand with slight growth buffer
        const recentAvg = orderHistory.length > 0
            ? orderHistory.reduce((acc, o) => acc + o.quantity, 0) / orderHistory.length
            : 10;
        return Math.ceil(recentAvg * 1.1); // 10% safety growth
    }

    // Sort by date
    const sorted = [...orderHistory].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Calculate daily velocity
    const dailyVelocities: number[] = [];
    for (let i = 1; i < sorted.length; i++) {
        const timeDiff = new Date(sorted[i].date).getTime() - new Date(sorted[i - 1].date).getTime();
        const days = Math.max(timeDiff / (1000 * 60 * 60 * 24), 1);
        dailyVelocities.push(sorted[i].quantity / days);
    }

    // Weight recent data more heavily (70/30 split between recent and historical avg)
    const recentDays = Math.min(dailyVelocities.length, 7);
    const recentVelocity = dailyVelocities.slice(-recentDays).reduce((a, b) => a + b, 0) / recentDays;
    const overallVelocity = dailyVelocities.reduce((a, b) => a + b, 0) / dailyVelocities.length;

    const weightedVelocity = (recentVelocity * 0.7) + (overallVelocity * 0.3);

    // Predict total demand for the requested window
    return Math.ceil(weightedVelocity * daysToPredict);
};
