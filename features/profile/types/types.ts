export type PublicUserProfile = {
  id: number // Permitir string por si acaso el ID viene como string
  username: string
  first_name: string | null
  last_name: string | null
  avatar: string | null
  banner: string | null // El banner puede ser null si no se ha subido uno
  profile_bio: string | null
  location: string | null
  created_at: Date
  profile_is_public: boolean
  show_liked_products: boolean
  show_comments: boolean
  show_activity: boolean
  show_location: boolean
  supabase_user_id: string | null // Campo que se excluye deliberadamente en el retorno
  _count: {
    product_likes: number
    product_comments: number
    user_follows: number // Corrección: Este debería ser el número de seguidores
    user_follows_following: number // Corrección: Este debería ser el número de usuarios que sigue
  }
}
