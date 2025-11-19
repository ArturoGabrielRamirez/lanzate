import MercadoPagoConfig, { PreApproval } from "mercadopago";

import { updateUserAccountAction } from "@/features/account/actions";

const mercadopago = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN!,
});


export async function POST(request: Request) {
    // Obtenemos el cuerpo de la petición que incluye el tipo de notificación
    const body: { data: { id: string }; type: string } = await request.json();

    // Solo nos interesan las notificaciones de suscripciones
    if (body.type === "subscription_preapproval") {
        // Obtenemos la suscripción
        const preapproval = await new PreApproval(mercadopago).get({ id: body.data.id });
        
        // Si se aprueba, actualizamos el usuario con el id de la suscripción
        if (preapproval.status === "authorized") {
            // Actualizamos el usuario con el id de la suscripción
            //await api.user.update({ suscription: preapproval.id });
            console.log("🚀 ~ POST ~ preapproval:", preapproval)
            await updateUserAccountAction(preapproval.id!, preapproval.external_reference!);
        }
    }

    // Respondemos con un estado 200 para indicarle que la notificación fue recibida
    return new Response(null, { status: 200 });
}