import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db"

export async function GET() {
  try {
    const db = await getDatabase()
    
    // Get all emails
    const emails = await db
      .collection("emails")
      .find({})
      .sort({ subscribed_at: -1 })
      .toArray()

    // Convert to CSV format
    const csvHeader = "Email,Subscribed At,Source\n"
    const csvRows = emails.map((email) => {
      const date = new Date(email.subscribed_at).toISOString()
      return `${email.email},${date},${email.source || "website"}`
    })
    const csv = csvHeader + csvRows.join("\n")

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="email-subscribers-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Error exporting emails:", error)
    return NextResponse.json(
      { error: "Failed to export emails" },
      { status: 500 }
    )
  }
}

