// src/features/global/hooks/use-modal-hotkeys.ts

import { useEffect, useCallback } from 'react'

interface UseModalHotkeysProps {
    isOpen: boolean;
    isSaving: boolean;
    onSave: () => void;
    onClose: () => void;
}

/**
 * Hook para manejar atajos de teclado comunes (Guardar, Cerrar) dentro de un modal.
 * @param {UseModalHotkeysProps} props - Propiedades para el manejo del estado y callbacks.
 */
export const useModalHotkeys = ({
    isOpen,
    isSaving,
    onSave,
    onClose,
}: UseModalHotkeysProps) => {
    
    // Utilizamos useCallback para asegurar que handleKeyDown solo se recree cuando sus dependencias cambien
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!isOpen || isSaving) return;

        // 1. Ctrl/Cmd + S para guardar
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            onSave();
        }

        // 2. Enter para guardar (capturado globalmente si un input no lo maneja)
        // Ya que el formulario no es un <form>, Enter debe ser gestionado.
        // Si el target es un elemento interactivo que ya usa Enter (como un botón que no sea el de guardar),
        // esta lógica podría necesitar un ajuste más fino (e.g., verificar e.target.tagName).
        // Por ahora, funciona bien si el foco está en un <input> de texto.
        if (e.key === 'Enter') {
            e.preventDefault();
            onSave();
        }

        // 3. Escape para cerrar (ya manejado por Dialog, pero lo reforzamos si es necesario)
        if (e.key === 'Escape') {
            e.preventDefault();
            onClose();
        }

    }, [isOpen, isSaving, onSave, onClose]);


    useEffect(() => {
        if (!isOpen) return;

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, handleKeyDown]);
};