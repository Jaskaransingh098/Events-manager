import {
    mysqlTable,
    varchar,
    text,
    timestamp,
} from "drizzle-orm/mysql-core";

export const events = mysqlTable("events", {
    id: varchar("id", { length: 36 }).primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    nftMintAddress: varchar("nft_mint_address", { length: 44 }),
    location: varchar("location", { length: 255 }).notNull(),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    imageUrl: varchar("image_url", { length: 500 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});
