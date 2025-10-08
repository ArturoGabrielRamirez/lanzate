'use server';

import { prisma } from '@/lib/prisma';
import type { CreateUserParams } from '../types';
import { detectOAuthProvider } from '../utils';

export async function createUserData({
  email,
  supabaseUserId,
  avatar,
  username,
  firstName,
  lastName,
  phone,
  provider,
}: CreateUserParams) {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          ...(supabaseUserId ? [{ supabase_user_id: supabaseUserId }] : [])
        ]
      }
    });

    if (existingUser) {
      // If user exists but doesn't have supabase_user_id, update it
      if (!existingUser.supabase_user_id && supabaseUserId) {
        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            supabase_user_id: supabaseUserId,
            email: email,
            updated_at: new Date()
          },
          include: {
            Account: true
          }
        });

        return {
          data: updatedUser,
          error: null
        };
      }

      // User already exists with this email or supabase_user_id
      return {
        data: null,
        error: { message: 'User already exists' }
      };
    }

    const detectedProvider = detectOAuthProvider(email, provider);
    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        avatar: avatar || null,
        created_at: new Date(),
        first_name: firstName || null,
        last_name: lastName || null,
        password: detectedProvider, // For OAuth users, we don't store the actual password
        updated_at: new Date(),
        supabase_user_id: supabaseUserId,
        phone: phone || null,
        username: username || email.split('@')[0] || "", // Use email prefix as default username
      },
      include: {
        Account: true
      }
    });


    // Create associated account
    await prisma.account.create({
      data: {
        user_id: newUser.id,
        type: 'FREE',
        created_at: new Date(),
        updated_at: new Date(),
      }
    });

    return {
      data: newUser,
      error: null
    };

  } catch (error) {
    return {
      data: null,
      error: { message: 'Error creating user' }
    };
  }
}
