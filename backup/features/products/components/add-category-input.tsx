"use client";

import { useState } from "react";

import { InputTags } from "@/features/shadcn/components/ui/tag-input";

function AddCategoryInput() {
  const [categories, setCategories] = useState<string[]>([]);

  return <InputTags value={categories} onChange={setCategories} />;
}
export { AddCategoryInput };
