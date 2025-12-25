import { NextResponse } from "next/server";
import { eventSchema } from "@/lib/validators";
import { createEvent, getAllEvents } from "@/services/event.service";


export async function GET() {
    try {
        const events = await getAllEvents();
        return NextResponse.json(events, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { message: "Failed to fetch events" },
            { status: 500 }
        );
    }
}


export async function POST(req: Request) {
    try {
        const body = await req.json();

        const validatedData = eventSchema.parse(body);

        const event = await createEvent(validatedData);

        return NextResponse.json(event, { status: 201 });
    }  catch (error) {
        console.error("GET /api/events error:", error);
        return NextResponse.json(
            { message: String(error) },
            { status: 500 }
        );
    }

}
