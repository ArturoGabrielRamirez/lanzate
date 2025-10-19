"use server"
import { cookies } from "next/headers";

export default async function getAuthHeaders(): Promise<HeadersInit> {
    const cookieStore = await cookies();

    return {
        'Content-Type': 'application/json',
        'Cookie': cookieStore.toString(),
    };
};