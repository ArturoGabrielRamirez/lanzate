import { createServerSideClient } from '@/utils/supabase/server'
import { UserIdentity } from '@supabase/supabase-js';
import { toast } from 'sonner';

export class AvatarStorageUtils {
  private static supabase: any

  private static async getSupabaseClient() {
    if (!this.supabase) {
      this.supabase = await createServerSideClient()
    }
    return this.supabase
  }

  /**
   * Descarga una imagen desde una URL externa y la sube a Supabase Storage
   */
  static async downloadAndUploadImage(
    imageUrl: string,
    userId: string,
    provider: string
  ): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
      console.log(`📥 Descargando imagen de ${provider}:`, imageUrl)

      // Validar URL
      if (!imageUrl || !imageUrl.startsWith('http')) {
        throw new Error('URL inválida')
      }

      // Descargar la imagen con timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 segundos

      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; AvatarBot/1.0)',
          'Accept': 'image/*',
          'Accept-Encoding': 'gzip, deflate'
        },
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const imageBuffer = await response.arrayBuffer()
      const contentType = response.headers.get('content-type') || 'image/jpeg'

      if (!contentType.startsWith('image/')) {
        throw new Error(`Tipo de contenido inválido: ${contentType}`)
      }

      if (imageBuffer.byteLength > 10 * 1024 * 1024) {
        throw new Error(`Imagen muy grande: ${(imageBuffer.byteLength / 1024 / 1024).toFixed(1)}MB`)
      }

      const fileExtension = this.getFileExtension(contentType)
      const fileName = `avatar-${userId}-${provider}-${Date.now()}.${fileExtension}`
      const filePath = `avatars/${fileName}`

      const supabase = await this.getSupabaseClient()
      const { data, error } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, new Uint8Array(imageBuffer), {
          contentType,
          upsert: true,
          cacheControl: '86400' // Cache por 24 horas
        })

      if (error) {
        console.error(`❌ Error subiendo a Supabase:`, error)
        throw new Error(`Error de storage: ${error.message}`)
      }

      const { data: publicUrlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath)

      if (!publicUrlData?.publicUrl) {
        throw new Error('No se pudo obtener URL pública')
      }

      return {
        success: true,
        url: publicUrlData.publicUrl
      }

    } catch (error: any) {
      console.error(`❌ Error procesando imagen de ${provider}:`, error)

      let errorMessage = 'Error desconocido'
      if (error.name === 'AbortError') {
        errorMessage = 'Timeout descargando imagen'
      } else if (error instanceof Error) {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }


  static async generatePresetAvatars(
    email: string,
    userId: string
  ): Promise<Array<{ id: string; url: string; provider: string; label: string; icon: string }>> {

    const presets = []

 const diceBearStyles = [
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

for (const { style, label, icon } of diceBearStyles) {
  const seed = encodeURIComponent(email);
  const diceBearUrl = `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&backgroundColor=transparent&size=200`;

  presets.push({
    id: `dicebear-${style}`,
    url: diceBearUrl,
    provider: 'DiceBear',
    label: `${label} Generado`,
    icon
  });
}

    return presets
  }

  /**
   * Procesa avatares de proveedores OAuth
   */
  static async processOAuthAvatars(
    identities: UserIdentity[],
    userId: string
  ): Promise<Array<{ id: string; url: string; provider: string; label: string; icon: string }>> {

    const processed: PromiseLike<{ id: string; url: string; provider: string; label: string; icon: string; }[]> | { id: any; url: string; provider: any; label: string; icon: string; }[] = []
    const promises = []

    for (const identity of identities) {
      const { provider } = identity
      let avatarUrl: string | null = null
      let label = ''
      let icon = ''

      // Extraer URL del avatar según el proveedor
      switch (provider) {
        case 'google':
          avatarUrl = identity.identity_data?.avatar_url ||
            identity.identity_data?.picture ||
            identity.identity_data?.image_url
          label = 'Avatar de Google'
          icon = '🟦'
          break

        case 'facebook':
          avatarUrl = identity.identity_data?.avatar_url ||
            identity.identity_data?.picture?.data?.url
          label = 'Avatar de Facebook'
          icon = '📘'
          break
        /*       case 'github':
                avatarUrl = identity.identity_data?.avatar_url
                label = 'Avatar de GitHub'
                icon = '🐙'
                break
      
              case 'discord':
      
                const discordId = identity.identity_data?.id
                const discordAvatar = identity.identity_data?.avatar
                if (discordId && discordAvatar) {
                  avatarUrl = `https://cdn.discordapp.com/avatars/${discordId}/${discordAvatar}.png?size=256`
                } else {
                  avatarUrl = identity.identity_data?.avatar_url
                }
                label = 'Avatar de Discord'
                icon = '🎮'
                break
      
              case 'twitter':
                avatarUrl = identity.identity_data?.avatar_url ||
                  identity.identity_data?.profile_image_url ||
                  identity.identity_data?.profile_image_url_https
                label = 'Avatar de Twitter'
                icon = '🐦'
                break */
      }

      if (avatarUrl && avatarUrl.startsWith('http')) {
        // Agregar promesa de descarga y subida
        promises.push(
          this.downloadAndUploadImage(avatarUrl, userId, provider)
            .then(result => {
              if (result.success && result.url) {
                return {
                  id: provider,
                  url: result.url,
                  provider: provider.charAt(0).toUpperCase() + provider.slice(1),
                  label,
                  icon
                }
              }
              return null
            })
            .catch(error => {
              console.error(`Error processing ${provider} avatar:`, error)
              return null
            })
        )
      } else {
        console.error(`❌ No se encontró avatar válido para ${provider}`)
      }
    }

    const results = await Promise.allSettled(promises)

    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value) {
        processed.push(result.value)
      }
    })

    return processed
  }

  /**
   * Limpia avatares antiguos del storage
   */
  static async cleanupOldAvatars(userId: string): Promise<void> {
    try {
      console.log(`🧹 Limpiando avatares antiguos del usuario: ${userId}`)

      const supabase = await this.getSupabaseClient()

      // Listar archivos del usuario
      const { data: files, error } = await supabase.storage
        .from('user-uploads')
        .list('avatars', {
          search: `avatar-${userId}`,
          sortBy: { column: 'updated_at', order: 'desc' },
          limit: 100
        })

      if (error) {
        console.error('❌ Error listando archivos para limpieza:', error.message)
        return
      }

      if (!files || files.length === 0) {
        console.error('📁 No hay archivos para limpiar')
        return
      }

      // Mantener solo los últimos 10 archivos, eliminar el resto
      const filesToDelete = files.slice(10)

      if (filesToDelete.length > 0) {
        const pathsToDelete = filesToDelete.map((file: { name: string }) => `avatars/${file.name}`)

        const { error: deleteError } = await supabase.storage
          .from('user-uploads')
          .remove(pathsToDelete)

        if (deleteError) {
          toast.error('❌ Error eliminando archivos:', deleteError)
        } else {
          toast.success(`✅ Eliminados ${filesToDelete.length} archivos antiguos`)
        }
      } else {
        toast.success('✅ No hay archivos antiguos para eliminar')
      }
    } catch (error) {
      toast.error('❌ Error en cleanup:', error || 'Unknown error')
    }
  }

  /**
   * Verifica si un bucket existe
   */
  static async ensureBucketExists(): Promise<boolean> {
    try {
      const supabase = await this.getSupabaseClient()

      const { data, error } = await supabase.storage.getBucket('user-uploads')

      if (error) {
        if (error.message.includes('not found') || error.message.includes('Bucket not found')) {
          toast.error('❌ Bucket user-uploads no existe')
          return false
        } else {
          toast.error('❌ Error verificando bucket:', error.message)
          return false
        }
      }
      return false
    } catch (error) {
      toast.error('❌ Error verificando bucket:', error || 'Unknown error')
      return false
    }
  }


  static async getAllUserAvatars(userId: string, email: string): Promise<{
    oauth: Array<{ id: string; url: string; provider: string; label: string; icon: string }>,
    storage: Array<{ id: string; url: string; provider: string; label: string; icon: string }>,
    generated: Array<{ id: string; url: string; provider: string; label: string; icon: string }>
  }> {
    const results = {
      oauth: [] as Array<{ id: string; url: string; provider: string; label: string; icon: string }>,
      storage: [] as Array<{ id: string; url: string; provider: string; label: string; icon: string }>,
      generated: [] as Array<{ id: string; url: string; provider: string; label: string; icon: string }>
    }

    try {
      results.generated = await this.generatePresetAvatars(email, userId)

      const supabase = await this.getSupabaseClient()
      const bucketExists = await this.ensureBucketExists()

      if (bucketExists) {
        const { data: files, error: listError } = await supabase.storage
          .from('user-uploads')
          .list('avatars', {
            limit: 50,
            sortBy: { column: 'updated_at', order: 'desc' }
          })

        if (!listError && files && files.length > 0) {
          const userFiles = files.filter((file: any) =>
            file.name.includes(`avatar-${userId}`) ||
            file.name.includes(`${userId}-avatar`)
          )

          for (const file of userFiles) {
            const { data: publicUrlData } = supabase.storage
              .from('user-uploads')
              .getPublicUrl(`avatars/${file.name}`)

            if (publicUrlData?.publicUrl) {
              let provider = 'Personalizado'
              let icon = '📸'
              let label = 'Avatar Subido'

              if (file.name.includes('-google-')) {
                provider = 'Google'
                icon = '🟦'
                label = 'Avatar de Google (Guardado)'
              } else if (file.name.includes('-facebook-')) {
                provider = 'Facebook'
                icon = '📘'
                label = 'Avatar de Facebook (Guardado)'
              } /* else if (file.name.includes('-github-')) {
                provider = 'GitHub'
                icon = '🐙'
                label = 'Avatar de GitHub (Guardado)'
              } else if (file.name.includes('-discord-')) {
                provider = 'Discord'
                icon = '🎮'
                label = 'Avatar de Discord (Guardado)'
              } else if (file.name.includes('-twitter-')) {
                provider = 'Twitter'
                icon = '🐦'
                label = 'Avatar de Twitter (Guardado)'
              } */

              const avatarData = {
                id: `storage-${file.name}`,
                url: publicUrlData.publicUrl,
                provider,
                label,
                icon
              }

              if (provider !== 'Personalizado') {
                results.oauth.push(avatarData)
              } else {
                results.storage.push(avatarData)
              }
            }
          }
        }
      }


    } catch (error) {
      toast.error('❌ Error obteniendo avatares:', error || 'Unknown error')
    }

    return results
  }

  private static getFileExtension(contentType: string): string {
    const map: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/gif': 'gif',
      'image/webp': 'webp',
      'image/svg+xml': 'svg',
      'image/bmp': 'bmp',
      'image/tiff': 'tiff'
    }
    return map[contentType] || 'jpg'
  }

  static async validateImageUrl(url: string): Promise<boolean> {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      const contentType = response.headers.get('content-type') || ''
      return response.ok && contentType.startsWith('image/')
    } catch {
      return false
    }
  }
}