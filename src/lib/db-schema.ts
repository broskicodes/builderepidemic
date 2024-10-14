import { pgTable, text, uuid, timestamp } from "drizzle-orm/pg-core";

export const blogposts = pgTable("blogposts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  description: text("description"),
  author: text("author").notNull(),
  slug: text("slug").notNull().unique(),
  image_url: text("image_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});

export const subscribers = pgTable("subscribers", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  email: text("email").notNull().unique(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});
