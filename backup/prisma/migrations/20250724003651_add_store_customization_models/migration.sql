-- CreateEnum
CREATE TYPE "HeaderPosition" AS ENUM ('TOP', 'FIXED_TOP', 'STICKY');

-- CreateEnum
CREATE TYPE "HeaderStyle" AS ENUM ('MODERN', 'CLASSIC', 'MINIMAL', 'BOLD');

-- CreateEnum
CREATE TYPE "LayoutStyle" AS ENUM ('MODERN', 'CLASSIC', 'MINIMAL', 'GRID', 'MAGAZINE');

-- CreateEnum
CREATE TYPE "ProductCardStyle" AS ENUM ('MODERN', 'CLASSIC', 'MINIMAL', 'DETAILED', 'COMPACT');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('HERO', 'FEATURED_PRODUCTS', 'CATEGORIES', 'ABOUT', 'TESTIMONIALS', 'NEWSLETTER', 'CONTACT', 'CUSTOM_HTML', 'PRODUCT_GRID', 'BANNER', 'VIDEO', 'GALLERY', 'FAQ', 'BLOG_POSTS', 'SOCIAL_FEED');

-- CreateEnum
CREATE TYPE "WidgetType" AS ENUM ('FEATURED_PRODUCTS', 'RECENT_PRODUCTS', 'POPULAR_PRODUCTS', 'CATEGORIES', 'SEARCH', 'CART_SUMMARY', 'USER_MENU', 'SOCIAL_LINKS', 'CONTACT_INFO', 'NEWSLETTER_SIGNUP', 'RECENT_ORDERS', 'TESTIMONIALS', 'CUSTOM_HTML', 'WEATHER', 'CLOCK', 'ANNOUNCEMENTS');

-- CreateEnum
CREATE TYPE "WidgetPosition" AS ENUM ('HEADER', 'SIDEBAR', 'FOOTER', 'FLOATING', 'MODAL', 'BANNER_TOP', 'BANNER_BOTTOM');

