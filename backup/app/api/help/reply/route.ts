import { Resend } from "resend";

import { ReplyEmailTemplate } from "@/features/global/components/contact-us/reply-email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { 
      recipientEmail, 
      recipientName, 
      category, 
      originalMessage, 
      replyMessage,
      agentName 
    } = await req.json();

    if (!recipientEmail || !replyMessage || !originalMessage) {
      return Response.json(
        { error: "Faltan campos obligatorios (recipientEmail, replyMessage, originalMessage)." },
        { status: 400 }
      );
    }

    const subject = category 
      ? `Re: [${getCategoryLabel(category)}] Tu consulta en Lanzate`
      : `Re: Tu consulta en Lanzate`;

    const { data, error } = await resend.emails.send({
      from: "Lanzate Soporte <soporte@mail.lanzate.app>",
      to: [recipientEmail],
      replyTo: "jiamafox@gmail.com",
      subject,
      react: ReplyEmailTemplate({ 
        recipientName, 
        recipientEmail, 
        category, 
        originalMessage, 
        replyMessage,
        agentName 
      }),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ success: true, data });
  } catch (error: unknown) {
    console.error("Internal error:", error);
    return Response.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    technical: "Problema técnico",
    products: "Productos",
    ecommerce: "E-commerce",
    subdomain: "Subdominios",
    billing: "Facturación",
    integrations: "Integraciones",
    general: "Consulta general",
  };
  return labels[category] || "Soporte";
}