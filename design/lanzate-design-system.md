# Lanzate Design System

Análisis extraído de `lanzate-public-pages.pen`

---

## 1. Paleta de Colores

### Colores Base (Zinc Scale - Dark Theme)

| Token | Hex | Uso |
|-------|-----|-----|
| `background` | `#18181B` | Background principal de páginas |
| `background-darker` | `#0F0F10` | Footer, áreas más oscuras |
| `surface` | `#27272A` | Cards, inputs, botones secundarios |
| `border` | `#3F3F46` | Bordes de inputs, divisores |
| `text-muted` | `#71717A` | Texto secundario, placeholders |
| `text-tertiary` | `#A1A1AA` | Subtítulos, texto terciario |
| `text-primary` | `#FAFAFA` | Texto principal |
| `text-white` | `#FFFFFF` | Texto en botones primarios |

### Colores de Marca

| Token | Hex | Uso |
|-------|-----|-----|
| `primary` | `#FF6B4A` | Botones primarios, links, accent |
| `primary-shadow` | `#FF6B4A40` | Sombra de botones (25% opacidad) |

### CSS Variables Propuestas

```css
:root {
  /* Background */
  --color-background: #18181B;
  --color-background-darker: #0F0F10;
  --color-surface: #27272A;

  /* Border */
  --color-border: #3F3F46;

  /* Text */
  --color-text-primary: #FAFAFA;
  --color-text-secondary: #71717A;
  --color-text-tertiary: #A1A1AA;
  --color-text-white: #FFFFFF;

  /* Brand */
  --color-primary: #FF6B4A;
  --color-primary-hover: #FF5A36; /* sugerido */
  --color-primary-shadow: rgba(255, 107, 74, 0.25);
}
```

---

## 2. Tipografía

### Font Family
- **Familia**: `Inter`
- **Fallback sugerido**: `Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

### Escala Tipográfica

| Token | Size | Weight | Line Height | Uso |
|-------|------|--------|-------------|-----|
| `display-xl` | 60px | 700 | 1.1 | Hero títulos principales |
| `display-lg` | 36px | 700 | 1.2 | Títulos de sección |
| `heading-lg` | 30px | 600 | 1.3 | Títulos de formularios (desktop) |
| `heading-md` | 28px | 600 | 1.3 | Títulos de formularios (mobile) |
| `heading-sm` | 20px | 700 | 1.4 | Logo, títulos pequeños |
| `body-lg` | 18px | 400/700 | 1.5 | Subtítulos hero, logo mobile |
| `body-md` | 16px | 400/500/600 | 1.5 | Cuerpo principal, botones |
| `body-sm` | 14px | 400/500/600 | 1.5 | Labels, links, nav |
| `caption` | 12px | 400 | 1.5 | Footer links, divisores |
| `caption-sm` | 11px | 400 | 1.5 | Copyright mobile |

### Font Weights

| Token | Value | Uso |
|-------|-------|-----|
| `font-normal` | 400 | Cuerpo de texto |
| `font-medium` | 500 | Links, labels importantes |
| `font-semibold` | 600 | Botones, títulos menores |
| `font-bold` | 700 | Títulos principales, logo |

---

## 3. Componentes

### 3.1 Typography (Componente Base)

```typescript
// Props del componente base Typography
interface TypographyProps {
  variant: 'display-xl' | 'display-lg' | 'heading-lg' | 'heading-md' |
           'heading-sm' | 'body-lg' | 'body-md' | 'body-sm' |
           'caption' | 'caption-sm';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'white';
  align?: 'left' | 'center' | 'right';
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'label';
  className?: string;
  children: React.ReactNode;
}
```

#### Composiciones desde Typography

**Text** (para párrafos y texto general):
```typescript
interface TextProps extends Omit<TypographyProps, 'variant'> {
  size?: 'lg' | 'md' | 'sm' | 'xs';
}
// Mapea: lg->body-lg, md->body-md, sm->body-sm, xs->caption
```

**Heading** (para títulos):
```typescript
interface HeadingProps extends Omit<TypographyProps, 'variant'> {
  level: 1 | 2 | 3 | 4 | 5 | 6;
}
// Mapea: 1->display-xl, 2->display-lg, 3->heading-lg, etc.
```

---

### 3.2 Button

#### Variantes identificadas

| Variante | Background | Text | Border | Shadow |
|----------|------------|------|--------|--------|
| `primary` | `#FF6B4A` | `#FFFFFF` | none | `0 2px 8px #FF6B4A40` |
| `secondary` | `#27272A` | `#FAFAFA` | `1px #3F3F46` | none |
| `ghost` | transparent | `#FF6B4A` | none | none |
| `icon` | `#27272A` | `#FAFAFA` | none | none |

