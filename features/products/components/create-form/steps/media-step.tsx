"use client";

import { useEffect } from "react";
import { ImagePlus, X, ArrowUp, ArrowDown, Star } from "lucide-react";

import { useCreateProductContext } from "@/features/products/hooks";
import type { CreateProductMediaItem } from "@/features/products/types";
import { Button } from "@/features/global/components/button/button";

/**
 * MediaStep - Step 2 of product creation
 *
 * Handles product image management:
 * - Upload multiple images via file input
 * - Set primary image
 * - Reorder images via up/down buttons
 * - Delete images
 */
export function MediaStep() {
  const { values, setValues, setStepValid } = useCreateProductContext();
  const { media } = values;
  const { images } = media;

  // Media step is optional, so always valid
  useEffect(() => {
    setStepValid(2, true);
  }, [setStepValid]);

  /**
   * Handle image upload from file input
   */
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newImages: CreateProductMediaItem[] = Array.from(files).map(
      (file, index) => ({
        id: `temp-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        altText: file.name,
        position: images.length + index,
        isPrimary: images.length === 0 && index === 0,
        file,
      })
    );

    setValues({
      media: {
        images: [...images, ...newImages],
      },
    });

    // Reset the input so the same file can be selected again
    event.target.value = "";
  };

  /**
   * Set an image as primary
   */
  const handleSetPrimary = (imageId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    setValues({ media: { images: updatedImages } });
  };

  /**
   * Remove an image
   */
  const handleRemoveImage = (imageId: string) => {
    const filteredImages = images.filter((img) => img.id !== imageId);
    // Recalculate positions and ensure a primary exists
    const hasPrimary = filteredImages.some((img) => img.isPrimary);
    const updatedImages = filteredImages.map((img, index) => ({
      ...img,
      position: index,
      isPrimary: hasPrimary ? img.isPrimary : index === 0,
    }));
    setValues({ media: { images: updatedImages } });
  };

  /**
   * Move image position up or down for reordering
   */
  const handleMoveImage = (imageId: string, direction: "up" | "down") => {
    const currentIndex = images.findIndex((img) => img.id === imageId);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= images.length) return;

    const updatedImages = [...images];
    const [movedImage] = updatedImages.splice(currentIndex, 1);
    updatedImages.splice(newIndex, 0, movedImage);

    // Update positions after reorder
    const reorderedImages = updatedImages.map((img, index) => ({
      ...img,
      position: index,
    }));

    setValues({ media: { images: reorderedImages } });
  };

  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Imagenes del Producto</h2>
        <p className="text-sm text-muted-foreground">
          Sube las imagenes de tu producto. La primera imagen sera la principal.
        </p>
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <ImagePlus className="h-10 w-10 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            Haz clic para seleccionar imagenes
          </span>
          <span className="text-xs text-muted-foreground">
            PNG, JPG, WebP hasta 5MB
          </span>
        </label>
      </div>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={image.id}
              className={`relative group rounded-lg overflow-hidden border-2 ${
                image.isPrimary ? "border-primary" : "border-transparent"
              }`}
            >
              {/* Image */}
              <img
                src={image.url}
                alt={image.altText}
                className="w-full h-32 object-cover"
              />

              {/* Primary Badge */}
              {image.isPrimary && (
                <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  Principal
                </span>
              )}

              {/* Actions Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {/* Reorder up button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleMoveImage(image.id!, "up")}
                  disabled={index === 0}
                  aria-label="Mover arriba"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>

                {/* Reorder down button */}
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8"
                  onClick={() => handleMoveImage(image.id!, "down")}
                  disabled={index === images.length - 1}
                  aria-label="Mover abajo"
                >
                  <ArrowDown className="h-4 w-4" />
                </Button>

                {/* Set as primary */}
                {!image.isPrimary && (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleSetPrimary(image.id!)}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    Principal
                  </Button>
                )}

                {/* Remove button */}
                <Button
                  size="icon"
                  variant="destructive"
                  className="h-8 w-8"
                  onClick={() => handleRemoveImage(image.id!)}
                  aria-label="Eliminar imagen"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {images.length === 0 && (
        <p className="text-center text-sm text-muted-foreground py-4">
          No hay imagenes. Sube al menos una imagen para tu producto.
        </p>
      )}
    </div>
  );
}
