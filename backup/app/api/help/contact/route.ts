import { Resend } from "resend";

import { EmailTemplate } from "@/features/global/components/contact-us/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email, name, category, message } = await req.json();

    if (!email || !message) {
      return Response.json(
        { error: "Faltan campos obligatorios." },
        { status: 400 }
      );
    }

    const subject = category 
      ? `[${getCategoryLabel(category)}] Nuevo mensaje de ${name || email}`
      : `Nuevo mensaje de ${name || email}`;

    const { data, error } = await resend.emails.send({
      from: "Lanzate <soporte@mail.lanzate.app>",
      to: ["jiamafox@gmail.com"],
      replyTo: email,
      subject,
      react: EmailTemplate({ name, email, category, message }),
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