import Image from "next/image";
import ExploreBtn from "./components/ExploreBtn";
import EventCard from "./components/EventCard";

const page = () => {
  const eventsData = [
    {
      id: 1,
      title: "EVENT 1",
      slug: "EVENT_1",
      image: "/images/event1.png",
      date:"02-07-2026",
      time:"22:58",
      location: "Ahmedabad"
    },
    {
      id: 2,
      title: "EVENT 2",
      slug: "EVENT_2",
      image: "/images/event2.png",
      date:"02-07-2026",
      time:"22:58",
      location: "Ahmedabad"
    },
    {
      id: 3,
      title: "EVENT 3",
      slug: "EVENT_3",
      image: "/images/event3.png",
      date:"02-07-2026",
      time:"22:58",
      location: "Ahmedabad"
    },
    {
      id: 4,
      title: "EVENT 4",
      slug: "EVENT_4",
      image: "/images/event4.png",
      date:"02-07-2026",
      time:"22:58",
      location: "Ahmedabad"
    },
    {
      id: 5,
      title: "EVENT 5",
      slug: "EVENT_5",
      image: "/images/event5.png",
      date:"02-07-2026",
      time:"22:58",
      location: "Ahmedabad"
    },
    {
      id: 6,
      title: "EVENT 6",
      slug: "EVENT_6",
      image: "/images/event6.png",
      date:"02-07-2026",
      time:"22:58",
      location: "Ahmedabad"
    },
  ];
  return (
    <>
      <h1 className="text-center">
        The Hub For Every Dev <br /> Even You Can't Miss
      </h1>

      <ExploreBtn />

      <div className="mt-20 space-y-7">
        <h3>Featured Events</h3>
      <ul className="events">
        {eventsData.map((event) => (
          <ul key={event.id}>
            <EventCard 
            image={event.image}
            title={event.title}
            date={event.date}
            time={event.time}
            location={event.location}
            slug={event.slug}
            />
            </ul>
        ))}
      </ul>
      </div>
    </>
  );
};

export default page;
