import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validators";
import {
    getEventById,
    updateEvent,
    deleteEvent,
} from "@/services/event.service";

/* ---------- GET: Single Event ---------- */
export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        const event = await getEventById(id);

        if (!event) {
            return NextResponse.json(
                { message: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(event, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch event" },
            { status: 500 }
        );
    }
}

/* ---------- PUT: Update Event ---------- */
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await req.json();
        const validatedData = eventSchema.parse(body);

        await updateEvent(id, validatedData);

        return NextResponse.json(
            { message: "Event updated successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Invalid request data" },
            { status: 400 }
        );
    }
}

/* ---------- DELETE: Delete Event ---------- */
export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await deleteEvent(id);

        return NextResponse.json(
            { message: "Event deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete event" },
            { status: 500 }
        );
    }
}
