import { createClient } from '@/utils/supabase/client';
import { SubdomainData } from '../types/types';



export async function getSubdomainData(subdomain: string): Promise<SubdomainData | null> {
    const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

    try {
        const { data, error } = await createClient()
            .from('store')
            .select('*')
            .eq('subdomain', sanitizedSubdomain)
            .single();

        if (error) {
            console.error('Error fetching subdomain data:', error);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Error in getSubdomainData:', error);
        return null;
    }
}