"use server"

import { getUserInfo } from "@/features/layout/actions/getUserInfo"
import { getAccountSetupData } from "@/features/dashboard/data/getAccountSetupData"

export async function getAccountSetupDataAction() {
	const { payload: user, error: userError } = await getUserInfo()
	if (userError || !user) {
		return { message: "Usuario no autenticado", payload: null, error: true }
	}

	return getAccountSetupData(user.id)
}


