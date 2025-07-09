import { createClient } from "@/utils/supabase/server-props";

export async function getStoreProducts(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  try {
    // Primero obtenemos la tienda
    const { data: store, error: storeError } = await (await createClient())
      .from('stores')
      .select('id, name, subdomain') // Selecciona los campos que necesites
      .eq('subdomain', sanitizedSubdomain)
      .single();

    if (storeError || !store) {
      console.error('Store not found:', storeError);
      return null;
    }

    // Luego obtenemos los productos de esa tienda
    const { data: products, error: productsError } = await (await createClient())
      .from('products')
      .select('*')
      .eq('store_id', store.id); // Asumiendo que tienes un campo store_id en products

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return null;
    }

    return {
      store,
      products: products || []
    };
  } catch (error) {
    console.error('Error in getStoreProducts:', error);
    return null;
  }
}