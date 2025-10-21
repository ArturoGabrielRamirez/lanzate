import { Trophy, Star, Zap, Crown, Award } from 'lucide-react'


// Sistema de niveles para clientes
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