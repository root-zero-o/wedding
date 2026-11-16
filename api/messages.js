import { Redis } from "@upstash/redis";
import { randomUUID, timingSafeEqual } from "node:crypto";

const KEY = "guestbook";
const MAX_NAME = 20;
const MAX_MSG = 160;
const MAX_ENTRIES = 500;

const redis = new Redis({
  url: process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN,
});

const json = (body, status = 200) => Response.json(body, { status });

const isAdmin = (request) => {
  const expected = process.env.ADMIN_KEY;
  const given = request.headers.get("x-admin-key");
  if (!expected || !given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
};

const cleanText = (value, max) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";

const serverError = (label, err) => {
  console.error(`guestbook ${label} failed`, err);
  return json({ error: "server_error" }, 500);
};

export async function GET(request) {
  try {
    const all = (await redis.hgetall(KEY)) ?? {};
    const entries = Object.values(all).sort((a, b) => a.ts - b.ts);
    return json({ entries, isAdmin: isAdmin(request) });
  } catch (err) {
    return serverError("list", err);
  }
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }
  const name = cleanText(body?.name, MAX_NAME);
  const msg = cleanText(body?.msg, MAX_MSG);
  if (!name || !msg) return json({ error: "invalid_input" }, 400);

  try {
    if ((await redis.hlen(KEY)) >= MAX_ENTRIES)
      return json({ error: "full" }, 409);
    const entry = { id: randomUUID(), name, msg, ts: Date.now() };
    await redis.hset(KEY, { [entry.id]: entry });
    return json({ entry }, 201);
  } catch (err) {
    return serverError("create", err);
  }
}

export async function DELETE(request) {
  if (!isAdmin(request)) return json({ error: "forbidden" }, 403);
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return json({ error: "missing_id" }, 400);
  try {
    const removed = await redis.hdel(KEY, id);
    return json({ removed });
  } catch (err) {
    return serverError("delete", err);
  }
}
