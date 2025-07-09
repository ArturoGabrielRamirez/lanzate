import { getStoreWithProducts } from "@/features/subdomain/actions/getStoreWithProducts";


export default async function StorePage({ params }: { params: { subdomain: string } }) {
    const { payload: storeData, error } = await getStoreWithProducts(params.subdomain);

    if (error || !storeData) {
        return <div>Tienda no encontrada</div>;
    }

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