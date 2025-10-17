"use server"

import { prisma } from "@/utils/prisma"

export async function getAccountSetupData(userId: number) {
	
	const stores = await prisma.store.findMany({
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
			storeCount: stores.length,
			productCount,
			hasOperationalSettings: operationalSettingsCount > 0,
			stores,
		},
		error: false,
	}
}


