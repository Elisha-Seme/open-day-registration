

async function testSubmit() {
    const data = {
        fullName: "Debug User",
        email: "debug@test.com",
        phoneNumber: "000000",
        personalAllergies: ["Nut"],
        foodPreference: ["Vegetarian"],
        childCount: "3",
        childAgeRanges: { "6 - 9": "2", "18+": "1" },
        childAllergies: [
            { allergy: "Nut", ageBracket: "6 - 9", childCount: "1" }
        ],
        confirmDetails: true,
        consent: true
    };

    try {
        const response = await fetch("http://localhost:3000/api/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        console.log("Status:", response.status);
        const result = await response.json();
        console.log("Result:", result);
    } catch (err) {
        console.error("Fetch error:", err.message);
    }
}

testSubmit();
