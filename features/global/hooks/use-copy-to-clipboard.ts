"use client";

import { useState, useCallback } from "react";

/**
 * Hook for copying text to clipboard
 *
 * @returns Object with copy function and copied state
 *
 * @example
 * const { copy, copied } = useCopyToClipboard();
 * await copy("https://example.com");
 * // copied is true for 2 seconds after successful copy
 */
export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string): Promise<boolean> => {
    if (!navigator?.clipboard) {
      console.warn("Clipboard API not available");
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);

      return true;
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setCopied(false);
      return false;
    }
  }, []);

  return { copy, copied };
}
