import { v2 as cloudinary } from "cloudinary";
import { dbConnect, Event } from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();
    let event;

    try {
      event = Object.fromEntries(formData.entries());
    } catch (e) {
      console.log("Catch Error in Events POST formData:", e);
      return NextResponse.json(
        {
          message: "Error in uploaded data",
          error: e instanceof Error ? e.message : "Unknown Error",
        },
        { status: 400 },
      );
    }

    if (typeof event.tags === "string") {
      event.tags = event.tags
        .replace(/[\[\]'"]/g, "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const file = formData.get("image") as File;
    if (!file)
      return NextResponse.json(
        { message: "Image file is required" },
        { status: 400 },
      );

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const uploadImage = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { resource_type: "image", folder: "DevEvents" },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          },
        )
        .end(buffer);
    });

    event.image = (uploadImage as { secure_url: string }).secure_url;
    const addEvent = await Event.create(event);
    return NextResponse.json(
      { message: "Event Added Successfully", data: addEvent },
      { status: 201 },
    );
  } catch (e) {
    console.log("Catch Error in Events POST:", e);
    return NextResponse.json(
      {
        message: "Error while adding the Event",
        error: e instanceof Error ? e.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const getEvents = await Event.find().sort({createdAt: -1});
    if (!getEvents) {
      return NextResponse.json(
        { message: "No Events Scheduled" },
        { status: 200 },
      );
    }
    return NextResponse.json(
      {
        message: "Events fetched successfully",
        data: getEvents,
      },
      { status: 201 }
    );
  } catch (e) {
    console.log("Catch Error in GET Event", e);
    return NextResponse.json(
      {
        message: "Error in GET event function",
        error: e instanceof Error ? e.message : "Unknown Error",
      },
      { status: 500 },
    );
  }
}
