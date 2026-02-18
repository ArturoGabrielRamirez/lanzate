export interface StoreSegmentConfig {
  title: string
  label: string
}

export const STORE_SEGMENT_CONFIG: Record<string, StoreSegmentConfig> = {
  "":           { title: "Dashboard",   label: "" },
  products:     { title: "Productos",   label: "Productos" },
  orders:       { title: "Órdenes",     label: "Órdenes" },
  operations:   { title: "Operaciones", label: "Operaciones" },
  history:      { title: "Historial",   label: "Historial" },
} as const