-- CreateTable
CREATE TABLE "store_customizations" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "primary_color" TEXT NOT NULL DEFAULT '#000000',
    "secondary_color" TEXT NOT NULL DEFAULT '#ffffff',
    "accent_color" TEXT NOT NULL DEFAULT '#6366f1',
    "background_color" TEXT NOT NULL DEFAULT '#ffffff',
    "text_color" TEXT NOT NULL DEFAULT '#000000',
    "secondary_text_color" TEXT NOT NULL DEFAULT '#6b7280',
    "border_color" TEXT NOT NULL DEFAULT '#e5e7eb',
    "success_color" TEXT NOT NULL DEFAULT '#10b981',
    "warning_color" TEXT NOT NULL DEFAULT '#f59e0b',
    "error_color" TEXT NOT NULL DEFAULT '#ef4444',
    "primary_font" TEXT NOT NULL DEFAULT 'Inter',
    "secondary_font" TEXT NOT NULL DEFAULT 'Inter',
    "font_size_base" TEXT NOT NULL DEFAULT '16px',
    "show_header" BOOLEAN NOT NULL DEFAULT true,
    "show_logo" BOOLEAN NOT NULL DEFAULT true,
    "show_search_bar" BOOLEAN NOT NULL DEFAULT true,
    "show_navigation_menu" BOOLEAN NOT NULL DEFAULT true,
    "show_cart_icon" BOOLEAN NOT NULL DEFAULT true,
    "show_user_account" BOOLEAN NOT NULL DEFAULT true,
    "header_position" "HeaderPosition" NOT NULL DEFAULT 'TOP',
    "header_style" "HeaderStyle" NOT NULL DEFAULT 'MODERN',
    "show_footer" BOOLEAN NOT NULL DEFAULT true,
    "footer_text" TEXT,
    "show_social_links" BOOLEAN NOT NULL DEFAULT true,
    "show_contact_info" BOOLEAN NOT NULL DEFAULT true,
    "show_store_info" BOOLEAN NOT NULL DEFAULT true,
    "layout_style" "LayoutStyle" NOT NULL DEFAULT 'MODERN',
    "container_max_width" TEXT NOT NULL DEFAULT '1200px',
    "border_radius" TEXT NOT NULL DEFAULT '8px',
    "spacing_unit" TEXT NOT NULL DEFAULT '1rem',
    "show_hero_section" BOOLEAN NOT NULL DEFAULT true,
    "show_featured_products" BOOLEAN NOT NULL DEFAULT true,
    "show_categories" BOOLEAN NOT NULL DEFAULT true,
    "show_testimonials" BOOLEAN NOT NULL DEFAULT false,
    "show_about_section" BOOLEAN NOT NULL DEFAULT false,
    "products_per_page" INTEGER NOT NULL DEFAULT 12,
    "product_card_style" "ProductCardStyle" NOT NULL DEFAULT 'MODERN',
    "show_product_rating" BOOLEAN NOT NULL DEFAULT true,
    "show_product_stock" BOOLEAN NOT NULL DEFAULT true,
    "show_add_to_cart_btn" BOOLEAN NOT NULL DEFAULT true,
    "custom_css" TEXT,
    "custom_js" TEXT,
    "favicon_url" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "google_analytics_id" TEXT,
    "facebook_pixel_id" TEXT,
    "google_tag_manager_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_customizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_section_configs" (
    "id" SERIAL NOT NULL,
    "customization_id" INTEGER NOT NULL,
    "section_type" "SectionType" NOT NULL,
    "section_name" TEXT NOT NULL,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "background_color" TEXT,
    "text_color" TEXT,
    "padding" TEXT DEFAULT '2rem',
    "margin" TEXT DEFAULT '0',
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "image_url" TEXT,
    "button_text" TEXT,
    "button_link" TEXT,
    "show_title" BOOLEAN NOT NULL DEFAULT true,
    "show_subtitle" BOOLEAN NOT NULL DEFAULT true,
    "show_description" BOOLEAN NOT NULL DEFAULT true,
    "columns_count" INTEGER DEFAULT 3,
    "items_per_row" INTEGER DEFAULT 4,
    "layout_style" TEXT DEFAULT 'grid',
    "config_json" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_section_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_widget_configs" (
    "id" SERIAL NOT NULL,
    "customization_id" INTEGER NOT NULL,
    "widget_type" "WidgetType" NOT NULL,
    "widget_name" TEXT NOT NULL,
    "position" "WidgetPosition" NOT NULL DEFAULT 'SIDEBAR',
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_visible" BOOLEAN NOT NULL DEFAULT true,
    "background_color" TEXT,
    "text_color" TEXT,
    "border_color" TEXT,
    "padding" TEXT DEFAULT '1rem',
    "margin" TEXT DEFAULT '0.5rem',
    "border_radius" TEXT DEFAULT '8px',
    "title" TEXT,
    "show_title" BOOLEAN NOT NULL DEFAULT true,
    "max_items" INTEGER DEFAULT 5,
    "auto_refresh" BOOLEAN NOT NULL DEFAULT false,
    "refresh_interval" INTEGER DEFAULT 300,
    "config_json" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "store_widget_configs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "store_customizations_store_id_key" ON "store_customizations"("store_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_section_configs_customization_id_section_type_key" ON "store_section_configs"("customization_id", "section_type");

-- AddForeignKey
ALTER TABLE "store_customizations" ADD CONSTRAINT "store_customizations_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_section_configs" ADD CONSTRAINT "store_section_configs_customization_id_fkey" FOREIGN KEY ("customization_id") REFERENCES "store_customizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_widget_configs" ADD CONSTRAINT "store_widget_configs_customization_id_fkey" FOREIGN KEY ("customization_id") REFERENCES "store_customizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
