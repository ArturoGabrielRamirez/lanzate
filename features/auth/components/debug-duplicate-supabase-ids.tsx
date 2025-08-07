"use server";

import { createClient } from '@supabase/supabase-js';
import { prisma } from '@/utils/prisma';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function debugDuplicateSupabaseIds() {
    try {
        // 1. Obtener el usuario problemático
        const jiamafoxUser = await prisma.user.findUnique({
            where: { email: 'jiamafox@gmail.com' }
        });
        
        console.log('=== USUARIO PROBLEMÁTICO ===');
        console.log('Local user jiamafox:', JSON.stringify(jiamafoxUser, null, 2));

        // 2. Buscar en Supabase
        const { data: supabaseUsers, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
            throw new Error(`Error getting Supabase users: ${error.message}`);
        }

        const supabaseJiamafox = supabaseUsers.users.find(u => u.email === 'jiamafox@gmail.com');
        
        console.log('\n=== USUARIO EN SUPABASE ===');
        console.log('Supabase user jiamafox:', JSON.stringify(supabaseJiamafox, null, 2));

        if (supabaseJiamafox) {
            // 3. Buscar si ya existe alguien con ese supabase_user_id
            const existingUserWithSupabaseId = await prisma.user.findUnique({
                where: { supabase_user_id: supabaseJiamafox.id }
            });

            console.log('\n=== CONFLICTO DETECTADO ===');
            console.log('Usuario que ya tiene ese supabase_user_id:', JSON.stringify(existingUserWithSupabaseId, null, 2));

            // 4. Mostrar todos los usuarios para entender mejor
            const allUsers = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    supabase_user_id: true,
                    created_at: true
                },
                orderBy: { id: 'asc' }
            });

            console.log('\n=== TODOS LOS USUARIOS LOCALES ===');
            allUsers.forEach((user, idx) => {
                console.log(`${idx + 1}. ID: ${user.id}, Email: ${user.email}, SupabaseID: ${user.supabase_user_id || 'NULL'}`);
            });

            // 5. Mostrar todos los usuarios de Supabase
            console.log('\n=== TODOS LOS USUARIOS SUPABASE ===');
            supabaseUsers.users.forEach((user, idx) => {
                console.log(`${idx + 1}. ID: ${user.id}, Email: ${user.email}, Created: ${user.created_at}`);
            });
        }

        return {
            success: true,
            jiamafoxLocal: jiamafoxUser,
            jiamafoxSupabase: supabaseJiamafox,
            conflictUser: supabaseJiamafox ? await prisma.user.findUnique({
                where: { supabase_user_id: supabaseJiamafox.id }
            }) : null
        };

    } catch (error) {
        console.error('Debug error:', error);
        return { error: 'Debug failed', details: error };
    }
}