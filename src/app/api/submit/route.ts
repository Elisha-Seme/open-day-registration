import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const timestamp = new Date().toISOString();
        const submission = { ...data, timestamp, id: Math.random().toString(36).substr(2, 9) };

        // Fetch existing submissions
        let submissions: any[] = await redis.get('submissions') || [];

        submissions.push(submission);

        // Save back to Redis
        await redis.set('submissions', submissions);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Submission error:", error);
        return NextResponse.json({
            success: false,
            error: "Internal Server Error",
            message: error.message
        }, { status: 500 });
    }
}