#### Props

```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'icon';
  size: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onClick?: () => void;
}
```

#### Tamaños

| Size | Height Desktop | Height Mobile | Padding | Font Size | Border Radius |
|------|----------------|---------------|---------|-----------|---------------|
| `sm` | 36px | 36px | 8px 12px | 14px | 6px |
| `md` | 44px | 48px | 0 12px | 14px/16px | 6px/8px |
| `lg` | 52px | 52px | 0 32px | 16px | 8px |

---

### 3.3 Input / TextField

#### Variantes

| Estado | Background | Border | Text/Placeholder |
|--------|------------|--------|------------------|
| `default` | `#27272A` | `1px #3F3F46` | `#71717A` |
| `focused` | `#27272A` | `1px #FF6B4A` | `#FAFAFA` |
| `error` | `#27272A` | `1px #EF4444` | `#71717A` |
| `disabled` | `#27272A` | `1px #3F3F46` | `#52525B` |

#### Props

```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number' | 'search';
  label?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: 'md' | 'lg';
  fullWidth?: boolean;
  onChange?: (value: string) => void;
}
```

#### Tamaños

| Size | Height Desktop | Height Mobile | Padding | Font Size | Border Radius |
|------|----------------|---------------|---------|-----------|---------------|
| `md` | 44px | 48px | 0 12px | 14px/16px | 6px |
| `lg` | 48px | 52px | 0 14px | 16px | 8px |

---

### 3.4 Link

#### Props

```typescript
interface LinkProps {
  variant: 'default' | 'accent' | 'muted';
  size?: 'sm' | 'md';
  underline?: 'none' | 'hover' | 'always';
  leftIcon?: React.ReactNode;
  href: string;
  external?: boolean;
  children: React.ReactNode;
}
```

#### Estilos

| Variante | Color | Font Weight |
|----------|-------|-------------|
| `default` | `#FAFAFA` | 400 |
| `accent` | `#FF6B4A` | 500 |
| `muted` | `#71717A` | 400 |

---

### 3.5 Logo

#### Props

```typescript
interface LogoProps {
  size: 'sm' | 'md' | 'lg';
  showText?: boolean;
  color?: 'default' | 'white';
}
```

#### Tamaños

| Size | Icon Size | Font Size | Gap |
|------|-----------|-----------|-----|
| `sm` | 16px | 14px | 8px |
| `md` | 20px | 16-18px | 8px |
| `lg` | 24px | 20px | 8px |

---

### 3.6 NavLink

#### Props

```typescript
interface NavLinkProps {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}
```

#### Estilos

| Estado | Color | Font Weight |
|--------|-------|-------------|
| `default` | `#71717A` | 400 |
| `active` | `#FAFAFA` | 400 |
| `hover` | `#FAFAFA` | 400 |

---

### 3.7 Divider

#### Props

```typescript
interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  withText?: boolean;
  text?: string;
}
```

#### Estilos
- Color línea: `#3F3F46`
- Altura: `1px`
- Texto: `#71717A`, 12px, normal

---

### 3.8 Icon

#### Props

```typescript
interface IconProps {
  name: string; // lucide icon name
  size: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white';
}
```

#### Tamaños

