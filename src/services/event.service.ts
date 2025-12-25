import { db } from "@/lib/db";
import { events } from "@/db/schema";
import { EventInput } from "@/lib/validators";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";


export const createEvent = async (data: EventInput) => {
    const id = randomUUID();

    await db.insert(events).values({
        id,
        title: data.title,
        description: data.description,
        location: data.location,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        imageUrl: data.imageUrl,
    });

    return { id };
};


export const getAllEvents = async () => {
    return db.select().from(events);
};


export const getEventById = async (id: string) => {
    const result = await db
        .select()
        .from(events)
        .where(eq(events.id, id));

    return result[0] ?? null;
};


export const updateEvent = async (id: string, data: EventInput) => {
    await db
        .update(events)
        .set({
            title: data.title,
            description: data.description,
            location: data.location,
            startDate: new Date(data.startDate),
            endDate: new Date(data.endDate),
            imageUrl: data.imageUrl,
        })
        .where(eq(events.id, id));

    return { id };
};


export const deleteEvent = async (id: string) => {
    await db.delete(events).where(eq(events.id, id));
    return { id };
};



export async function saveNftMintAddress(
    eventId: string,
    mintAddress: string
) {
    await db
        .update(events)
        .set({ nftMintAddress: mintAddress })
        .where(eq(events.id, eventId));
}
