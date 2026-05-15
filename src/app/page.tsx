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
  const [firstName, setFirstName] = useState("Noah");
  const [lastName, setLastName] = useState("Levine");
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

    try {
      const res = await fetch("/api/create-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName }),
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
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.18),_transparent_35%),linear-gradient(180deg,_#f8fbff_0%,_#ffffff_45%,_#f5f7fb_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="border-b border-slate-200/80 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
                MVMNT Mail Creator
              </div>
              <h1 className="mt-5 max-w-xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Spin up mailbox credentials in one request.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Enter a first and last name, then this app posts to your account creation service and shows the
                generated email, password, and display name.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Vercel-ready", "No custom server needed"],
                  ["Proxy route", "Endpoint stays behind /api"],
                  ["Fast handoff", "Copy credentials in one click"],
                ].map(([title, copy]) => (
                  <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-sm font-semibold text-slate-900">{title}</div>
                    <div className="mt-1 text-sm text-slate-600">{copy}</div>
                  </div>
                ))}
              </div>
            </div>

            <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  First name
                  <input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    placeholder="Noah"
                    required
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Last name
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
                    placeholder="Levine"
                    required
                  />
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Creating account..." : "Create email account"}
                </button>

                <p className="text-xs leading-5 text-slate-500">
                  The frontend calls <code className="rounded bg-slate-100 px-1 py-0.5">/api/create-account</code>,
                  which proxies to the upstream service.
                </p>
              </div>
            </form>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-[0_20px_70px_rgba(15,23,42,0.06)] sm:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Result</h2>
                <p className="mt-1 text-sm text-slate-500">
                  A successful response will show the created account details here.
                </p>
              </div>
              <button
                type="button"
                onClick={copyCredentials}
                disabled={!response?.success}
                className="rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {copied ? "Copied" : "Copy credentials"}
              </button>
            </div>

            {error ? (
              <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {error}
              </div>
            ) : null}

            {response?.success ? (
              <div className="mt-6 grid gap-4 rounded-3xl border border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Email</div>
                  <div className="mt-1 font-medium">{response.email}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Password</div>
                  <div className="mt-1 font-medium break-all">{response.password}</div>
                </div>
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Display name</div>
                  <div className="mt-1 font-medium">{response.displayName}</div>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm leading-7 text-slate-600">
                Submit the form to create the account and see the returned credentials.
              </div>
            )}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-slate-950 p-6 text-slate-50 shadow-[0_20px_70px_rgba(15,23,42,0.18)] sm:p-8">
            <h2 className="text-xl font-semibold">Endpoint contract</h2>
            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-sm leading-7 text-slate-200">
              <div className="font-semibold text-white">POST https://publish.mvmnt.world/create-account</div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-300">{`{
  "firstName": "noah",
  "lastName": "levine"
}`}</pre>
            </div>

            <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-semibold text-white">Success shape</div>
              <pre className="mt-3 overflow-x-auto rounded-2xl bg-slate-900 p-4 text-xs text-slate-300">{`{
  "success": true,
  "email": "noah.levine@themailman.info",
  "password": "C7wsQHlKL^7L",
  "displayName": "noah levine"
}`}</pre>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
