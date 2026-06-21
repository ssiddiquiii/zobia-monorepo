// Comprehensive Skincare Product Categories

export const SKINCARE_CATEGORIES = {
    // Face Care
    CLEANSERS: 'Cleansers',
    FACE_WASH: 'Face Wash',
    FOAM_CLEANSER: 'Foam Cleanser',
    GEL_CLEANSER: 'Gel Cleanser',
    OIL_CLEANSER: 'Oil Cleanser',
    MICELLAR_WATER: 'Micellar Water',
    MAKEUP_REMOVER: 'Makeup Remover',

    // Toners & Essences
    TONERS: 'Toners',
    ESSENCE: 'Essence',
    FACIAL_MIST: 'Facial Mist',

    // Serums & Treatments
    SERUMS: 'Serums',
    VITAMIN_C_SERUM: 'Vitamin C Serum',
    HYALURONIC_ACID_SERUM: 'Hyaluronic Acid Serum',
    RETINOL_SERUM: 'Retinol Serum',
    NIACINAMIDE_SERUM: 'Niacinamide Serum',
    FACIAL_OIL: 'Facial Oil',
    AMPOULE: 'Ampoule',

    // Moisturizers
    MOISTURIZERS: 'Moisturizers',
    DAY_CREAM: 'Day Cream',
    NIGHT_CREAM: 'Night Cream',
    GEL_MOISTURIZER: 'Gel Moisturizer',
    CREAM_MOISTURIZER: 'Cream Moisturizer',
    SLEEPING_MASK: 'Sleeping Mask',

    // Eye Care
    EYE_CARE: 'Eye Care',
    EYE_CREAM: 'Eye Cream',
    EYE_SERUM: 'Eye Serum',
    EYE_MASK: 'Eye Mask',
    UNDER_EYE_PATCHES: 'Under Eye Patches',

    // Sun Protection
    SUNSCREEN: 'Sunscreen',
    SPF_MOISTURIZER: 'SPF Moisturizer',
    SUNBLOCK: 'Sunblock',

    // Masks & Exfoliants
    FACE_MASKS: 'Face Masks',
    SHEET_MASK: 'Sheet Mask',
    CLAY_MASK: 'Clay Mask',
    PEEL_OFF_MASK: 'Peel Off Mask',
    SLEEPING_PACK: 'Sleeping Pack',
    EXFOLIATOR: 'Exfoliator',
    SCRUB: 'Scrub',
    PEELING_GEL: 'Peeling Gel',
    CHEMICAL_EXFOLIANT: 'Chemical Exfoliant',

    // Specialized Treatments
    ACNE_TREATMENT: 'Acne Treatment',
    SPOT_TREATMENT: 'Spot Treatment',
    ANTI_AGING: 'Anti-Aging',
    BRIGHTENING: 'Brightening',
    PORE_CARE: 'Pore Care',

    // Lip Care
    LIP_CARE: 'Lip Care',
    LIP_BALM: 'Lip Balm',
    LIP_SCRUB: 'Lip Scrub',
    LIP_MASK: 'Lip Mask',

    // Body Care (Skincare Related)
    BODY_LOTION: 'Body Lotion',
    BODY_CREAM: 'Body Cream',
    BODY_OIL: 'Body Oil',
    BODY_SCRUB: 'Body Scrub',
    HAND_CREAM: 'Hand Cream',
    FOOT_CREAM: 'Foot Cream',
} as const;

