import "@testing-library/jest-dom";

// ── Polyfills para JSDOM ──────────────────────────────────────────────
// jsdom no incluye las APIs nativas de fetch del navegador/Node moderno.
// Next.js (next/server) y Stripe las exigen para inicializarse.
// Apagamos la regla de 'any' de ESLint solo para este bloque porque 
// solo necesitamos engañar al entorno, no nos importan los tipos reales.
/* eslint-disable @typescript-eslint/no-explicit-any */
if (typeof global.Request === "undefined") {
  global.Request = class Request {} as any;
}
if (typeof global.Response === "undefined") {
  global.Response = class Response {} as any;
}
if (typeof global.Headers === "undefined") {
  global.Headers = class Headers {} as any;
}
if (typeof global.fetch === "undefined") {
  global.fetch = jest.fn() as any;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

// ── Mocks de Variables de Entorno Críticas ────────────────────────────
// Evita que los imports de la BD y Stripe arrojen throw new Error()
process.env.DATABASE_URL = "postgres://mock:mock@localhost/mock";
process.env.STRIPE_SECRET_KEY = "sk_test_mock";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_mock";
process.env.GEMINI_API_KEY = "mock_gemini_key";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

// ── Mocks globales ────────────────────────────────────────────────────
// Mock de next/navigation
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => "/",
  redirect: jest.fn(),
}));

// Mock de next/headers (En Next.js 15 son Asíncronos)
jest.mock("next/headers", () => ({
  headers: jest.fn().mockResolvedValue(new Map()),
  cookies: jest.fn().mockResolvedValue({
    get: jest.fn(),
    set: jest.fn(),
  }),
}));

// Mock de next/cache (Para que revalidatePath no rompa los tests)
jest.mock("next/cache", () => ({
  revalidatePath: jest.fn(),
}));

// Mock de Clerk para server actions
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn().mockResolvedValue({
    userId: "user_test_123",
    sessionClaims: { metadata: { role: "user" } },
  }),
  currentUser: jest.fn().mockResolvedValue({
    id: "user_test_123",
    firstName: "Leo",
    emailAddresses: [{ emailAddress: "leo@test.com" }],
  }),
  clerkClient: jest.fn().mockResolvedValue({
    users: {
      updateUser: jest.fn().mockResolvedValue({}),
      getUser: jest.fn().mockResolvedValue({}),
    },
    invitations: {
      createInvitation: jest.fn().mockResolvedValue({}),
    },
  }),
}));

// Mock de Clerk para client components
jest.mock("@clerk/nextjs", () => ({
  useAuth: () => ({
    isLoaded: true,
    userId: "user_test_123",
    sessionClaims: { metadata: { role: "user" } },
  }),
  useUser: () => ({
    isLoaded: true,
    user: { id: "user_test_123", firstName: "Leo", publicMetadata: { role: "user" } },
  }),
  UserButton: () => null,
}));

// Silenciar console.error en tests (para errores esperados)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Warning:")) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });