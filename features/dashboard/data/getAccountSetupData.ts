"use server"

import { actionWrapper } from "@/utils/lib"
import { prisma } from "@/utils/prisma"

export type AccountSetupData = {
	storeCount: number
	productCount: number
	hasOperationalSettings: boolean
}

export type GetAccountSetupDataReturn = {
	message: string
	payload: AccountSetupData
	error: boolean
}

export async function getAccountSetupData(userId: number): Promise<GetAccountSetupDataReturn> {
	return actionWrapper(async () => {
		const storeCount = await prisma.store.count({
			where: {
				OR: [
					{ user_id: userId },
					{ employees: { some: { user_id: userId } } },
				],
			},
		})

		const productCount = await prisma.product.count({
			where: { owner_id: userId },
		})

		const operationalSettingsCount = await prisma.storeOperationalSettings.count({
			where: {
				store: {
					OR: [
						{ user_id: userId },
						{ employees: { some: { user_id: userId } } },
					],
				},
			},
		})

		return {
			message: "Account setup data fetched successfully",
			payload: {
				storeCount,
				productCount,
				hasOperationalSettings: operationalSettingsCount > 0,
			},
			error: false,
		}
	})
}


