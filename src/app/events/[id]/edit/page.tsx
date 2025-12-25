"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type EventInput = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
};

const fetchEvent = async (id: string): Promise<EventInput> => {
  const res = await fetch(`/api/events/${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  return res.json();
};

export default function EditEventPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => fetchEvent(id),
  });

  const [form, setForm] = useState<EventInput | null>(null);

  useEffect(() => {
    if (data) {
      setForm({
        ...data,
        startDate: data.startDate.slice(0, 16),
        endDate: data.endDate.slice(0, 16),
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (updated: EventInput) => {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      if (!res.ok) throw new Error("Failed to update event");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["event", id] });
      router.push(`/events/${id}`);
    },
  });

  if (isLoading || !form)
    return <p className="p-10 text-center">Loading event…</p>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-[#0b0f16] p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Edit Event</h1>

          <button
            onClick={() => router.push(`/events/${id}`)}
            className="btn-ghost"
          >
            ← Back to Event
          </button>
        </div>

        {/* Card */}
        <div className="card p-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate(form);
            }}
            className="space-y-8"
          >
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Field label="Event Title *">
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="input-dark"
                />
              </Field>

              <Field label="Location *">
                <input
                  name="location"
                  value={form.location}
                  onChange={handleChange}
                  required
                  className="input-dark"
                />
              </Field>

              <Field label="Image URL">
                <input
                  name="imageUrl"
                  value={form.imageUrl || ""}
                  onChange={handleChange}
                  className="input-dark"
                />
              </Field>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Start Date & Time *">
                <input
                  type="datetime-local"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  required
                  className="input-dark"
                />
              </Field>

              <Field label="End Date & Time *">
                <input
                  type="datetime-local"
                  name="endDate"
                  value={form.endDate}
                  onChange={handleChange}
                  required
                  className="input-dark"
                />
              </Field>
            </div>

            {/* Description */}
            <Field label="Description *">
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                required
                className="input-dark resize-none"
              />
            </Field>

            {/* Error */}
            {mutation.isError && (
              <p className="text-sm text-red-400">Failed to update event</p>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t border-white/10">
              <button
                type="button"
                onClick={() => router.push(`/events/${id}`)}
                className="btn-ghost"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="btn-primary"
              >
                {mutation.isPending ? "Updating…" : "Update Event"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ---------- Field Wrapper ---------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
