import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalPath: text("original_path").notNull(),
  processedPath: text("processed_path"),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  width: integer("width"),
  height: integer("height"),
  enhancements: jsonb("enhancements").default({}),
  createdAt: timestamp("created_at").defaultNow(),
});

export const processingJobs = pgTable("processing_jobs", {
  id: serial("id").primaryKey(),
  imageId: integer("image_id").references(() => images.id),
  jobType: text("job_type").notNull(), // 'enhance', 'background_removal', 'upscale', etc.
  status: text("status").notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  parameters: jsonb("parameters").default({}),
  result: jsonb("result"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertImageSchema = createInsertSchema(images).pick({
  filename: true,
  originalPath: true,
  mimeType: true,
  size: true,
  width: true,
  height: true,
});

export const insertProcessingJobSchema = createInsertSchema(processingJobs).pick({
  imageId: true,
  jobType: true,
  parameters: true,
});

export const imageEnhancementSchema = z.object({
  brightness: z.number().min(-100).max(100).default(0),
  contrast: z.number().min(-100).max(100).default(0),
  saturation: z.number().min(-100).max(100).default(0),
  exposure: z.number().min(-100).max(100).default(0),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type Image = typeof images.$inferSelect;
export type InsertProcessingJob = z.infer<typeof insertProcessingJobSchema>;
export type ProcessingJob = typeof processingJobs.$inferSelect;
export type ImageEnhancement = z.infer<typeof imageEnhancementSchema>;