// Category groups for easier navigation
export const SKINCARE_CATEGORY_GROUPS = {
    'Cleansing': [
        SKINCARE_CATEGORIES.CLEANSERS,
        SKINCARE_CATEGORIES.FACE_WASH,
        SKINCARE_CATEGORIES.FOAM_CLEANSER,
        SKINCARE_CATEGORIES.GEL_CLEANSER,
        SKINCARE_CATEGORIES.OIL_CLEANSER,
        SKINCARE_CATEGORIES.MICELLAR_WATER,
        SKINCARE_CATEGORIES.MAKEUP_REMOVER,
    ],
    'Toning': [
        SKINCARE_CATEGORIES.TONERS,
        SKINCARE_CATEGORIES.ESSENCE,
        SKINCARE_CATEGORIES.FACIAL_MIST,
    ],
    'Treatment': [
        SKINCARE_CATEGORIES.SERUMS,
        SKINCARE_CATEGORIES.VITAMIN_C_SERUM,
        SKINCARE_CATEGORIES.HYALURONIC_ACID_SERUM,
        SKINCARE_CATEGORIES.RETINOL_SERUM,
        SKINCARE_CATEGORIES.NIACINAMIDE_SERUM,
        SKINCARE_CATEGORIES.FACIAL_OIL,
        SKINCARE_CATEGORIES.AMPOULE,
    ],
    'Moisturizing': [
        SKINCARE_CATEGORIES.MOISTURIZERS,
        SKINCARE_CATEGORIES.DAY_CREAM,
        SKINCARE_CATEGORIES.NIGHT_CREAM,
        SKINCARE_CATEGORIES.GEL_MOISTURIZER,
        SKINCARE_CATEGORIES.CREAM_MOISTURIZER,
        SKINCARE_CATEGORIES.SLEEPING_MASK,
    ],
    'Eye Care': [
        SKINCARE_CATEGORIES.EYE_CARE,
        SKINCARE_CATEGORIES.EYE_CREAM,
        SKINCARE_CATEGORIES.EYE_SERUM,
        SKINCARE_CATEGORIES.EYE_MASK,
        SKINCARE_CATEGORIES.UNDER_EYE_PATCHES,
    ],
    'Sun Protection': [
        SKINCARE_CATEGORIES.SUNSCREEN,
        SKINCARE_CATEGORIES.SPF_MOISTURIZER,
        SKINCARE_CATEGORIES.SUNBLOCK,
    ],
    'Masks & Exfoliation': [
        SKINCARE_CATEGORIES.FACE_MASKS,
        SKINCARE_CATEGORIES.SHEET_MASK,
        SKINCARE_CATEGORIES.CLAY_MASK,
        SKINCARE_CATEGORIES.PEEL_OFF_MASK,
        SKINCARE_CATEGORIES.SLEEPING_PACK,
        SKINCARE_CATEGORIES.EXFOLIATOR,
        SKINCARE_CATEGORIES.SCRUB,
        SKINCARE_CATEGORIES.PEELING_GEL,
        SKINCARE_CATEGORIES.CHEMICAL_EXFOLIANT,
    ],
    'Specialized Care': [
        SKINCARE_CATEGORIES.ACNE_TREATMENT,
        SKINCARE_CATEGORIES.SPOT_TREATMENT,
        SKINCARE_CATEGORIES.ANTI_AGING,
        SKINCARE_CATEGORIES.BRIGHTENING,
        SKINCARE_CATEGORIES.PORE_CARE,
    ],
    'Lip Care': [
        SKINCARE_CATEGORIES.LIP_CARE,
        SKINCARE_CATEGORIES.LIP_BALM,
        SKINCARE_CATEGORIES.LIP_SCRUB,
        SKINCARE_CATEGORIES.LIP_MASK,
    ],
    'Body Care': [
        SKINCARE_CATEGORIES.BODY_LOTION,
        SKINCARE_CATEGORIES.BODY_CREAM,
        SKINCARE_CATEGORIES.BODY_OIL,
        SKINCARE_CATEGORIES.BODY_SCRUB,
        SKINCARE_CATEGORIES.HAND_CREAM,
        SKINCARE_CATEGORIES.FOOT_CREAM,
    ],
};

// Array of all skincare categories for dropdowns/selects
export const ALL_SKINCARE_CATEGORIES = Object.values(SKINCARE_CATEGORIES);

// Type for TypeScript
export type SkincareCategory = typeof SKINCARE_CATEGORIES[keyof typeof SKINCARE_CATEGORIES];
