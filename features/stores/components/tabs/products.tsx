import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

import { getUserInfo } from "@/features/global/actions/get-user-info.action";
import { CreateProductButton } from "@/features/products/components/create-form/create-product-button";
import { ProductsTableWrapper } from "@/features/products/components/products-table-wrapper";
import { getStoreBasicInfoBySlugAction } from "@/features/stores/actions/get-store-basic-info-by-slug.action";
import { ProductsTabProps } from "@/features/stores/types";

async function ProductsTabContent({
  slug,
  userId,
  limit,
  orderBy,
  page,
  search,
}: ProductsTabProps & {
  userId: number;
  limit: number;
  orderBy: string;
  page: number;
  search: string;
}) {
  const {
    payload: storeInfo,
    hasError: storeError,
    message: storeMessage,
  } = await getStoreBasicInfoBySlugAction(slug);

  if (storeError || !storeInfo) {
    console.error(storeMessage || "Error al cargar información de la tienda");
    return null;
  }

  return (
    <ProductsTableWrapper
      storeId={storeInfo.id}
      slug={slug}
      userId={userId}
      branches={storeInfo.branches}
      headerActions={
        <CreateProductButton storeId={storeInfo.id} userId={userId} />
      }
      limit={limit}
      orderBy={orderBy}
      page={page}
      search={search}
    />
  );
}

async function ProductsTab({
  slug,
  limit,
  orderBy,
  page,
  search,
}: ProductsTabProps & {
  limit: number;
  orderBy: string;
  page: number;
  search: string;
}) {
  const t = await getTranslations("store.products-tab");

  const {
    payload: user,
    hasError: userError,
    message: userMessage,
  } = await getUserInfo();

  if (userError || !user) {
    console.error(userMessage);
    return null;
  }

  return (
    <Suspense
      fallback={<div>{t("loading-products") || "Cargando productos..."}</div>}
    >
      <ProductsTabContent
        slug={slug}
        userId={user.id}
        limit={limit}
        orderBy={orderBy}
        page={page}
        search={search}
      />
    </Suspense>
  );
}

export default ProductsTab;
