import type { LengthUnit } from "@prisma/client"

export function validateLengthUnit(unit: string | null | undefined): LengthUnit | null {
    if (!unit) return null
    if (["MM", "CM", "M", "IN", "FT"].includes(unit)) {
        return unit as LengthUnit
    }
    return "CM"
}


