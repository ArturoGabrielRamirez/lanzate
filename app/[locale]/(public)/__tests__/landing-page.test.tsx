/**
 * Tests for Landing Page
 *
 * These tests verify that the public landing page is properly
 * structured with all required integrations.
 */

import { describe, test, expect } from "bun:test";

describe("Landing Page", () => {
  test("should have HeroSection component available", async () => {
    // Arrange - Import the HeroSection component
    const { HeroSection } = await import("@/features/landing/components");

    // Assert - Verify component is defined
    expect(HeroSection).toBeDefined();
    expect(typeof HeroSection).toBe("function");
  });

  test("should have translation messages for hero section", async () => {
    // Arrange - Import Spanish translations
    const esMessages = await import("@/messages/es.json");
    const enMessages = await import("@/messages/en.json");

    // Assert - Verify hero translations exist in Spanish
    expect(esMessages.hero).toBeDefined();
    expect(esMessages.hero.titleBefore).toBeDefined();
    expect(esMessages.hero.titleHighlight).toBeDefined();
    expect(esMessages.hero.titleAfter).toBeDefined();
    expect(esMessages.hero.subtitle).toBeDefined();
    expect(esMessages.hero.cta).toBeDefined();
    expect(esMessages.hero.cta.primary).toBeDefined();
    expect(esMessages.hero.cta.secondary).toBeDefined();

    // Assert - Verify hero translations exist in English
    expect(enMessages.hero).toBeDefined();
    expect(enMessages.hero.titleBefore).toBeDefined();
    expect(enMessages.hero.titleHighlight).toBeDefined();
    expect(enMessages.hero.titleAfter).toBeDefined();
    expect(enMessages.hero.subtitle).toBeDefined();
    expect(enMessages.hero.cta).toBeDefined();
    expect(enMessages.hero.cta.primary).toBeDefined();
    expect(enMessages.hero.cta.secondary).toBeDefined();
  });

  test("should have shadcn/ui components available", async () => {
    // Arrange - Import UI components used in landing page
    const { Button } = await import("@/components/ui/button");
    const { Card } = await import("@/components/ui/card");
    const { Separator } = await import("@/components/ui/separator");

    // Assert - Verify all components are defined
    expect(Button).toBeDefined();
    expect(Card).toBeDefined();
    expect(Separator).toBeDefined();
  });

  test("should have layout components available", async () => {
    // Arrange - Import layout components
    const { Header } = await import("@/features/layout/components/header");
    const { ThemeToggle } = await import("@/features/layout/components/theme-toggle");
    const { LanguageSwitcher } = await import("@/features/layout/components/language-switcher");

    // Assert - Verify all layout components are defined
    expect(Header).toBeDefined();
    expect(ThemeToggle).toBeDefined();
    expect(LanguageSwitcher).toBeDefined();
  });
});
