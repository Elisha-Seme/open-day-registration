import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/submissions.json");

export async function POST(req: Request) {
    try {
        const data = await req.json();
        const timestamp = new Date().toISOString();
        const submission = { ...data, timestamp, id: Math.random().toString(36).substr(2, 9) };

        const fileContent = await fs.readFile(DATA_PATH, "utf-8");
        const submissions = JSON.parse(fileContent);
        submissions.push(submission);

        await fs.writeFile(DATA_PATH, JSON.stringify(submissions, null, 2));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Submission error:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}
