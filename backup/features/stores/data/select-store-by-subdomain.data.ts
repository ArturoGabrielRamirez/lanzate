"use server"

/* import { prisma } from "@/utils/prisma"; */

export async function selectStoreBySubdomainData(subdomain: string) {

    console.log("arreglar o depurar selectStoreBySubdomainData", subdomain)
    /*    const store = await prisma.store.findUnique({
           where: {
               subdomain: subdomain
           },
           include: {
               branches: true,
               products: {
                   where: {
                       is_deleted: false
                   },
                   include: {
                       categories: true,
                       stock_entries: true
                   }
               },
               balance: true, */
    /*  operational_settings: true */
    // TODO: Arreglar aca, para Hori
    /*      }
     }) */

    return {
        message: "Tienda recuperada con éxito desde la base de datos",
        payload: null/* store */,
        hasError: false
    }
}