import { pgTable, text, serial, timestamp, boolean, decimal, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  role: text('role').default('user').notNull(),
  // FIX: guardamos el Stripe Customer ID para no necesitar
  // recuperar la suscripción cada vez que se abre el portal
  stripeCustomerId: text('stripe_customer_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const pets = pgTable('pets', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  species: text('species').notNull(),
  breed: text('breed'),
  isMixed: boolean('is_mixed').default(false).notNull(),
  birthDate: timestamp('birth_date').notNull(),
  weightKg: decimal('weight_kg', { precision: 5, scale: 2 }).notNull(),
  lifeStage: text('life_stage'),
  photoUrl: text('photo_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
});

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  categoryId: integer('category_id').references(() => categories.id),
  name: text('name').notNull(),
  description: text('description').notNull(),
  ingredients: text('ingredients'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  subscriptionPrice: decimal('subscription_price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url'),
  isActive: boolean('is_active').default(true).notNull(),
});

export const plans = pgTable('plans', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stripePriceId: text('stripe_price_id').notNull(),
  stripeProductId: text('stripe_product_id'),
  interval: text('interval').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
});

export const planProducts = pgTable('plan_products', {
  id: serial('id').primaryKey(),
  planId: integer('plan_id').notNull().references(() => plans.id, { onDelete: 'cascade' }),
  productId: integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
});

export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id),
  petId: integer('pet_id').notNull().references(() => pets.id),
  planId: integer('plan_id').notNull().references(() => plans.id),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  status: text('status').notNull(),
  currentPeriodEnd: timestamp('current_period_end').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').notNull().references(() => subscriptions.id, { onDelete: 'cascade' }),
  status: text('status').default('Pendiente').notNull(),
  trackingNumber: text('tracking_number'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const chatUsage = pgTable('chat_usage', {
  id: serial('id').primaryKey(),
  identifier: text('identifier').notNull().unique(),
  messageCount: integer('message_count').default(0).notNull(),
  lastResetDate: timestamp('last_reset_date').defaultNow().notNull(),
});

export const futureNotifications = pgTable('future_notifications', {
  id: serial('id').primaryKey(),
  email: text('email').notNull(),
  petName: text('pet_name').notNull(),
  species: text('species').notNull(),
  birthDate: timestamp('birth_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});