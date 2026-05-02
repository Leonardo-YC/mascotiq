import "@testing-library/jest-dom";

// ── Mocks globales ────────────────────────────────────────────────────

// Mock de next/navigation (useRouter, redirect, etc.)
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

// Mock de next/headers (headers(), cookies())
jest.mock("next/headers", () => ({
  headers: () => new Map(),
  cookies: () => ({
    get: jest.fn(),
    set: jest.fn(),
  }),
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
  // CORREGIDO: Usamos unknown[] en lugar de any[]
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("Warning:")) return;
    originalError(...args);
  };
});
afterAll(() => { console.error = originalError; });