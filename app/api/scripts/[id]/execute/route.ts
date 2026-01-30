import { list } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Find the data file
    const { blobs } = await list({
      prefix: `scripts/${id}/`,
    });

    const dataBlob = blobs.find((b) => b.pathname.includes("data.json"));

    if (!dataBlob) {
      return new NextResponse("-- Script not found", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    // Fetch and parse data
    const dataResponse = await fetch(dataBlob.url);
    const data = await dataResponse.json();

    // Decode the script from base64
    const script = Buffer.from(data.script, "base64").toString("utf-8");

    // Return raw Lua script - this is what loadstring will execute
    return new NextResponse(script, {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("Execute error:", error);
    return new NextResponse("-- Error loading script", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
