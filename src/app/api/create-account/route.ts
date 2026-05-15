import { NextResponse } from "next/server";

const UPSTREAM_URL = "https://publish.mvmnt.world/create-account";

type UpstreamResponse = {
  success?: boolean;
  email?: string;
  password?: string;
  displayName?: string;
  error?: string;
};

function normalizeName(value: unknown) {
  return String(value ?? "").trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      firstName?: unknown;
      lastName?: unknown;
    };

    const firstName = normalizeName(body.firstName);
    const lastName = normalizeName(body.lastName);

    if (!firstName || !lastName) {
      return NextResponse.json(
        { success: false, error: "firstName and lastName are required" },
        { status: 400 }
      );
    }

    const upstreamResponse = await fetch(UPSTREAM_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ firstName, lastName }),
    });

    const data = (await upstreamResponse.json()) as UpstreamResponse;

    return NextResponse.json(data, {
      status: upstreamResponse.status,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Unable to create account right now" },
      { status: 500 }
    );
  }
}
