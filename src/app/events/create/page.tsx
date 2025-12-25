"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import "./globals.css";

type EventInput = {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  imageUrl?: string;
};

export default function CreateEventPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [form, setForm] = useState<EventInput>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    imageUrl: "",
  });

  const mutation = useMutation({
    mutationFn: async (data: EventInput) => {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["events"] });
      router.push("/events");
    },
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  return (
    <div className="min-h-screen bg-black px-6 py-10">
      <div className="max-w-5xl mx-auto bg-white border rounded-xl">
        {/* Section Header */}
        <div className="border-b px-6 py-4">
          <h1 className="text-lg font-semibold">
            Create Event – Detail Information
          </h1>
        </div>

        {/* Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            mutation.mutate(form);
          }}
          className="px-6 py-6 space-y-6"
        >
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Field label="Event Title *">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>

            <Field label="Location *">
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>

            <Field label="Image URL">
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                className="input"
              />
            </Field>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field label="Start Date & Time *">
              <input
                type="datetime-local"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>

            <Field label="End Date & Time *">
              <input
                type="datetime-local"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                required
                className="input"
              />
            </Field>
          </div>

          {/* Row 3 */}
          <Field label="Description *">
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className="input resize-none"
            />
          </Field>

          {/* Error */}
          {mutation.isError && (
            <p className="text-sm text-red-600">Failed to create event</p>
          )}

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => router.push("/events")}
              className="px-4 py-2 text-sm border rounded hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={mutation.isPending}
              className="px-6 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isPending ? "Saving..." : "Add Event"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ---------- Small reusable field ---------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
