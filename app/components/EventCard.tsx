import Image from "next/image";
import Link from "next/link";

interface eventCard {
  image: string;
  title: string;
  date: string;
  time: string;
  location: string;
  slug: string;
}

function EventCard({ image, title, date, time, location, slug }: eventCard) {
  return (
    <Link href={`/event/${slug}`} id="event-card">
      <Image
        src={image}
        alt={title}
        width={410}
        height={300}
        className="poster"
      />
      <p className="title">{title}</p>
      <div className="datetime">
        <Image
          src="/icons/calendar.svg"
          alt="calendar"
          width={15}
          height={15}
        />
        <p>{date}</p>
        <Image src="/icons/clock.svg" alt="clock" width={15} height={15} />
        <p>{time}</p>
      </div>
      <div className="flex flex-raw gap-2">
      <Image src="/icons/pin.svg" alt="location" width={15} height={15} />
      <p>{location}</p>
      </div>
    </Link>
  );
}

export default EventCard;
