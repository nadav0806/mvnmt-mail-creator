"use client";

import { useState } from "react";

type CreateAccountResponse = {
  success: boolean;
  email?: string;
  password?: string;
  displayName?: string;
  error?: string;
};

export default function Home() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<CreateAccountResponse | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResponse(null);
    setCopied(false);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      setError("Please enter both a first and last name.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("https://publish.mvmnt.world/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: trimmedFirstName, lastName: trimmedLastName }),
      });

      const data = (await res.json()) as CreateAccountResponse;

      if (!res.ok || !data.success) {
        throw new Error(data.error ?? "Unable to create account");
      }

      setResponse(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function copyCredentials() {
    if (!response?.success) return;

    const text = [
      `Email: ${response.email ?? ""}`,
      `Password: ${response.password ?? ""}`,
      `Display name: ${response.displayName ?? ""}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.9),_transparent_36%),linear-gradient(180deg,_#fbfbfa_0%,_#f7f7f5_60%,_#f3f4f6_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-3xl items-center justify-center">
        <section className="w-full rounded-[24px] border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,23,42,0.06)]">
          <div className="p-6 sm:p-8">
            <div className="text-center">
              <div className="mx-auto inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Mail account creator
              </div>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
                Create an email account
              </h1>
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                Keep it simple: enter a first and last name, create the account, and copy the result.
              </p>
            </div>

            <form className="mt-8 grid gap-4" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  First name
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Last name
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating account..." : "Create account"}
              </button>
              <p className="text-xs leading-5 text-slate-500">
                Fill in both names, then create the account.
              </p>
            </form>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            <section className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 sm:p-6" aria-live="polite">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Result</div>
                  <p className="mt-1 text-sm text-slate-600">
                    The created account details appear here after a successful request.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={copyCredentials}
                  disabled={!response?.success}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              {response?.success ? (
                <div className="mt-5 grid gap-4 rounded-2xl bg-white p-5 shadow-sm">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Email</div>
                    <div className="mt-1 break-all text-sm font-medium text-slate-950">{response.email}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Password</div>
                    <div className="mt-1 break-all text-sm font-medium text-slate-950">{response.password}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Display name</div>
                    <div className="mt-1 text-sm font-medium text-slate-950">{response.displayName}</div>
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-white p-5 text-sm leading-6 text-slate-500">
                  No account created yet.
                </div>
              )}
            </section>
          </div>
        </section>
      </div>
    </main>
  );
}
