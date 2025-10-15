import { CustomerSearchData } from "@/features/global-search/types"
import { createServerSideClient } from "@/utils/supabase/server"

export async function searchCustomersData(searchTerm: string, storeIds: number[], limit: number): Promise<CustomerSearchData[]> {
    const supabase = createServerSideClient()

    const { data: customers, error: customersError } = await supabase
        .from('orders')
        .select(`
                customer_name,
                customer_email,
                store_id,
                stores!inner (slug)
            `)
        .in('store_id', storeIds)
        .not('customer_name', 'is', null)
        .or(`customer_name.ilike.${searchTerm},customer_email.ilike.${searchTerm}`)
        .limit(limit)

    if (customersError) {
        throw new Error("Error fetching customers")
    }

    if (!customers) {
        return []
    }

    // Deduplicate customers
    const uniqueCustomers = customers.reduce((acc: CustomerSearchData[], customer) => {
        const existingCustomer = acc.find(c =>
            c.customer_email === customer.customer_email ||
            c.customer_name === customer.customer_name
        )
        if (!existingCustomer) {
            acc.push(customer as unknown as CustomerSearchData)
        }
        return acc
    }, [])

    return uniqueCustomers
}
