import { put } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";

const DISCORD_WEBHOOK_URL =
  "https://discord.com/api/webhooks/1466829370516701227/G0ceRlzA000IXuIMTexToIqzbU_CxWMSXkkbN9YzhJD4i1oSdLPiY3Oh3hqq1ZJZIP3_";

// Send notification to Discord with enhanced embed
async function sendDiscordNotification(
  scriptId: string,
  ownerKey: string,
  filename: string,
  scriptLength: number
) {
  try {
    const embed = {
      title: "New Script Hosted",
      description: "A new script has been uploaded to ScriptHost",
      color: 0x00ff9d,
      thumbnail: {
        url: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
      },
      fields: [
        {
          name: "Script ID",
          value: `\`\`\`${scriptId}\`\`\``,
          inline: false,
        },
        {
          name: "Owner Key",
          value: `\`\`\`${ownerKey}\`\`\``,
          inline: false,
        },
        {
          name: "Filename",
          value: `\`${filename}\``,
          inline: true,
        },
        {
          name: "Size",
          value: `\`${scriptLength} chars\``,
          inline: true,
        },
      ],
      footer: {
        text: "ScriptHost | Secure Script Hosting",
        icon_url: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
      },
      timestamp: new Date().toISOString(),
    };

    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: "ScriptHost",
        avatar_url: "https://cdn-icons-png.flaticon.com/512/2920/2920277.png",
        embeds: [embed],
      }),
    });
  } catch (error) {
    console.error("Discord webhook error:", error);
  }
}

// Generate a secure owner key
function generateOwnerKey(): string {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for (let i = 0; i < 32; i++) {
    key += chars[Math.floor(Math.random() * chars.length)];
  }
  return key;
}

export async function POST(request: NextRequest) {
  try {
    let scriptContent: string;
    let filename: string;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      scriptContent = body.script;
      filename = body.filename || "script.lua";

      if (!scriptContent) {
        return NextResponse.json(
          { error: "No script content provided" },
          { status: 400 }
        );
      }
    } else {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      const text = formData.get("script") as string | null;
      const formFilename = formData.get("filename") as string | null;

      if (file && file.size > 0) {
        scriptContent = await file.text();
        filename = file.name;
      } else if (text) {
        scriptContent = text;
        filename = formFilename || "script.lua";
      } else {
        return NextResponse.json(
          { error: "No script content provided" },
          { status: 400 }
        );
      }
    }

    // Generate unique ID and owner key
    const scriptId = nanoid(12);
    const ownerKey = generateOwnerKey();

    // Store the raw script as base64 (simple encoding, not encryption)
    // The security comes from the ownerKey being required to view
    const encodedScript = Buffer.from(scriptContent, "utf-8").toString("base64");

    // Store metadata
    const metadata = {
      script: encodedScript,
      ownerKey: ownerKey,
      filename: filename,
      createdAt: new Date().toISOString(),
    };

    // Upload metadata to blob storage
    await put(`scripts/${scriptId}/data.json`, JSON.stringify(metadata), {
      access: "public",
      contentType: "application/json",
    });

    // Send Discord notification (don't await to speed up response)
    sendDiscordNotification(scriptId, ownerKey, filename, scriptContent.length);

    // Get the base URL for the API
    const baseUrl = request.nextUrl.origin;
    const executeUrl = `${baseUrl}/api/scripts/${scriptId}/execute`;

    return NextResponse.json({
      success: true,
      id: scriptId,
      ownerKey: ownerKey,
      filename: filename,
      loadstring: `loadstring(game:HttpGet("${executeUrl}"))()`,
      executeUrl: executeUrl,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload script" },
      { status: 500 }
    );
  }
}
