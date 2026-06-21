import dbConnect from './mongodb';
import Product from '@/models/Product';
import Notification from '@/models/Notification';

export async function checkLowStockAndNotify(productId: string) {
    try {
        await dbConnect();
        const product = await Product.findById(productId);

        if (!product) return;

        // Condition: Stock is 10 or less
        if (product.stock <= 10) {
            // Check if a warning notification already exists for this product in the last 24 hours
            // to avoid spamming the admin.
            const existingNotification = await Notification.findOne({
                'relatedEntity.id': productId,
                type: 'warning',
                timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
                isRead: false
            });

            if (!existingNotification) {
                await Notification.create({
                    type: 'warning',
                    title: 'Low Stock Alert ⚠️',
                    message: `Product "${product.name}" is running low on stock. Only ${product.stock} items remaining.`,
                    severity: product.stock === 0 ? 'critical' : 'high',
                    relatedEntity: {
                        type: 'product',
                        id: productId
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error in checkLowStockAndNotify:', error);
    }
}
