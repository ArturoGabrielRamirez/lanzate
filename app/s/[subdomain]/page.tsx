import { getStoreProducts } from "@/features/subdomain/actions/getStoreProducts";


export default async function StorePage({ params }: { params: { subdomain: string } }) {
  const storeData = await getStoreProducts(params.subdomain);

  if (!storeData) {
    return <div>Tienda no encontrada</div>;
  }

  console.log('Store Data:', storeData);

  return (
    <div>
      <h1>Tienda: {storeData.store.name}</h1>
      <div>
        {storeData.products.map((product) => (
          <div key={product.id}>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <p>Precio: ${product.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}