import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src/data");
const DATA_PATH = path.join(DATA_DIR, "submissions.json");

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const timestamp = new Date().toISOString();
        const submission = { ...data, timestamp, id: Math.random().toString(36).substr(2, 9) };

        // Ensure directory exists
        if (!fs.existsSync(DATA_DIR)) {
            fs.mkdirSync(DATA_DIR, { recursive: true });
        }

        let submissions = [];
        try {
            const fileContent = fs.readFileSync(DATA_PATH, "utf-8");
            submissions = JSON.parse(fileContent);
        } catch (readError: any) {
            // Ignore error if file doesn't exist, else rethrow
            if (readError.code !== 'ENOENT') throw readError;
        }

        submissions.push(submission);

        fs.writeFileSync(DATA_PATH, JSON.stringify(submissions, null, 2));

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
