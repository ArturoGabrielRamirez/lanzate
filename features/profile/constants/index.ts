import { Trophy, Star, Zap, Crown, Award } from 'lucide-react'

import { FileValidationOptions } from "@/features/profile/types"

export const DEFAULT_IMAGE_OPTIONS: FileValidationOptions = {
    maxSize: 50 * 1024 * 1024, // 50MB
    allowedTypes: [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/bmp',
        'image/tiff'
    ],
    maxWidth: 4000,
    maxHeight: 4000,
    allowCropping: true
}

export const AVATAR_OPTIONS: FileValidationOptions = {
    ...DEFAULT_IMAGE_OPTIONS,
    maxWidth: 2000,
    maxHeight: 2000,
    allowCropping: true
}

export const BANNER_OPTIONS: FileValidationOptions = {
    ...DEFAULT_IMAGE_OPTIONS,
    maxWidth: 4000,
    maxHeight: 2000,
    allowCropping: true
}

export const CUSTOMER_LEVELS = [
    { level: 1, name: 'Novato', minPoints: 0, maxPoints: 99, icon: Star, color: 'text-gray-400', bgColor: 'from-gray-400/20 to-gray-600/20', borderColor: 'border-gray-400/30' },
    { level: 2, name: 'Explorador', minPoints: 100, maxPoints: 299, icon: Zap, color: 'text-blue-400', bgColor: 'from-blue-400/20 to-blue-600/20', borderColor: 'border-blue-400/30' },
    { level: 3, name: 'Conocedor', minPoints: 300, maxPoints: 599, icon: Award, color: 'text-green-400', bgColor: 'from-green-400/20 to-green-600/20', borderColor: 'border-green-400/30' },
    { level: 4, name: 'Experto', minPoints: 600, maxPoints: 999, icon: Trophy, color: 'text-purple-400', bgColor: 'from-purple-400/20 to-purple-600/20', borderColor: 'border-purple-400/30' },
    { level: 5, name: 'Maestro', minPoints: 1000, maxPoints: 1999, icon: Crown, color: 'text-orange-400', bgColor: 'from-orange-400/20 to-orange-600/20', borderColor: 'border-orange-400/30' },
    { level: 6, name: 'Leyenda', minPoints: 2000, maxPoints: Infinity, icon: Crown, color: 'text-yellow-400', bgColor: 'from-yellow-400/20 to-yellow-600/20', borderColor: 'border-yellow-400/30' }
]

// Sistema de niveles para tiendas
export const STORE_LEVELS = [
    { level: 1, name: 'Puesto', minPoints: 0, maxPoints: 199, icon: Star, color: 'text-gray-400', bgColor: 'from-gray-400/20 to-gray-600/20', borderColor: 'border-gray-400/30' },
    { level: 2, name: 'Tiendita', minPoints: 200, maxPoints: 599, icon: Zap, color: 'text-blue-400', bgColor: 'from-blue-400/20 to-blue-600/20', borderColor: 'border-blue-400/30' },
    { level: 3, name: 'Comercio', minPoints: 600, maxPoints: 1199, icon: Award, color: 'text-green-400', bgColor: 'from-green-400/20 to-green-600/20', borderColor: 'border-green-400/30' },
    { level: 4, name: 'Gran Tienda', minPoints: 1200, maxPoints: 2499, icon: Trophy, color: 'text-purple-400', bgColor: 'from-purple-400/20 to-purple-600/20', borderColor: 'border-purple-400/30' },
    { level: 5, name: 'Mega Tienda', minPoints: 2500, maxPoints: 4999, icon: Crown, color: 'text-orange-400', bgColor: 'from-orange-400/20 to-orange-600/20', borderColor: 'border-orange-400/30' },
    { level: 6, name: 'Imperio', minPoints: 5000, maxPoints: Infinity, icon: Crown, color: 'text-yellow-400', bgColor: 'from-yellow-400/20 to-yellow-600/20', borderColor: 'border-yellow-400/30' }
]

export const diceBearStyles = [
    { style: 'adventurer', label: 'Aventurero', icon: '⚔️' },
    { style: 'adventurer-neutral', label: 'Aventurero Neutral', icon: '🛡️' },
    { style: 'avataaars', label: 'Avataaars', icon: '👤' },
    { style: 'avataaars-neutral', label: 'Avataaars Neutral', icon: '🧍‍♂️' },
    { style: 'big-ears', label: 'Orejas Grandes', icon: '👂' },
    { style: 'big-ears-neutral', label: 'Orejas Grandes Neutro', icon: '👂' },
    { style: 'big-smile', label: 'Gran Sonrisa', icon: '😁' },
    { style: 'bottts', label: 'Robot', icon: '🤖' },
    { style: 'bottts-neutral', label: 'Robot Neutro', icon: '🤖' },
    { style: 'croodles', label: 'Croodles', icon: '🎨' },
    { style: 'croodles-neutral', label: 'Croodles Neutro', icon: '🎨' },
    { style: 'dylan', label: 'Dylan', icon: '👨‍🎨' },
    { style: 'fun-emoji', label: 'Emoji Divertido', icon: '😄' },
    { style: 'glass', label: 'Vidrio', icon: '🥽' },
    { style: 'icons', label: 'Iconos', icon: '🔰' },
    { style: 'identicon', label: 'Identicon', icon: '🔷' },
    { style: 'initials', label: 'Iniciales', icon: '🔤' },
    { style: 'lorelei', label: 'Lorelei', icon: '🧝‍♀️' },
    { style: 'lorelei-neutral', label: 'Lorelei Neutro', icon: '🧝‍♀️' },
    { style: 'micah', label: 'Micah', icon: '🧑' },
    { style: 'miniavs', label: 'Mini Avatar', icon: '🎭' },
    { style: 'notionists', label: 'Notionists', icon: '🧠' },
    { style: 'notionists-neutral', label: 'Notionists Neutro', icon: '🧠' },
    { style: 'open-peeps', label: 'Open Peeps', icon: '🖊️' },
    { style: 'personas', label: 'Personas', icon: '👨' },
    { style: 'pixel-art', label: 'Pixel Art', icon: '🎮' },
    { style: 'pixel-art-neutral', label: 'Pixel Art Neutro', icon: '🟦' },
    { style: 'rings', label: 'Anillos', icon: '💍' },
    { style: 'shapes', label: 'Formas', icon: '🔵' },
    { style: 'thumbs', label: 'Pulgar', icon: '👍' }
];

export const PRESET_BANNERS = [
    {
        id: 1,
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Cielo al amanecer sobre montañas con niebla"
    },
    {
        id: 2,
        url: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Bosque denso y brumoso"
    },
    {
        id: 3,
        url: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Paisaje de valle con bosque y luz del sol"
    },
    {
        id: 4,
        url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Océano agitado al atardecer"
    },
    {
        id: 5,
        url: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Colinas verdes y neblina"
    },
    {
        id: 6,
        url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Golden Gate Bridge con niebla"
    },
    {
        id: 7,
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Montañas nevadas al atardecer"
    },
    {
        id: 8,
        url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1920&h=400&fit=crop&auto=format&q=80",
        name: "Lago rodeado de bosque otoñal"
    }
];