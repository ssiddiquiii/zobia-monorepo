import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface GradientButtonProps extends TouchableOpacityProps {
    title: string;
    containerStyle?: ViewStyle;
    textStyle?: TextStyle;
}

export const GradientButton: React.FC<GradientButtonProps> = ({ title, containerStyle, textStyle, ...props }) => {
    return (
        <TouchableOpacity activeOpacity={0.8} style={containerStyle} {...props}>
            <LinearGradient
                colors={['#d98a6c', '#c47659']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </LinearGradient>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    gradient: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 9999, // full rounded
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#d98a6c',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    text: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
