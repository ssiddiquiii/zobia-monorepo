import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.join(process.cwd(), '.env') });

// Import models (using relative paths since this is a script)
// Note: In a real Next.js environment, we'd need to handle the imports carefully.
// For this script, we'll define the schemas locally to ensure it runs independently.

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable inside .env');
    process.exit(1);
}

async function seed() {
    try {
        await mongoose.connect(MONGODB_URI as string);
        console.log('Connected to MongoDB');

        // Clear existing data
        const collections = ['admins', 'customers', 'forecasts', 'notifications', 'orders', 'products', 'warehouses', 'invoices'];
        for (const col of collections) {
            await mongoose.connection.collection(col).deleteMany({});
        }
        console.log('Cleared existing data');

        // 1. Warehouses
        const warehouses = await mongoose.connection.collection('warehouses').insertMany([
            {
                name: 'Main Distribution Center',
                location: 'Aisle 1-4, Sector A',
                capacity: 5000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Express Hub North',
                location: 'Aisle 2, Shelf B',
                capacity: 2000,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        const wh1Id = warehouses.insertedIds[0];
        const wh2Id = warehouses.insertedIds[1];
        console.log('Inserted Warehouses');

        // 2. Products (Skincare)
        const products = await mongoose.connection.collection('products').insertMany([
            {
                name: 'Glow Serum Vitamin C',
                price: 45,
                stock: 150,
                category: 'Serums',
                image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
                warehouseStock: [
                    { warehouseId: wh1Id, quantity: 100 },
                    { warehouseId: wh2Id, quantity: 50 }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Hydrating Face Cream',
                price: 32,
                stock: 85,
                category: 'Moisturizers',
                image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800',
                warehouseStock: [
                    { warehouseId: wh1Id, quantity: 60 },
                    { warehouseId: wh2Id, quantity: 25 }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Gentle Foaming Cleanser',
                price: 24,
                stock: 200,
                category: 'Cleansers',
                image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
                warehouseStock: [
                    { warehouseId: wh1Id, quantity: 150 },
                    { warehouseId: wh2Id, quantity: 50 }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                name: 'Sun Defense SPF 50',
                price: 32,
                stock: 150,
                category: 'Sunscreen',
                image: 'https://images.unsplash.com/photo-1594122230689-45899d9e6f69?auto=format&fit=crop&q=80&w=800',
                warehouseStock: [
                    { warehouseId: wh1Id, quantity: 100 },
                    { warehouseId: wh2Id, quantity: 50 }
                ],
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        const p1Id = products.insertedIds[0];
        const p2Id = products.insertedIds[1];
        console.log('Inserted Products');

        // 3. Admins
        const hashedPassword = await bcrypt.hash('admin123', 10);
        await mongoose.connection.collection('admins').insertOne({
            name: 'Super Admin',
            email: 'admin@fleure.com',
            password: hashedPassword,
            role: 'superadmin',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('Inserted Admin');

        // 4. Customers
        const customers = await mongoose.connection.collection('customers').insertMany([
            {
                name: 'Sarah Jenkins',
                email: 'sarah.j@example.com',
                phone: '+1 234-567-8901',
                totalOrders: 5,
                totalSpent: 450,
                status: 'active',
                createdAt: new Date()
            },
            {
                name: 'Michael Chen',
                email: 'm.chen@example.com',
                phone: '+1 234-567-8902',
                totalOrders: 2,
                totalSpent: 120,
                status: 'active',
                createdAt: new Date()
            }
        ]);
        console.log('Inserted Customers');

        const insertedOrders = await mongoose.connection.collection('orders').insertMany([
            {
                customerName: 'Sarah Jenkins',
                total: 125.50,
                status: 'Delivered',
                items: [
                    {
                        productId: p1Id,
                        name: 'Glow Serum Vitamin C',
                        quantity: 2,
                        price: 45.00,
                        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
                    },
                    {
                        productId: p2Id,
                        name: 'Hydrating Face Cream',
                        quantity: 1,
                        price: 35.50,
                        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=800'
                    }
                ],
                shippingAddress: {
                    street: '123 Beauty Lane',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA'
                },
                paymentMethod: 'Visa ending in 4242',
                paymentStatus: 'Paid',
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                customerName: 'Michael Chen',
                total: 45.00,
                status: 'Shipped',
                items: [
                    {
                        productId: p1Id,
                        name: 'Glow Serum Vitamin C',
                        quantity: 1,
                        price: 45.00,
                        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800'
                    }
                ],
                shippingAddress: {
                    street: '456 Tech Park',
                    city: 'San Francisco',
                    state: 'CA',
                    zip: '94105',
                    country: 'USA'
                },
                paymentMethod: 'Apple Pay',
                paymentStatus: 'Paid',
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        const order1Id = insertedOrders.insertedIds[0];
        console.log('Inserted Orders');

        // 6. Forecasts
        await mongoose.connection.collection('forecasts').insertMany([
            {
                productId: p1Id,
                productName: 'Glow Serum Vitamin C',
                predictedDemand: 85,
                forecastPeriodDays: 30,
                recommendedReorderQty: 100,
                reorderPoint: 40,
                safetyStock: 20,
                confidence: 92,
                calculatedAt: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                basedOnOrders: 154
            },
            {
                productId: p2Id,
                productName: 'Hydrating Face Cream',
                predictedDemand: 45,
                forecastPeriodDays: 30,
                recommendedReorderQty: 60,
                reorderPoint: 25,
                safetyStock: 10,
                confidence: 88,
                calculatedAt: new Date(),
                validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                basedOnOrders: 92
            }
        ]);
        console.log('Inserted Forecasts');

        // 7. Notifications
        const notifs = await mongoose.connection.collection('notifications').insertMany([
            {
                type: 'warning',
                title: 'Low Stock Alert',
                message: 'Advanced Night Repair is running low (45 units left).',
                isRead: false,
                severity: 'high',
                relatedEntity: { type: 'product', id: products.insertedIds[3].toString() },
                timestamp: new Date()
            },
            {
                type: 'success',
                title: 'New Order Received',
                message: 'Order #ORD-9912 placed by Sarah Jenkins.',
                isRead: true,
                severity: 'low',
                timestamp: new Date(Date.now() - 3600000)
            }
        ]);
        console.log('Inserted Notifications');

        // 8. Invoices
        await mongoose.connection.collection('invoices').insertMany([
            {
                invoiceNumber: 'INV-1001',
                orderId: order1Id,
                customerName: 'Sarah Jenkins',
                customerEmail: 'sarah.j@example.com',
                amount: 125.50,
                status: 'Paid',
                items: [
                    {
                        name: 'Glow Serum Vitamin C',
                        quantity: 2,
                        price: 45.00
                    },
                    {
                        name: 'Hydrating Face Cream',
                        quantity: 1,
                        price: 35.50
                    }
                ],
                billingAddress: {
                    street: '123 Beauty Lane',
                    city: 'New York',
                    state: 'NY',
                    zip: '10001',
                    country: 'USA'
                },
                issuedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
        console.log('Inserted Invoices');

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seed();
