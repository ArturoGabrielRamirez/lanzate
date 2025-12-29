"use client";

import { Loader2 } from "lucide-react";
import { useQueryState } from "nuqs";
import { useTransition } from "react";

import { ToggleLayout } from "@/components/systaliko-ui/ecommerce/toggle-layout";
import { ProductsContent } from "@/features/products/components/products-content";
import type { ProductsTableProps } from "@/features/products/types";
import { cn } from "@/lib/utils";

function ProductsTable({ data, storeId, slug }: ProductsTableProps) {
  const [limit, setLimit] = useQueryState("limit", { shallow: false });
  const [orderBy, setOrderBy] = useQueryState("orderBy", { shallow: false });
  const [loading, startTransition] = useTransition();

  return (
    <div className={cn("flex flex-col relative", loading && "opacity-50")}>
      {loading && (
        <Loader2 className="size-4 animate-spin absolute top-0 left-0" />
      )}
      <ToggleLayout>
        <ProductsContent
          data={data}
          loading={loading}
          limit={limit}
          setLimit={setLimit}
          orderBy={orderBy}
          setOrderBy={setOrderBy}
          startTransition={startTransition}
          storeId={storeId}
          slug={slug}
        />
      </ToggleLayout>
    </div>
  );
}

export { ProductsTable };
