import { NextRequest, NextResponse } from 'next/server'
import { createServerSideClient } from '@/utils/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSideClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const options = []

    const googleAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture
    if (googleAvatar) {
      options.push({
        id: 'google',
        url: googleAvatar,
        provider: 'Google',
        label: 'Avatar de Google',
        icon: '🟦'
      })
    }

    if (user.identities) {
      const facebookIdentity = user.identities.find(identity => identity.provider === 'facebook')
      if (facebookIdentity && facebookIdentity.identity_data?.avatar_url) {
        options.push({
          id: 'facebook',
          url: facebookIdentity.identity_data.avatar_url,
          provider: 'Facebook',
          label: 'Avatar de Facebook',
          icon: '📘'
        })
      }

  /*     const githubIdentity = user.identities.find(identity => identity.provider === 'github')
      if (githubIdentity && githubIdentity.identity_data?.avatar_url) {
        options.push({
          id: 'github',
          url: githubIdentity.identity_data.avatar_url,
          provider: 'GitHub',
          label: 'Avatar de GitHub',
          icon: '🐙'
        })
      } */

   /*    const discordIdentity = user.identities.find(identity => identity.provider === 'discord')
      if (discordIdentity && discordIdentity.identity_data?.avatar_url) {
        options.push({
          id: 'discord',
          url: discordIdentity.identity_data.avatar_url,
          provider: 'Discord',
          label: 'Avatar de Discord',
          icon: '🎮'
        })
      } */

   /*    const twitterIdentity = user.identities.find(identity => identity.provider === 'twitter')
      if (twitterIdentity && twitterIdentity.identity_data?.avatar_url) {
        options.push({
          id: 'twitter',
          url: twitterIdentity.identity_data.avatar_url,
          provider: 'Twitter',
          label: 'Avatar de Twitter',
          icon: '🐦'
        })
      } */
    }

    return NextResponse.json({ options })
  } catch (error) {
    console.error('Error getting avatar options:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}