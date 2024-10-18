import { pgTable, text, uuid, timestamp, doublePrecision, pgEnum, jsonb } from "drizzle-orm/pg-core";

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

export const nodeType = pgEnum("node_type", [
  "coworking",
  "meetup",
  "hackathon",
  "incubator/accelerator",
  "other"
]);

export const communities = pgTable("communities", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  link: text("link"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});

export const nodes = pgTable("nodes", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  name: text("name").notNull(),
  description: text("description"),
  location: text("location").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  node_type: nodeType("node_type").notNull(),
  links: jsonb("links").notNull(),
  connection: uuid("connection").references(() => communities.id),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  deleted_at: timestamp("deleted_at"),
});
