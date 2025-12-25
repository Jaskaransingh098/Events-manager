import { NextResponse } from "next/server";
import {
    getEventById,
    updateEvent,
    deleteEvent,
} from "@/services/event.service";

export async function GET(
    _request: Request,
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

        return NextResponse.json(event);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch event" },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;
        const body = await request.json();

        const updated = await updateEvent(id, body);

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to update event" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    _request: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await deleteEvent(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to delete event" },
            { status: 500 }
        );
    }
}
