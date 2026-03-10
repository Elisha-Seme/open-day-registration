import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

export async function DELETE() {
    try {
        // Overwrite the submissions array with an empty array
        await redis.set('submissions', []);

        return NextResponse.json({ success: true, message: "Database cleared successfully." });
    } catch (error: any) {
        console.error("Clear database error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
