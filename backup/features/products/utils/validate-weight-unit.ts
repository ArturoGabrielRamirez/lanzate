import type { WeightUnit } from "@prisma/client"

export function validateWeightUnit(unit: string | null | undefined): WeightUnit | null {
    if (!unit) return null
    if (["MG", "G", "KG", "OZ", "LB"].includes(unit)) {
        return unit as WeightUnit
    }
    return "KG"
}


