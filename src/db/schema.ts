import { pgTable, serial, varchar, decimal, timestamp, text, jsonb, integer } from 'drizzle-orm/pg-core';

// Payments table
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  order_id: varchar('order_id', { length: 255 }).notNull().unique(),
  plan: varchar('plan', { length: 50 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull().default('RUB'),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  paid_at: timestamp('paid_at'),
  raw: jsonb('raw'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Licenses table
export const licenses = pgTable('licenses', {
  id: serial('id').primaryKey(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  level: varchar('level', { length: 50 }).notNull(),
  plan: varchar('plan', { length: 50 }),
  expires_at: timestamp('expires_at'),
  seats: integer('seats'),
  activated_at: timestamp('activated_at').notNull().defaultNow(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Feature flags table
export const feature_flags = pgTable('feature_flags', {
  id: serial('id').primaryKey(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  key: varchar('key', { length: 100 }).notNull(),
  value: jsonb('value'),
  expires_at: timestamp('expires_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Support tickets table
export const support_tickets = pgTable('support_tickets', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  order_id: varchar('order_id', { length: 255 }),
  plan: varchar('plan', { length: 50 }),
  topic: varchar('topic', { length: 100 }).notNull(),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).notNull().default('open'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Devices table
export const devices = pgTable('devices', {
  id: serial('id').primaryKey(),
  user_email: varchar('user_email', { length: 255 }).notNull(),
  device_id: varchar('device_id', { length: 255 }).notNull(),
  kind: varchar('kind', { length: 50 }).notNull(), // extension / desktop / android
  label: varchar('label', { length: 255 }),
  created_at: timestamp('created_at').notNull().defaultNow(),
  last_seen_at: timestamp('last_seen_at')
});

// Organizations (TEAM)
export const orgs = pgTable('orgs', {
  id: serial('id').primaryKey(),
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 255 }).notNull(),
  owner_email: varchar('owner_email', { length: 255 }).notNull(),
  tier: varchar('tier', { length: 50 }).notNull().default('free_team'), // free_team / pro_team / enterprise
  cloud_level: varchar('cloud_level', { length: 50 }).notNull().default('off'), // off / basic / full
  status: varchar('status', { length: 50 }).notNull().default('active'), // active / suspended / trial / archived
  trial_ends_at: timestamp('trial_ends_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Organization devices (TEAM members' devices)
export const org_devices = pgTable('org_devices', {
  id: serial('id').primaryKey(),
  org_id: integer('org_id').notNull(),
  device_id: varchar('device_id', { length: 255 }).notNull(),
  kind: varchar('kind', { length: 50 }).notNull(), // desktop / extension / mobile / tablet / edge / apple
  label: varchar('label', { length: 255 }),
  role: varchar('role', { length: 50 }).notNull().default('member'), // member / admin / viewer
  status: varchar('status', { length: 50 }).notNull().default('active'), // active / disabled / pending
  last_seen_at: timestamp('last_seen_at'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Organization keys (TEAM invite/admin keys)
export const org_keys = pgTable('org_keys', {
  id: serial('id').primaryKey(),
  org_id: integer('org_id').notNull(),
  key: varchar('key', { length: 100 }).notNull().unique(),
  role: varchar('role', { length: 50 }).notNull().default('member'), // member / admin / viewer
  usage_limit: integer('usage_limit'),
  used_count: integer('used_count').notNull().default(0),
  expires_at: timestamp('expires_at'),
  status: varchar('status', { length: 50 }).notNull().default('active'), // active / expired / revoked
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Pairing sessions table
export const pairing_sessions = pgTable('pairing_sessions', {
  id: serial('id').primaryKey(),
  short_code: varchar('short_code', { length: 32 }).notNull().unique(),
  initiator_device_id: integer('initiator_device_id').notNull(),
  target_device_id: integer('target_device_id'),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending / linked / expired
  expires_at: timestamp('expires_at').notNull(),
  meta: jsonb('meta'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Email validations
export const email_validations = pgTable('email_validations', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending / confirmed / expired
  reason: varchar('reason', { length: 100 }),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Email domain rules (blacklist / whitelist)
export const email_domain_rules = pgTable('email_domain_rules', {
  id: serial('id').primaryKey(),
  domain: varchar('domain', { length: 255 }).notNull().unique(),
  mode: varchar('mode', { length: 20 }).notNull(), // blacklist / whitelist
  comment: text('comment'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Email change requests
export const email_change_requests = pgTable('email_change_requests', {
  id: serial('id').primaryKey(),
  old_email: varchar('old_email', { length: 255 }).notNull(),
  new_email: varchar('new_email', { length: 255 }).notNull(),
  token: varchar('token', { length: 255 }).notNull().unique(),
  status: varchar('status', { length: 50 }).notNull().default('pending'), // pending / confirmed / canceled / expired
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Admin events log
export const admin_events = pgTable('admin_events', {
  id: serial('id').primaryKey(),
  actor: varchar('actor', { length: 255 }).notNull(),
  section: varchar('section', { length: 50 }).notNull(), // licenses / devices / payments / etc
  action: varchar('action', { length: 50 }).notNull(),
  target_type: varchar('target_type', { length: 50 }).notNull(), // license / device / payment
  target_id: integer('target_id').notNull(),
  meta: jsonb('meta'),
  created_at: timestamp('created_at').notNull().defaultNow(),
});
