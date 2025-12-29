"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import { useEffect, useState } from "react";

const initialRender = process.env.NODE_ENV === "production";

function NextThemeProvider(props: ThemeProviderProps) {
  const [shouldRender, setShouldRender] = useState(initialRender);
  useEffect(() => {
    if (!initialRender) {
      setShouldRender(true);
    }
  }, []);
  return shouldRender ? <ThemeProvider {...props} /> : props.children;
}
export { NextThemeProvider }