"use server"

import { getAccountSetupData } from "@/features/dashboard/data"
import { actionWrapper } from "@/features/global/utils"
import { getUserInfo } from "@/features/layout/actions/getUserInfo"

export async function getAccountSetupDataAction() {
	return actionWrapper(async () => {

		const { payload: user } = await getUserInfo()

		if (!user) throw new Error("Usuario no autenticado")

		const { payload: accountSetupData } = await getAccountSetupData(user.id)

		return {
			message: "Cuenta de configuración obtenida correctamente",
			payload: accountSetupData,
			hasError: false
		}
	})
}


