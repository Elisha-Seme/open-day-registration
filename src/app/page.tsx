"use client";

import React, { useState } from "react";
import { FormSection, InputField } from "@/components/FormComponents";
import { AllergyGrid } from "@/components/AllergyGrid";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2, AlertCircle, MapPin, Utensils } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-slate-400 font-bold">Loading Map...</div>
});

const AGE_RANGES = ["6 - 9", "10 - 13", "14 - 18", "18+"];
const ALLERGIES = ["Dairy", "Gluten", "Nut", "Fish", "Others"];

export default function RegistrationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    personalAllergies: [] as string[],
    foodPreference: [] as string[],
    childCount: "1",
    childAgeRanges: [] as string[],
    childAllergies: [] as { allergy: string; ageBracket: string; childCount: string }[],
    confirmDetails: false,
    consent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Submission failed");

      setIsSuccess(true);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof typeof formData, item: string) => {
    const current = formData[field] as string[];
    const newValue = current.includes(item)
      ? current.filter((i) => i !== item)
      : [...current, item];
    updateFormData(String(field), newValue);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-slate-50">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full bg-white p-10 text-center rounded-2xl border border-slate-200 shadow-xl"
        >
          <div className="mb-6 flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-3 text-slate-900">Registration Received</h1>
          <p className="text-slate-600 mb-8">
            Thank you for registering for Manga House Open Day. We look forward to seeing you!
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setIsSuccess(false)}
              className="w-full py-3 px-6 bg-primary text-white rounded-lg font-semibold transition-all hover:bg-primary/90 active:scale-[0.98]"
            >
              Submit another response
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <main className="max-w-3xl mx-auto py-16 px-6">
      <div className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-wider">
          <MapPin className="w-3.5 h-3.5" /> Kiambere Road, Upper Hill
        </div>
        <h1 className="text-4xl sm:text-5xl font-black mb-4 text-slate-900 tracking-tight">
          Join Our <span className="text-primary">Open Day</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-lg mx-auto leading-relaxed">
          Experience Manga House first-hand. Please fill in the details below to complete your registration.
        </p>
      </div>

      <div className="mb-12 border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-slate-700 uppercase tracking-tight">Event Location</span>
        </div>
        <div className="h-[300px] w-full relative">
          <Map center={[-1.302028, 36.822207]} />
        </div>
        <div className="p-4 text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">p + Leaflet</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <FormSection title="Parental Information" description="How can we reach you?">
          <InputField
            label="Dad's Full Name"
            placeholder="Enter full name"
            required
            value={formData.fullName}
            onChange={(e) => updateFormData("fullName", e.target.value)}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Email Address"
              type="email"
              placeholder="name@email.com"
              required
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
            />
            <InputField
              label="Phone Number"
              type="tel"
              placeholder="+254..."
              required
              value={formData.phoneNumber}
              onChange={(e) => updateFormData("phoneNumber", e.target.value)}
            />
          </div>
        </FormSection>

        <FormSection title="Dietary & Food Preferences" description="Help us plan the catering.">
          <div className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <Utensils className="w-4 h-4 text-primary" /> Food Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {["Vegetarian", "Non-Vegetarian"].map((pref) => (
                  <label
                    key={pref}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border transition-all cursor-pointer shadow-sm",
                      formData.foodPreference.includes(pref)
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.foodPreference.includes(pref)}
                      onChange={() => toggleArrayItem("foodPreference", pref)}
                    />
                    <span className="text-sm font-black uppercase tracking-tight">{pref}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700">Any specific allergies?</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {ALLERGIES.map((allergy) => (
                  <label
                    key={allergy}
                    className={cn(
                      "flex items-center gap-2 p-3 rounded-lg border transition-all cursor-pointer",
                      formData.personalAllergies.includes(allergy)
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                      checked={formData.personalAllergies.includes(allergy)}
                      onChange={() => toggleArrayItem("personalAllergies", allergy)}
                    />
                    <span className="text-sm font-bold">{allergy}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </FormSection>

        <FormSection title="Children Details" description="Tell us about the children attending.">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">How many children will be attending?</label>
              <select
                className="flex h-11 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none transition-all font-medium"
                value={formData.childCount}
                onChange={(e) => updateFormData("childCount", e.target.value)}
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700">What age range do your children fall into?</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AGE_RANGES.map((range) => (
                  <label
                    key={range}
                    className={cn(
                      "flex items-center justify-center p-3 rounded-lg border transition-all cursor-pointer text-center text-sm font-bold shadow-sm",
                      formData.childAgeRanges.includes(range)
                        ? "border-primary bg-primary text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={formData.childAgeRanges.includes(range)}
                      onChange={() => toggleArrayItem("childAgeRanges", range)}
                    />
                    {range}
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-bold text-slate-700 uppercase tracking-tight">Children's Allergy Information</label>
              <p className="text-xs text-slate-500 mb-2">Please specify the age and count for each allergy type if applicable.</p>
              <AllergyGrid
                allergies={ALLERGIES}
                ageRanges={AGE_RANGES}
                value={formData.childAllergies}
                onChange={(val) => updateFormData("childAllergies", val)}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="Final Confirmation">
          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                required
                className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={formData.confirmDetails}
                onChange={(e) => updateFormData("confirmDetails", e.target.checked)}
              />
              <span className="text-sm text-slate-700 font-medium leading-relaxed">
                I confirm that the details provided are accurate <span className="text-red-500 font-bold">*</span>
              </span>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary"
                checked={formData.consent}
                onChange={(e) => updateFormData("consent", e.target.checked)}
              />
              <span className="text-sm text-slate-700 font-medium leading-relaxed">
                By accepting, you give consent to participate in the event.
              </span>
            </label>
          </div>
        </FormSection>

        {error && (
          <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-5 px-8 bg-primary text-white rounded-xl font-black text-2xl shadow-xl shadow-blue-500/20 transition-all hover:bg-primary/95 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 uppercase tracking-tighter"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Registration"
          )}
        </button>

        <div className="flex justify-center gap-8 mt-12 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="hover:text-primary transition-colors"
          >
            Reset Form
          </button>
        </div>
      </form>
    </main>
  );
}
