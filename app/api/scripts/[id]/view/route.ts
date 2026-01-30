import { list } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { ownerKey } = body;

    if (!ownerKey) {
      return NextResponse.json(
        { error: "Owner key is required" },
        { status: 400 }
      );
    }

    // Find the data file
    const { blobs } = await list({
      prefix: `scripts/${id}/`,
    });

    const dataBlob = blobs.find((b) => b.pathname.includes("data.json"));

    if (!dataBlob) {
      return NextResponse.json({ error: "Script not found" }, { status: 404 });
    }

    // Fetch and parse data
    const dataResponse = await fetch(dataBlob.url);
    const data = await dataResponse.json();

    // Verify the owner key matches
    if (data.ownerKey !== ownerKey) {
      return NextResponse.json({ error: "Invalid owner key" }, { status: 403 });
    }

    // Decode and return the script
    const script = Buffer.from(data.script, "base64").toString("utf-8");

    return NextResponse.json({
      success: true,
      script: script,
      filename: data.filename,
      createdAt: data.createdAt,
    });
  } catch (error) {
    console.error("View error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve script" },
      { status: 500 }
    );
  }
}
