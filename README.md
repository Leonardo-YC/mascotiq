<div align="center">

<img src="public/images/logo-email.png" alt="Mascotiq Logo" width="100" />

# Mascotiq

**Plataforma de suscripción nutricional personalizada para mascotas senior**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=nextdotjs)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss)](https://tailwindcss.com)
[![Clerk](https://img.shields.io/badge/Auth-Clerk-6c47ff?logo=clerk)](https://clerk.com)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-635bff?logo=stripe)](https://stripe.com)
[![License](https://img.shields.io/badge/License-Proprietary-red)](LICENSE)

[Demo en vivo](https://mascotiq.vercel.app) · [Reportar bug](https://github.com/Leonardo-YC/mascotiq/issues) · [Documentación](https://github.com/Leonardo-YC/mascotiq/wiki)

</div>

---

## Descripción

Mascotiq es una plataforma SaaS de suscripción nutricional para mascotas que utiliza un **motor biológico de senioridad** para determinar en qué etapa de vida se encuentra cada mascota según su especie, peso y edad. Basado en ese diagnóstico, el sistema asigna automáticamente el plan nutricional correcto y entrega una caja mensual con suplementos especializados.

El proyecto está orientado al mercado latinoamericano y fue construido íntegramente como proyecto personal, siendo un ejemplo de aplicación full-stack moderna con integraciones reales de autenticación, pagos recurrentes, IA generativa y envío de correos transaccionales.

---

## Características

- **Motor de Senioridad Biológica** — clasifica a cada mascota en `puppy`, `adult` o `senior` según especie, peso y edad real
- **Quiz de Diagnóstico** — flujo de 3 pasos que registra a la mascota y recomienda el plan correcto
- **5 Planes de Suscripción** — Gato, Perro Pequeño, Mediano, Grande y Gigante, con precios diferenciados
- **Checkout con Stripe** — suscripciones recurrentes mensuales con portal de gestión integrado
- **Dashboard del Cliente** — planes activos, estado de pedidos, historial y gestión de mascotas
- **Panel de Administración** — métricas, catálogo, gestión de planes, pedidos y usuarios
- **Asistente IA (Gemini)** — chatbot nutricional con análisis de imágenes (etiquetas de alimentos)
- **Catálogo Referencial** — vitrina de suplementos con filtros por especie y categoría
- **Roles de Usuario** — cliente, staff (logística) y administrador con permisos diferenciados
- **Emails Transaccionales** — bienvenida, pago fallido y renovación vía Gmail SMTP
- **Diseño Responsivo** — optimizado para móvil, tablet y escritorio

---

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 15 (App Router) |
| Lenguaje | TypeScript 5 |
| Estilos | Tailwind CSS 3 |
| Autenticación | Clerk |
| Base de Datos | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Pagos | Stripe (suscripciones recurrentes) |
| Almacenamiento de imágenes | UploadThing |
| IA | Google Gemini 1.5 Flash |
| Emails | Nodemailer + Gmail SMTP |
| Hosting | Vercel |

---

## Estructura del Proyecto

```
mascotiq/
├── src/
│   ├── app/
│   │   ├── (public)/          # Páginas públicas (landing, catálogo, planes, quiz)
│   │   ├── (dashboard)/       # Panel del cliente
│   │   ├── (admin)/           # Panel de administración
│   │   └── api/               # API Routes (webhooks, seed, my-pets, cron)
│   ├── actions/               # Server Actions (checkout, quiz, pets, plans, users…)
│   ├── components/
│   │   ├── admin/             # Componentes del panel admin
│   │   ├── catalogo/          # ProductGrid, ProductCTA
│   │   ├── dashboard/         # DashboardClient, modales
│   │   ├── layout/            # Navbar, Footer
│   │   ├── planes/            # PlanesPublicClient
│   │   └── quiz/              # QuizWizard, Steps
│   ├── core/
│   │   ├── engines/           # seniority-engine, recommendation-engine
│   │   └── validators/        # quiz-schema (Zod)
│   ├── emails/                # Plantillas React Email
│   └── lib/
│       ├── db/                # Schema Drizzle + cliente Neon
│       └── stripe/            # Cliente Stripe
├── public/                    # Assets estáticos (logo, imágenes)
├── .env.local                 # Variables de entorno (no incluido en repo)
├── middleware.ts              # Protección de rutas con Clerk
├── drizzle.config.ts
└── README.md
```

---

## Instalación y Configuración

### Requisitos previos

- Node.js 20+
- Cuenta en [Neon](https://neon.tech) (PostgreSQL serverless)
- Cuenta en [Clerk](https://clerk.com) (autenticación)
- Cuenta en [Stripe](https://stripe.com) (pagos)
- Cuenta en [UploadThing](https://uploadthing.com) (imágenes)
- Cuenta en [Google AI Studio](https://aistudio.google.com) (Gemini API)
- App Password de Gmail (para Nodemailer)

### 1. Clonar el repositorio

```bash
git clone https://github.com/Leonardo-YC/mascotiq.git
cd mascotiq
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# ── Base de Datos ────────────────────────────────
DATABASE_URL=postgresql://...

# ── Clerk (Autenticación) ────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# ── Stripe (Pagos) ───────────────────────────────
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# ── UploadThing (Imágenes) ───────────────────────
UPLOADTHING_SECRET=sk_live_...
UPLOADTHING_APP_ID=...

# ── Google Gemini (IA) ───────────────────────────
GEMINI_API_KEY=...

# ── Nodemailer (Gmail SMTP) ──────────────────────
GMAIL_USER=tu-correo@gmail.com
GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx

# ── General ─────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=tu-secreto-para-el-cron
```

### 3. Configurar la base de datos

```bash
# Generar y aplicar migraciones
npx drizzle-kit push
```

### 4. Sembrar el catálogo inicial

Una vez el servidor esté corriendo:

```
GET http://localhost:3000/api/seed
```

Para borrar y resembrar:

```
GET http://localhost:3000/api/seed?reset=1
```

### 5. Configurar webhooks

**Stripe** — añade el webhook en el dashboard de Stripe apuntando a:
```
https://tu-dominio.com/api/webhooks/stripe
```
Eventos requeridos: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.deleted`, `customer.subscription.updated`

**Clerk** — añade el webhook apuntando a:
```
https://tu-dominio.com/api/webhooks/clerk
```
Eventos requeridos: `user.created`

### 6. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Flujo de Usuario

```
Landing  →  /quiz (requiere login)  →  Resultado + plan recomendado
                                             ↓
                                    /planes?recommended=...
                                             ↓
                                  Selecciona mascota → Stripe Checkout
                                             ↓
                                    /dashboard (plan activo)
```

---

## Roles y Permisos

| Acción | Visitante | Cliente | Staff | Admin |
|---|:---:|:---:|:---:|:---:|
| Ver landing, catálogo, planes | ✅ | ✅ | ✅ | ✅ |
| Hacer el quiz | ❌ | ✅ | ✅ | ✅ |
| Dashboard personal | ❌ | ✅ | ✅ | ✅ |
| Gestionar mascotas | ❌ | ✅ | ✅ | ✅ |
| Panel de pedidos | ❌ | ❌ | ✅ | ✅ |
| Panel de métricas | ❌ | ❌ | ❌ | ✅ |
| Gestionar catálogo | ❌ | ❌ | ❌ | ✅ |
| Gestionar planes | ❌ | ❌ | ❌ | ✅ |
| Gestionar usuarios | ❌ | ❌ | ❌ | ✅ |

Para asignar un rol de `admin` o `staff` a un usuario, ve al panel de Administración → Usuarios → cambia el rol desde el selector.

---

## API Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/my-pets` | Mascotas del usuario autenticado con datos de plan activo |
| `POST` | `/api/webhooks/stripe` | Webhook de Stripe (suscripciones y pagos) |
| `POST` | `/api/webhooks/clerk` | Webhook de Clerk (sincronización de usuarios) |
| `GET` | `/api/seed` | Siembra el catálogo inicial |
| `GET` | `/api/seed?reset=1` | Borra y re-siembra el catálogo |
| `GET` | `/api/seed?clean=1` | Borra el catálogo sin resembrar |
| `GET` | `/api/cron` | Cron job para limpieza de datos (protegido con `CRON_SECRET`) |

---

## Motor de Senioridad

El motor biológico clasifica la etapa de vida de una mascota según estas reglas:

| Especie | Condición | Etapa |
|---|---|---|
| Cualquiera | Edad < 1 año | `puppy` |
| Gato | Edad ≥ 7 años | `senior` |
| Perro < 10 kg | Edad ≥ 9 años | `senior` |
| Perro 10–25 kg | Edad ≥ 7 años | `senior` |
| Perro 25–45 kg | Edad ≥ 6 años | `senior` |
| Perro > 45 kg | Edad ≥ 5 años | `senior` |

---

## Deploy en Producción

El proyecto está optimizado para desplegarse en **Vercel**:

1. Conecta el repositorio en [vercel.com](https://vercel.com)
2. Configura todas las variables de entorno del paso 2
3. Actualiza `NEXT_PUBLIC_APP_URL` con tu dominio de producción
4. Actualiza los webhooks de Stripe y Clerk con la URL de producción
5. Configura CORS en Clerk para tu dominio

---

## Licencia

Este proyecto está bajo una **Licencia Propietaria de Código Disponible**. Puedes ver el código fuente con fines educativos y personales, pero no está permitido su uso comercial ni la creación de productos derivados. Consulta el archivo [LICENSE](LICENSE) para más detalles.

---

## Autor

**Leonardo Yupán Cruz**

[![GitHub](https://img.shields.io/badge/GitHub-Leonardo--YC-181717?logo=github)](https://github.com/Leonardo-YC)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Leonardo-0a66c2?logo=linkedin)](https://www.linkedin.com/in/leonardo-yupán-crúz-4b7158336/)
[![Instagram](https://img.shields.io/badge/Instagram-_leoyc-e4405f?logo=instagram)](https://www.instagram.com/_leoyc/)

---

<div align="center">
  <sub>Hecho con ❤️ para mascotas senior de Latinoamérica · © 2026 Leonardo Yupán Crúz</sub>
</div>