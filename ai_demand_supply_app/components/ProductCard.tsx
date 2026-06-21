import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ShoppingCart, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // 2 columns with padding

interface ProductCardProps {
    id: string;
    name: string;
    price: number | string;
    image: string;
    stock: number;
    isFavorite: boolean;
    onToggleFavorite: () => void;
    onAddToCart: () => void;
}

import { router } from 'expo-router';

export const ProductCard: React.FC<ProductCardProps> = ({
    id,
    name,
    price,
    image,
    stock,
    isFavorite,
    onToggleFavorite,
    onAddToCart
}) => {
    return (
        <TouchableOpacity style={styles.container} activeOpacity={0.9} onPress={() => router.push(`/product/${id}`)}>
            <View style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
                
                {stock === 0 && (
                    <View style={styles.outOfStockBadge}>
                        <Text style={styles.outOfStockText}>OUT OF STOCK</Text>
                    </View>
                )}

                {/* Overlay actions */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                        style={[styles.actionButton, isFavorite ? styles.actionButtonActive : null]} 
                        onPress={onToggleFavorite}
                    >
                        <Heart size={20} color={isFavorite ? 'white' : '#1f2937'} fill={isFavorite ? 'white' : 'transparent'} />
                    </TouchableOpacity>
                    
                    {stock > 0 && (
                        <TouchableOpacity style={styles.actionButton} onPress={onAddToCart}>
                            <ShoppingCart size={20} color="#1f2937" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.title} numberOfLines={1}>{name}</Text>
                <Text style={styles.price}>
                    {typeof price === 'number' ? `$${price.toLocaleString()}` : price}
                </Text>
                {stock > 0 && stock <= 5 && (
                    <Text style={styles.lowStock}>Low Stock: {stock} left</Text>
                )}
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: cardWidth,
        marginBottom: 24,
        alignItems: 'center',
        opacity: 1,
    },
    imageContainer: {
        width: '100%',
        aspectRatio: 1,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f3f4f6',
        position: 'relative',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    actionsContainer: {
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.05)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        // In React Native, hover effects are harder. We'll just show them permanently but slightly faded, or use active opacity.
        // For simplicity and mobile UX, keeping them visible at bottom right is sometimes better, but let's center them.
    },
    actionButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    actionButtonActive: {
        backgroundColor: '#d98a6c',
    },
    outOfStockBadge: {
        position: 'absolute',
        top: 12,
        left: 12,
        backgroundColor: '#ef4444',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 999,
        zIndex: 10,
    },
    outOfStockText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '900',
        letterSpacing: 1,
    },
    infoContainer: {
        width: '100%',
        alignItems: 'flex-start',
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 13,
        fontWeight: '500',
        color: '#374151',
        marginBottom: 4,
    },
    price: {
        fontSize: 15,
        fontWeight: '700',
        color: '#c47659',
    },
    lowStock: {
        fontSize: 10,
        color: '#ef4444',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginTop: 4,
    }
});
