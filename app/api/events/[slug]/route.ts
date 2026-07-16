import { dbConnect, Event } from "@/database";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    await dbConnect();
    const { slug } = await params;
    const getSingleEvent = await Event.findOne({ slug }).lean();
    if (!getSingleEvent) {
      return NextResponse.json({ message: "Event Not Found" }, { status: 400 });
    }

    return NextResponse.json(
      { message: "Event fetch successfully", data: getSingleEvent },
      { status: 201 },
    );
  } catch (e) {
    console.log("Catch Error in event GET", e);
    return NextResponse.json({ message: "Catch Error" }, { status: 500 });
  }
}
