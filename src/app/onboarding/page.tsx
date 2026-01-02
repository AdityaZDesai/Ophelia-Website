"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { ChannelSelector, PhoneInput } from "@/components/ui";
import { COMMUNICATION_CHANNELS, PERSONALITIES } from "@/lib/constants";
import type { CommunicationChannel, PersonalityId } from "@/types";

type OnboardingStep = "channel" | "phone";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [step, setStep] = useState<OnboardingStep>("channel");
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityId | null>(null);

  // Get selected personality from session storage
  useEffect(() => {
    const storedPersonality = sessionStorage.getItem("selectedPersonality") as PersonalityId | null;
    if (storedPersonality) {
      setSelectedPersonality(storedPersonality);
    }
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const personalityData = PERSONALITIES.find((p) => p.id === selectedPersonality);

  const requiresPhone = selectedChannel === "imessage" || selectedChannel === "whatsapp";

  const handleChannelSelect = (channel: CommunicationChannel) => {
    setSelectedChannel(channel);
    setPhoneError(undefined);
  };

  const handleChannelContinue = () => {
    if (!selectedChannel) return;

    if (requiresPhone) {
      setStep("phone");
    } else {
      // Web selected - complete onboarding without phone
      handleSubmit();
    }
  };

  const validatePhone = (): boolean => {
    // Remove formatting to check raw digits
    const digits = phone.replace(/\D/g, "");
    
    if (digits.length < 10) {
      setPhoneError("Please enter a valid phone number");
      return false;
    }
    
    setPhoneError(undefined);
    return true;
  };

  const handleSubmit = async () => {
    if (requiresPhone && !validatePhone()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          communicationChannel: selectedChannel,
          phone: requiresPhone ? phone : null,
          selectedPersonality,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save preferences");
      }

      // Clear session storage
      sessionStorage.removeItem("selectedPersonality");

      // Redirect to dashboard/chat
      router.push("/chat");
    } catch (error) {
      console.error("Onboarding error:", error);
      setPhoneError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isPending) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-pulse text-white/50 font-jakarta">Loading...</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <h1 className="font-cormorant text-3xl md:text-4xl text-white tracking-wide">
            Ophelia
          </h1>
          {personalityData && (
            <p
              className="font-jakarta text-sm mt-2"
              style={{ color: personalityData.accentColor }}
            >
              Meet {personalityData.name}
            </p>
          )}
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mb-12">
          <div
            className={`h-1 w-12 rounded-full transition-colors ${
              step === "channel" ? "bg-white" : "bg-white/30"
            }`}
          />
          {requiresPhone && (
            <div
              className={`h-1 w-12 rounded-full transition-colors ${
                step === "phone" ? "bg-white" : "bg-white/30"
              }`}
            />
          )}
        </div>

        {/* Step Content */}
        {step === "channel" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="font-cormorant text-3xl md:text-4xl text-white mb-3">
                How do you want to connect?
              </h2>
              <p className="font-jakarta text-white/60">
                Choose how you&apos;d like to talk with {personalityData?.name || "Ophelia"}
              </p>
            </div>

            <ChannelSelector
              channels={COMMUNICATION_CHANNELS}
              selectedChannel={selectedChannel}
              onSelect={handleChannelSelect}
            />

            <div className="mt-10 text-center">
              <button
                onClick={handleChannelContinue}
                disabled={!selectedChannel || loading}
                className={`
                  inline-flex items-center gap-3 px-10 py-4 font-jakarta font-medium rounded-full transition-all duration-300
                  ${selectedChannel
                    ? "bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                  }
                `}
              >
                {loading ? (
                  "Please wait..."
                ) : selectedChannel === "web" ? (
                  "Start Chatting"
                ) : (
                  "Continue"
                )}
                {!loading && (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        )}

        {step === "phone" && (
          <div className="animate-fade-in max-w-md mx-auto">
            <div className="text-center mb-10">
              <h2 className="font-cormorant text-3xl md:text-4xl text-white mb-3">
                One last thing...
              </h2>
              <p className="font-jakarta text-white/60">
                Enter your phone number so {personalityData?.name || "Ophelia"} can reach you on{" "}
                {selectedChannel === "imessage" ? "iMessage" : "WhatsApp"}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
              <PhoneInput
                value={phone}
                onChange={setPhone}
                error={phoneError}
              />

              <div className="mt-8 flex flex-col gap-3">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-jakarta font-medium rounded-xl hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Complete Setup"}
                </button>
                
                <button
                  onClick={() => setStep("channel")}
                  disabled={loading}
                  className="w-full py-3 text-white/50 hover:text-white font-jakarta text-sm transition-colors"
                >
                  Back to channel selection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}

