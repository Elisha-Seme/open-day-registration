import { NextResponse } from "next/server";
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

export async function GET() {
    try {
        const submissions: any[] = await redis.get('submissions') || [];

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
            // Handle legacy data where childAllergies was an object
            if (Array.isArray(s.childAllergies)) {
                s.childAllergies.forEach((ca: any) => {
                    if (ca.allergy) {
                        const count = parseInt(ca.childCount) || 1;
                        stats.allergies[ca.allergy] = (stats.allergies[ca.allergy] || 0) + count;
                    }
                });
            } else if (s.childAllergies && typeof s.childAllergies === 'object') {
                // Legacy support for the old object format if needed
                Object.entries(s.childAllergies).forEach(([allergy, ages]: any) => {
                    if (Array.isArray(ages)) {
                        stats.allergies[allergy] = (stats.allergies[allergy] || 0) + ages.length;
                    }
                });
            }
        });

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Analytics error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
