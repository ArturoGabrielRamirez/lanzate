export interface ProfileSegmentConfig {
  title: string
  label: string
}

export const PROFILE_SEGMENT_CONFIG: Record<string, ProfileSegmentConfig> = {
  "":      { title: "Perfil",      label: "Perfil" },
  billing: { title: "Facturación", label: "Facturación" },
} as const
