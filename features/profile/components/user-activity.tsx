'use client'

import { useState, useEffect } from 'react'
import {
  Heart,
  MessageCircle,
  ShoppingBag,
  Store,
  Package,
  Calendar,
  User,
  TrendingUp,
  Award,
  Activity,
  UserPlus
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

interface UserActivity {
  id: number
  activity_type: string
  title: string
  description?: string
  created_at: string
  entity_type: string
  entity_id: number
  is_public: boolean
  is_featured: boolean
  metadata?: string
  // Relaciones opcionales basadas en el activity_type
  product?: {
    id: number
    name: string
    image?: string
    slug: string
  }
  store?: {
    id: number
    name: string
    logo?: string
    slug: string
  }
  order?: {
    id: number
    total_price: number
    status: string
  }
  /*  followedUser?: {
     id: number;
     username: string;
     avatar?: string;
     first_name: string;
     last_name: string;
   }; */
}

interface UserActivitiesProps {
  userId: number
  isOwnProfile?: boolean
  showPrivateActivities?: boolean
}

// Mapeo de iconos y colores para diferentes tipos de actividad
const getActivityConfig = (activityType: string) => {
  const configs: Record<string, { icon: React.ComponentType<any>, color: string, bgColor: string }> = {
    PRODUCT_LIKE: { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-50' },
    PRODUCT_COMMENT: { icon: MessageCircle, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    ORDER_CREATED: { icon: ShoppingBag, color: 'text-green-600', bgColor: 'bg-green-50' },
    ORDER_COMPLETED: { icon: Package, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    PRODUCT_CREATED: { icon: Package, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    STORE_CREATED: { icon: Store, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    USER_REGISTERED: { icon: User, color: 'text-gray-600', bgColor: 'bg-gray-50' },
    ACHIEVEMENT_UNLOCKED: { icon: Award, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
    MILESTONE_REACHED: { icon: TrendingUp, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    /*  USER_FOLLOW: { icon: UserPlus, color: 'text-cyan-600', bgColor: 'bg-cyan-50' }, */ // Nuevo
  }

  return configs[activityType] || { icon: Activity, color: 'text-gray-600', bgColor: 'bg-gray-50' }
}

// Formatear título de actividad
const getActivityTitle = (activity: UserActivity) => {
  switch (activity.activity_type) {
    case 'PRODUCT_LIKE':
      return activity.product ? `Le gustó "${activity.product.name}"` : 'Le gustó un producto'
    case 'PRODUCT_COMMENT':
      return activity.product ? `Comentó en "${activity.product.name}"` : 'Hizo un comentario'
    case 'ORDER_CREATED':
      return `Realizó un pedido${activity.store ? ` en ${activity.store.name}` : ''}`
    case 'ORDER_COMPLETED':
      return `Completó un pedido${activity.store ? ` en ${activity.store.name}` : ''}`
    case 'PRODUCT_CREATED':
      return activity.product ? `Creó el producto "${activity.product.name}"` : 'Creó un nuevo producto'
    case 'STORE_CREATED':
      return activity.store ? `Creó la tienda "${activity.store.name}"` : 'Creó una nueva tienda'
    case 'USER_REGISTERED':
      return 'Se unió a la plataforma'
    case 'ACHIEVEMENT_UNLOCKED':
      return activity.title || 'Desbloqueó un logro'
    case 'MILESTONE_REACHED':
      return activity.title || 'Alcanzó un hito'
    /*   case 'USER_FOLLOW':
      const followedUserName = activity.followedUser?.username || 'un usuario';
      const followedFullName = activity.followedUser?.first_name && activity.followedUser?.last_name
        ? `${activity.followedUser.first_name} ${activity.followedUser.last_name}`
        : followedUserName;
      return `Comenzó a seguir a ${followedFullName}`; */
    default:
      return activity.title || 'Realizó una actividad'
  }
}

export function UserActivities({ userId, isOwnProfile = false, showPrivateActivities = false }: UserActivitiesProps) {
  const [activities, setActivities] = useState<UserActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        setIsLoading(true)

        // Construir query params
        const params = new URLSearchParams({
          userId: userId.toString(),
          limit: '20',
          ...(showPrivateActivities && { includePrivate: 'true' })
        })

        const response = await fetch(`/api/users/${userId}/activities?${params}`)

        if (!response.ok) {
          throw new Error('Error al cargar las actividades')
        }

        const data = await response.json()
        setActivities(data.activities || [])

      } catch (err) {
        console.error('Error fetching activities:', err)
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivities()
  }, [userId, showPrivateActivities])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Error al cargar las actividades</p>
          <p className="text-sm">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No hay actividad reciente para mostrar</p>
          <p className="text-sm">
            {isOwnProfile
              ? 'Tus actividades aparecerán aquí cuando interactúes con productos y tiendas'
              : 'Las actividades aparecerán aquí cuando el usuario interactúe con productos y tiendas'
            }
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => {
        const config = getActivityConfig(activity.activity_type)
        const Icon = config.icon

        return (
          <Card key={activity.id} className="transition-colors hover:bg-muted/30">
            <CardContent className="p-4">
              <div className="flex gap-3">
                {/* Icono de actividad */}
                <div className={`flex-shrink-0 w-10 h-10 ${config.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm leading-tight">
                        {getActivityTitle(activity)}
                      </p>

                      {activity.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {activity.description}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.created_at), {
                            addSuffix: true,
                            locale: es
                          })}
                        </span>

                        {activity.is_featured && (
                          <Badge variant="secondary" className="text-xs">
                            Destacado
                          </Badge>
                        )}

                        {!activity.is_public && isOwnProfile && (
                          <Badge variant="outline" className="text-xs">
                            Privado
                          </Badge>
                        )}
                      </div>
                    </div>

                   {/*  {(activity.product?.image || activity.store?.logo || activity.followedUser?.avatar) && ( // Añadir la condición para el avatar del usuario seguido
  <div className="flex-shrink-0">
    <Avatar className="w-8 h-8">
      <AvatarImage
        src={activity.product?.image || activity.store?.logo || activity.followedUser?.avatar} // Usar el avatar si existe
        alt=""
      />
      <AvatarFallback className="text-xs">
        {activity.product ? 'P' : activity.store ? 'T' : 'U'}
      </AvatarFallback>
    </Avatar>
  </div>
)} */}

                    {/* Imagen relacionada si existe */}
                    {(activity.product?.image || activity.store?.logo) && (
                      <div className="flex-shrink-0">
                        <Avatar className="w-8 h-8">
                          <AvatarImage
                            src={activity.product?.image || activity.store?.logo}
                            alt=""
                          />
                          <AvatarFallback className="text-xs">
                            {activity.product ? 'P' : 'T'}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}

      {/* Indicador de más actividades */}
      {activities.length >= 20 && (
        <Card>
          <CardContent className="p-4 text-center">
            <button
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => {
                // Aquí puedes implementar paginación o cargar más actividades
                console.log('Cargar más actividades')
              }}
            >
              Ver más actividades...
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}