"use server"

import { insertNotification } from "../data/insertNotification"

export async function sentNotification() {
    try {

        const query = await insertNotification("Cuchaaaaa")

        return query

    } catch (error) {
        console.error(error)
    }
}
