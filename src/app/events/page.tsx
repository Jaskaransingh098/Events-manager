"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
};

const fetchEvents = async (): Promise<Event[]> => {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  return res.json();
};

export default function EventsPage() {
  const {
    data = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });

  if (isLoading) return <p className="p-10 text-center">Loading events...</p>;
  if (isError)
    return <p className="p-10 text-center">Failed to load events.</p>;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Events</h1>
        <Link href="/events/create" className="btn-primary">
          + Create Event
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="stat-card">
          <span className="text-sm text-gray-400">Total Events</span>
          <span className="text-2xl font-bold">{data.length}</span>
        </div>
        <div className="stat-card">
          <span className="text-sm text-gray-400">Upcoming</span>
          <span className="text-2xl font-bold">—</span>
        </div>
        <div className="stat-card">
          <span className="text-sm text-gray-400">Ongoing</span>
          <span className="text-2xl font-bold">—</span>
        </div>
        <div className="stat-card">
          <span className="text-sm text-gray-400">Cancelled</span>
          <span className="text-2xl font-bold">—</span>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-gray-400">
            <tr>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((event) => (
              <tr key={event.id} className="border-t border-white/5">
                <td className="p-4 flex items-center gap-3">
                  <img
                    src={event.imageUrl || "/event-placeholder.jpg"}
                    className="w-10 h-10 rounded-md object-cover"
                  />
                  {event.title}
                </td>
                <td className="p-4">
                  {new Date(event.startDate).toLocaleString()}
                </td>
                <td className="p-4">{event.location}</td>
                <td className="p-4 text-right">
                  <Link href={`/events/${event.id}`} className="btn-ghost">
                    View
                  </Link>
                </td>
              </tr>
            ))}
            {isLoading && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-400">
                  Loading…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
