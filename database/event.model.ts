import {
  Schema,
  model,
  models,
  type Model,
  type InferSchemaType,
  type HydratedDocument,
} from "mongoose";

export const EVENT_MODES = ["online", "offline", "hybrid"] as const;
export type EventMode = (typeof EVENT_MODES)[number];

function slugify(input: string): string {
  return input
    .toString()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeDate(value: string): string {
  const trimmed = value.trim();
  const pad = (n: number) => n.toString().padStart(2, "0");

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, y, m, d] = isoMatch;
    const check = new Date(`${y}-${m}-${d}T00:00:00Z`);
    if (
      Number.isNaN(check.getTime()) ||
      check.getUTCMonth() + 1 !== Number(m) ||
      check.getUTCDate() !== Number(d)
    ) {
      throw new Error(`Invalid event date: "${value}"`);
    }
    return `${y}-${m}-${d}`;
  }

  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Invalid event date: "${value}"`);
  }
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(
    parsed.getDate()
  )}`;
}

function normalizeTime(value: string): string {
  const raw = value.trim();
  const match = raw.match(/^(\d{1,2})(?::(\d{2}))?\s*([ap]\.?m\.?)?$/i);
  if (!match) {
    throw new Error(`Invalid event time: "${value}"`);
  }

  let hours = Number(match[1]);
  const minutes = match[2] ? Number(match[2]) : 0;
  const meridiem = match[3]?.toLowerCase().replace(/\./g, "");

  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;

  if (hours > 23 || minutes > 59) {
    throw new Error(`Invalid event time: "${value}"`);
  }

  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}`;
}

const eventSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true },
    overview: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    vanue: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    mode: { type: String, enum: EVENT_MODES, required: true },
    audience: { type: String, required: true },
    agenda: { type: [String], default: [] },
    organizer: { type: String, required: true },
    tags: { type: [String], required: true },
  },
  { timestamps: true }
);

eventSchema.pre("save", function (this: HydratedDocument<Event>) {
  if (this.isModified("title") || !this.slug) {
    this.slug = slugify(this.title);
  }
  if (this.isModified("date")) {
    this.date = normalizeDate(this.date);
  }
  if (this.isModified("time")) {
    this.time = normalizeTime(this.time);
  }
});

export type Event = InferSchemaType<typeof eventSchema>;

const Event: Model<Event> =
  (models.Event as Model<Event>) || model<Event>("Event", eventSchema);

export default Event;
