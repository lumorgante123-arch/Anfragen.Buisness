"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

export function RequestForm({ slug }: { slug: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ id: string } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      slug,
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      address: formData.get("address"),
      category: formData.get("category"),
      description: formData.get("description"),
      urgency: formData.get("urgency") || "NORMAL",
      website: formData.get("website"),
    };

    try {
      const res = await fetch("/api/public/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Anfrage konnte nicht gesendet werden.");
        return;
      }
      setResult({ id: data.id });
      form.reset();
    } catch {
      setError("Anfrage konnte nicht gesendet werden. Bitte versuche es erneut.");
    } finally {
      setPending(false);
    }
  }

  if (result) {
    return (
      <div className="mt-6 rounded-md bg-green-50 p-4 text-sm text-green-800">
        <p className="font-medium">Danke für deine Anfrage!</p>
        <p className="mt-1">
          Wir haben dir eine Bestätigung per E-Mail geschickt und melden uns
          in Kürze.
        </p>
        <Link
          href={`/status/${result.id}`}
          className="mt-3 inline-block font-medium text-green-900 underline"
        >
          Status deiner Anfrage verfolgen
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      {/* Honeypot-Feld, für Menschen unsichtbar */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div>
        <label className="block text-sm font-medium text-zinc-700">Name</label>
        <input
          name="customerName"
          required
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            E-Mail
          </label>
          <input
            type="email"
            name="customerEmail"
            required
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Telefon (optional)
          </label>
          <input
            name="customerPhone"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Adresse (optional)
        </label>
        <input
          name="address"
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Kategorie
          </label>
          <select
            name="category"
            required
            defaultValue=""
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="" disabled>
              Bitte wählen
            </option>
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Dringlichkeit
          </label>
          <select
            name="urgency"
            defaultValue="NORMAL"
            className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="NORMAL">Normal</option>
            <option value="DRINGEND">Dringend</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Beschreibe dein Anliegen
        </label>
        <textarea
          name="description"
          required
          minLength={10}
          rows={4}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60"
      >
        {pending ? "Wird gesendet…" : "Anfrage senden"}
      </button>
    </form>
  );
}
