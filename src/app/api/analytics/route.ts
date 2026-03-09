import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "src/data/submissions.json");

export async function GET() {
    try {
        const fileContent = await fs.readFile(DATA_PATH, "utf-8");
        const submissions = JSON.parse(fileContent);

        // Aggregate data for charts
        const stats = {
            totalSubmissions: submissions.length,
            totalChildren: submissions.reduce((acc: number, s: any) => acc + parseInt(s.childCount || 0), 0),
            allergies: {} as Record<string, number>,
            ageRanges: {} as Record<string, number>,
            foodPrefs: {} as Record<string, number>,
            recentSubmissions: submissions.slice(-10).reverse(),
        };

        submissions.forEach((s: any) => {
            // 1. Food preferences (vibrant chart)
            s.foodPreference?.forEach((p: string) => {
                stats.foodPrefs[p] = (stats.foodPrefs[p] || 0) + 1;
            });

            // 2. Personal allergies
            s.personalAllergies?.forEach((a: string) => {
                stats.allergies[a] = (stats.allergies[a] || 0) + 1;
            });

            // 3. Child demographics (from age range checkboxes)
            s.childAgeRanges?.forEach((r: string) => {
                stats.ageRanges[r] = (stats.ageRanges[r] || 0) + 1;
            });

            // 4. Detailed child allergies (from the new table)
            // We'll add these to the main allergies count for total visibility
            s.childAllergies?.forEach((ca: any) => {
                if (ca.allergy && ca.childCount && ca.ageBracket) {
                    const count = parseInt(ca.childCount) || 1;
                    stats.allergies[ca.allergy] = (stats.allergies[ca.allergy] || 0) + count;
                    // You could also track stats by ageBracket here if needed
                }
            });
        });

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
