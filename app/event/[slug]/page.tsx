import Image from "next/image";
import { notFound } from "next/navigation";
import { json } from "stream/consumers";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const EventDetailsItem = ({
  icon,
  alt,
  label,
}: {
  icon: string;
  alt: string;
  label: string;
}) => (
  <div className="flex-row-gap-2 items-center">
    <Image src={icon} alt={alt} width={17} height={17} />
    <p>{label}</p>
  </div>
);

const AgendaDetails = ({ agendas }: { agendas: string[] }) => (
  <div className="agenda">
    <h2>Agenda</h2>
    <ul>
      {agendas.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  </div>
);

const normalizeTags = (raw: unknown): string[] =>
  (Array.isArray(raw) ? raw : [raw])
    .flatMap((t) => String(t).replace(/[\[\]'"]/g, "").split(","))
    .map((t) => t.trim())
    .filter(Boolean);

const EventTags = ({ tags }: { tags: string[] }) => (
  <div className="flex flex-row gap-1.5 flex-wrap">
    {tags.map((tag, index) => (
      <div className="pill" key={index}>
        {tag}
      </div>
    ))}
  </div>
);

const eventDetails = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const eventData = await fetch(`${BASE_URL}/api/events/${slug}`);
  const singleEvent = await eventData.json();
  const {
    slug: SLUG,
    title,
    description,
    overview,
    image,
    location,
    vanue,
    date,
    time,
    mode,
    audience,
    agenda,
    organizer,
    tags,
  } = singleEvent.data;

  if (!SLUG) return notFound();

  return (
    <section id="event">
      <div className="header">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="details">
        <div className="content">
          <Image
            src={image}
            alt="event banner"
            width={800}
            height={800}
            className="banner"
          ></Image>

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>
          <section className="flex-col-gap-2">
            <EventDetailsItem
              icon="/icons/calendar.svg"
              alt="calendar"
              label={date}
            />
            <EventDetailsItem
              icon="/icons/clock.svg"
              alt="clock"
              label={time}
            />
            <EventDetailsItem
              icon="/icons/pin.svg"
              alt="pin"
              label={`${vanue}, ${location}`}
            />
            <EventDetailsItem icon="/icons/mode.svg" alt="mode" label={mode} />
            <EventDetailsItem
              icon="/icons/audience.svg"
              alt="audience"
              label={audience}
            />
          </section>

          <AgendaDetails agendas={agenda} />

          <section className="flex-col-gap-2">
            <p>About Organizer</p>
            <p>{organizer}</p>
          </section>

          <EventTags tags={normalizeTags(tags)} />
        </div>

        <aside className="booking">
          <p className="text-lg font-semibold">Book Event</p>
        </aside>
      </div>
    </section>
  );
};

export default eventDetails;
