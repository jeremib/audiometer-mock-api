import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull().default("certified_tester"),
});

export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry").notNull(),
  active: boolean("active").notNull().default(true),
});

export const groups = pgTable("groups", {
  id: varchar("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull(),
  name: text("name").notNull(),
  description: text("description"),
  employeeCount: integer("employee_count").notNull().default(0),
  riskLevel: text("risk_level").notNull().default("low"),
});

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull(),
  groupId: varchar("group_id").notNull(),
  employeeId: varchar("employee_id").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  department: text("department").notNull(),
  lastTestDate: text("last_test_date"),
});

export const testPaths = pgTable("test_paths", {
  id: varchar("id").primaryKey(),
  profileId: varchar("profile_id").notNull(),
  steps: jsonb("steps").notNull(), // Array of test steps
});

export const hearingTests = pgTable("hearing_tests", {
  id: varchar("id").primaryKey(),
  tenantId: varchar("tenant_id").notNull(),
  profileId: varchar("profile_id").notNull(),
  testDate: timestamp("test_date").notNull(),
  testerId: varchar("tester_id").notNull(),
  deviceId: varchar("device_id").notNull(),
  testType: text("test_type").notNull().default("audiometry"),
  results: jsonb("results").notNull(),
  nextTestDue: text("next_test_due"),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertTenantSchema = createInsertSchema(tenants);

export const insertGroupSchema = createInsertSchema(groups);

export const insertProfileSchema = createInsertSchema(profiles);

export const insertTestPathSchema = createInsertSchema(testPaths);

export const insertHearingTestSchema = createInsertSchema(hearingTests).omit({
  id: true,
});

// Login schema
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Test submission schema
export const testSubmissionSchema = z.object({
  test_metadata: z.object({
    test_date: z.string(),
    tester_id: z.string(),
    device_id: z.string(),
    test_type: z.string().default("audiometry"),
  }),
  results: z.array(z.object({
    step: z.number(),
    frequency_hz: z.number(),
    decibel_db: z.number(),
    ear: z.enum(["left", "right", "both"]),
    response: z.enum(["heard", "not_heard"]),
  })),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tenant = typeof tenants.$inferSelect;
export type InsertTenant = z.infer<typeof insertTenantSchema>;

export type Group = typeof groups.$inferSelect;
export type InsertGroup = z.infer<typeof insertGroupSchema>;

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;

export type TestPath = typeof testPaths.$inferSelect;
export type InsertTestPath = z.infer<typeof insertTestPathSchema>;

export type HearingTest = typeof hearingTests.$inferSelect;
export type InsertHearingTest = z.infer<typeof insertHearingTestSchema>;

export type LoginRequest = z.infer<typeof loginSchema>;
export type TestSubmission = z.infer<typeof testSubmissionSchema>;