| Size | Pixels |
|------|--------|
| `xs` | 16px |
| `sm` | 18px |
| `md` | 20px |
| `lg` | 24px |
| `xl` | 32px |

#### Iconos usados (Lucide)
- `rocket` - Logo
- `moon` - Theme toggle
- `menu` - Mobile menu
- `eye` - Password visibility
- `globe` - Google/OAuth
- `arrow-left` - Back navigation

---

## 4. Layouts / Composiciones

### 4.1 AppBar / Header

```typescript
interface AppBarProps {
  variant: 'desktop' | 'mobile';
  logo: React.ReactNode;
  navigation?: React.ReactNode;
  actions?: React.ReactNode;
}
```

#### Especificaciones

| Propiedad | Desktop | Mobile |
|-----------|---------|--------|
| Height | 64px | 56px |
| Padding horizontal | 48px | 16px |
| Background | `#18181B` | `#18181B` |

---

### 4.2 Footer

```typescript
interface FooterProps {
  variant: 'desktop' | 'mobile';
}
```

#### Especificaciones

| Propiedad | Desktop | Mobile |
|-----------|---------|--------|
| Height | 80px | auto |
| Padding | 0 48px | 24px 16px |
| Background | `#0F0F10` | `#0F0F10` |
| Layout | horizontal | vertical |

---

### 4.3 FormSection

```typescript
interface FormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
```

---

### 4.4 AuthLayout

```typescript
interface AuthLayoutProps {
  variant: 'split' | 'centered';
  imageSide?: 'left' | 'right';
  imageContent?: React.ReactNode;
  children: React.ReactNode;
}
```

---

### 4.5 Card / Section

```typescript
interface CardProps {
  variant: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  cornerRadius?: 'none' | 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}
```

---

## 5. Spacing Scale

| Token | Value |
|-------|-------|
| `space-1` | 4px |
| `space-2` | 6px |
| `space-3` | 8px |
| `space-4` | 12px |
| `space-5` | 16px |
| `space-6` | 20px |
| `space-7` | 24px |
| `space-8` | 32px |
| `space-9` | 40px |
| `space-10` | 48px |

---

## 6. Border Radius

| Token | Value | Uso |
|-------|-------|-----|
| `radius-sm` | 6px | Inputs, botones pequeños |
| `radius-md` | 8px | Botones, cards |
| `radius-lg` | 16px | Secciones, imágenes |

---

## 7. Shadows

| Token | Value | Uso |
|-------|-------|-----|
| `shadow-primary` | `0 2px 8px rgba(255, 107, 74, 0.25)` | Botón primario |
| `shadow-primary-lg` | `0 4px 16px rgba(255, 107, 74, 0.25)` | CTA hero |

---

## 8. Breakpoints Sugeridos

| Token | Value | Descripción |
|-------|-------|-------------|
| `sm` | 375px | Mobile |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop |
| `xl` | 1440px | Desktop grande |

---

## 9. Páginas Identificadas

1. **Landing Page** - Hero con CTA
2. **Login Page** - Formulario de inicio de sesión
3. **Signup Page** - Formulario de registro
4. **Forgot Password Page** - Recuperación de contraseña
5. **Email Confirmation Page** - Confirmación de correo

Todas las páginas tienen versiones **Desktop (1440px)** y **Mobile (375px)**.

---

## 10. Composiciones de Componentes

### FormField (Input + Label + Error)
```
FormField
├── Label (Typography variant="body-sm" weight="medium")
├── Input
└── HelperText (Typography variant="caption" color="error")
```

### AuthForm
```
AuthForm
├── FormHeader
│   ├── Heading
│   └── Text (subtitle)
├── FormFields
│   └── FormField[]
├── Button (primary)
├── Divider (with text "o")
├── Button (secondary - Google)
└── LinkRow
    ├── Text
    └── Link
```

### PageLayout (Auth)
```
PageLayout
├── AppBar
│   ├── Logo
│   ├── NavLinks
│   └── Actions
├── Content
│   ├── ImageSection (opcional)
│   └── FormSection
└── Footer
```
