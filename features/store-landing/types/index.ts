import { Store } from "@/prisma/generated/prisma";

export type Category = {
  id: number;
  name: string;
  description?: string;
  image?: string;
  slug: string;
};

export type StoreContextType = {
  displayType: "grid" | "list"
  setDisplayType: (displayType: "grid" | "list") => void
}
