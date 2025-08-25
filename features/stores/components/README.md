# Store Form Components

Este directorio contiene componentes modulares para manejar formularios de tiendas de diferentes maneras.

## Estructura

```
components/
├── form-sections/           # Componentes de sección individuales
│   ├── basic-info-section.tsx
│   ├── address-section.tsx
│   ├── contact-section.tsx
│   ├── social-media-section.tsx
│   └── index.ts
├── section-buttons/         # Botones popup para editar secciones individuales
│   ├── edit-basic-info-button.tsx
│   ├── edit-address-button.tsx
│   ├── edit-contact-button.tsx
│   ├── edit-social-media-button.tsx
│   └── index.ts
├── store-form-button.tsx    # Formulario completo (crear/editar)
├── store-information-form.tsx # Formulario de información de tienda (cliente)
└── examples/
    └── store-form-examples.tsx
```

## Componentes de Sección (`form-sections/`)

Cada sección es un componente independiente que puede ser usado dentro de un formulario completo o como parte de un botón popup individual.

### Componentes de Formulario (para edición)

#### BasicInfoSection
- **Campos**: name, description, subdomain
- **Uso**: Información básica de la tienda

#### AddressSection
- **Campos**: is_physical_store, address, city, province, country
- **Uso**: Información de dirección de la tienda
- **Validación**: Los campos de dirección son obligatorios solo si `is_physical_store` es `true`

#### ContactSection
- **Campos**: contact_phone, contact_email
- **Uso**: Información de contacto de la tienda

#### SocialMediaSection
- **Campos**: facebook_url, instagram_url, x_url
- **Uso**: Enlaces a redes sociales

### Componentes de Visualización (solo lectura)

#### BasicInfoDisplay
- **Campos**: name, description, subdomain
- **Uso**: Mostrar información básica de la tienda en modo solo lectura

#### AddressDisplay
- **Campos**: is_physical_store, address, city, province, country
- **Uso**: Mostrar información de dirección de la tienda en modo solo lectura
- **Característica**: Solo muestra campos de dirección si `is_physical_store` es `true`

#### ContactDisplay
- **Campos**: contact_phone, contact_email
- **Uso**: Mostrar información de contacto de la tienda en modo solo lectura

#### SocialMediaDisplay
- **Campos**: facebook_url, instagram_url, x_url
- **Uso**: Mostrar enlaces a redes sociales en modo solo lectura

## Botones de Sección (`section-buttons/`)

Cada botón abre un popup con un formulario específico para editar solo esa sección.

### EditBasicInfoButton
- Permite editar solo la información básica
- Incluye validación específica para esta sección

### EditAddressButton
- Permite editar solo la información de dirección
- Incluye validación condicional para campos de dirección

### EditContactButton
- Permite editar solo la información de contacto
- Incluye validación para teléfono y email

### EditSocialMediaButton
- Permite editar solo los enlaces de redes sociales
- Incluye validación para URLs de Facebook, Instagram y X (Twitter)

## Formulario Completo (`store-form-button.tsx`)

Componente principal que incluye todas las secciones en un formulario con acordeón.

## Formulario de Información de Tienda (`store-information-form.tsx`)

Componente cliente que envuelve el formulario de información de tienda con todos los accordions de visualización.

### Características:
- **Componente cliente**: Permite pasar funciones como props
- **Formulario integrado**: Incluye `Form` de react-hook-form
- **Accordions modulares**: Usa todos los componentes de visualización
- **Flexible**: Permite contenido adicional a través de `children`
- **Condicional**: Muestra contenido adicional solo si `canManageStore` es `true`

### Uso:
```tsx
<StoreInformationForm
    store={store}
    onSubmit={handleSubmit}
    canManageStore={canManageStore}
>
    <div className="mt-6 pt-6 border-t">
        <EditStoreButton userId={user.id} slug={store.slug} store={store} />
    </div>
</StoreInformationForm>
```

### Modos de Uso

#### Modo "create"
```tsx
<StoreFormButton
    mode="create"
    userId={userId}
    canCreate={true}
    schema={createSchema}
    action={createStoreAction}
    messages={{
        success: "Store created successfully!",
        error: "Failed to create store",
        loading: "Creating store..."
    }}
/>
```

#### Modo "edit"
```tsx
<StoreFormButton
    mode="edit"
    userId={userId}
    slug={store.slug}
    store={store}
    schema={editSchema}
    action={updateStoreAction}
    messages={{
        success: "Store updated successfully!",
        error: "Failed to update store",
        loading: "Updating store..."
    }}
/>
```

## Esquemas de Validación

Cada sección tiene su propio esquema de validación:

- `basic-info-schema.ts`: Validación para información básica
- `address-schema.ts`: Validación para dirección (con validación condicional)
- `contact-schema.ts`: Validación para información de contacto
- `social-media-schema.ts`: Validación para enlaces de redes sociales
- `store-schema.ts`: Esquema completo para crear/editar tienda

## Acciones del Servidor

Cada sección tiene su propia acción del servidor:

- `updateStoreBasicInfo.ts`: Actualiza información básica
- `updateStoreAddress.ts`: Actualiza información de dirección
- `updateStoreContact.ts`: Actualiza información de contacto
- `updateStoreSocialMedia.ts`: Actualiza enlaces de redes sociales
- `updateStore.ts`: Actualiza toda la tienda

## Ejemplo de Uso

```tsx
import { StoreFormButton } from "@/features/stores/components/store-form-button"
import { EditBasicInfoButton, EditAddressButton } from "@/features/stores/components/section-buttons"
import { 
    BasicInfoDisplay, 
    AddressDisplay, 
    ContactDisplay, 
    SocialMediaDisplay 
} from "@/features/stores/components/form-sections"

// Formulario completo para editar
<StoreFormButton mode="edit" userId={userId} store={store} ... />

// Botones individuales para editar
<EditBasicInfoButton store={store} userId={userId} />
<EditAddressButton store={store} userId={userId} />
<EditContactButton store={store} userId={userId} />
<EditSocialMediaButton store={store} />

// Visualización en modo solo lectura
<Accordion type="single" collapsible defaultValue="item-1">
    <BasicInfoDisplay store={store} />
    <AddressDisplay store={store} />
    <ContactDisplay store={store} />
    <SocialMediaDisplay store={store} />
</Accordion>
```

## Características

- **Modular**: Cada sección es independiente
- **Reutilizable**: Los componentes pueden usarse en diferentes contextos
- **Validación**: Cada sección tiene su propia validación
- **Responsive**: Diseño adaptativo
- **Accesible**: Incluye etiquetas y manejo de errores
- **Internacionalización**: Soporte para múltiples idiomas
