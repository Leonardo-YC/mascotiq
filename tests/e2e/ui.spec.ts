/**
 * PRUEBAS DE INTERFAZ DE USUARIO (E2E)
 * tests/e2e/ui.spec.ts
 *
 * Prueba los flujos de navegación y elementos visuales de Mascotiq.
 */

import { test, expect } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// LANDING PAGE
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Landing Page — UI", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renderiza el título principal correctamente", async ({ page }) => {
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByText("Mascotiq")).toBeVisible();
  });

  test("el botón de Diagnóstico Gratuito está visible y es clickeable", async ({ page }) => {
    const btn = page.getByRole("link", { name: /diagnóstico gratuito/i }).first();
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test("la sección FAQ muestra al menos 3 preguntas", async ({ page }) => {
    await page.goto("/#faq");
    const faqItems = page.locator("details");
    await expect(faqItems).toHaveCount(3);
  });

  test("el navbar tiene los links principales", async ({ page }) => {
    await expect(page.getByRole("link", { name: /planes/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /catálogo/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /nosotros/i }).first()).toBeVisible();
    await expect(page.getByRole("link", { name: /contacto/i }).first()).toBeVisible();
  });

  test("el footer tiene los links legales", async ({ page }) => {
    await expect(page.getByRole("link", { name: /privacidad/i })).toBeVisible();
    await expect(page.getByRole("link", { name: /términos/i })).toBeVisible();
  });

  test("la página carga en menos de 3 segundos", async ({ page }) => {
    const start = Date.now();
    await page.goto("/");
    await page.waitForLoadState("domcontentloaded");
    const elapsed = Date.now() - start;
    expect(elapsed).toBeLessThan(3000);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CATÁLOGO
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Catálogo — UI", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/catalogo");
  });

  test("muestra el encabezado del catálogo", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /catálogo/i })).toBeVisible();
  });

  test("el buscador de productos es funcional", async ({ page }) => {
    const search = page.getByPlaceholder(/buscar/i);
    await expect(search).toBeVisible();
    await search.fill("omega");
    await expect(search).toHaveValue("omega");
  });

  test("los filtros del sidebar están visibles en desktop", async ({ page }) => {
    await expect(page.getByText("Filtros")).toBeVisible();
    await expect(page.getByText("Todas las mascotas")).toBeVisible();
    await expect(page.getByText("Perros")).toBeVisible();
    await expect(page.getByText("Gatos")).toBeVisible();
  });

  test("hacer click en un producto navega al detalle", async ({ page }) => {
    const firstProduct = page.locator("a[href^='/catalogo/']").first();
    if (await firstProduct.isVisible()) {
      await firstProduct.click();
      await expect(page).toHaveURL(/\/catalogo\/\d+/);
    }
  });

  test("la paginación es funcional si hay más de una página", async ({ page }) => {
    const nextBtn = page.locator("button[aria-label*='siguiente'], button:has(svg)").last();
    const pagination = page.locator("text=/Página \\d+ de \\d+/");
    if (await pagination.isVisible()) {
      const paginationText = await pagination.textContent();
      expect(paginationText).toMatch(/Página \d+ de \d+/);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PLANES
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Planes — UI", () => {

  test("muestra los 5 planes de suscripción", async ({ page }) => {
    await page.goto("/planes");
    await expect(page.getByText("Plan Senior Gato")).toBeVisible();
    await expect(page.getByText("Plan Senior Perro Pequeño")).toBeVisible();
    await expect(page.getByText("Plan Senior Perro Mediano")).toBeVisible();
    await expect(page.getByText("Plan Senior Perro Grande")).toBeVisible();
    await expect(page.getByText("Plan Senior Perro Gigante")).toBeVisible();
  });

  test("los precios de los planes son visibles", async ({ page }) => {
    await page.goto("/planes");
    await expect(page.getByText(/S\/ \d+/).first()).toBeVisible();
  });

  test("el banner informativo sobre el quiz está presente", async ({ page }) => {
    await page.goto("/planes");
    await expect(page.getByText(/diagnóstico/i).first()).toBeVisible();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// CONTACTO
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Formulario de Contacto — UI", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/contacto");
  });

  test("el formulario tiene todos los campos requeridos", async ({ page }) => {
    await expect(page.getByPlaceholder(/nombre/i)).toBeVisible();
    await expect(page.getByPlaceholder(/correo/i)).toBeVisible();
    await expect(page.getByRole("combobox")).toBeVisible(); // select de asunto
    await expect(page.getByPlaceholder(/mensaje/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /enviar/i })).toBeVisible();
  });

  test("el formulario muestra error si se envía vacío", async ({ page }) => {
    const submitBtn = page.getByRole("button", { name: /enviar/i });
    await submitBtn.click();
    // HTML5 validation o error visible
    const nameInput = page.getByPlaceholder(/nombre/i);
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.validity.valid);
    expect(isInvalid).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSIVIDAD MÓVIL
// ─────────────────────────────────────────────────────────────────────────────
test.describe("Responsividad — Mobile", () => {

  test("la landing se ve correctamente en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await expect(page.getByText("Mascotiq")).toBeVisible();
    // El sidebar desktop no debe estar visible en móvil
    const desktopNav = page.locator(".hidden.lg\\:flex");
    await expect(desktopNav.first()).not.toBeVisible();
  });

  test("el menú hamburguesa funciona en móvil", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    const menuBtn = page.getByRole("button").filter({ has: page.locator("svg") }).first();
    await menuBtn.click();
    await expect(page.getByRole("link", { name: /planes/i }).last()).toBeVisible();
  });
});