"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AudioPlayer, ChannelSelector, PhoneInput } from "@/components/ui";
import { AUDIO_OPTIONS, COMMUNICATION_CHANNELS, GIRL_PHOTOS, PERSONALITIES } from "@/lib/constants";
import type {
  AudioOptionId,
  CommunicationChannel,
  GirlPhotoId,
  PersonalityId,
} from "@/types";

type OnboardingStep = "photo" | "personality" | "audio" | "channel" | "phone";

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  
  const [step, setStep] = useState<OnboardingStep>("photo");
  const [selectedPhoto, setSelectedPhoto] = useState<GirlPhotoId | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<CommunicationChannel | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [selectedPersonality, setSelectedPersonality] = useState<PersonalityId | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioOptionId | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/");
    }
  }, [session, isPending, router]);

  const personalityData = PERSONALITIES.find((p) => p.id === selectedPersonality);

  const requiresPhone = selectedChannel === "imessage";
  const selectedChannelLabel = "iMessage";
  const flowSteps: OnboardingStep[] = requiresPhone
    ? ["photo", "personality", "audio", "channel", "phone"]
    : ["photo", "personality", "audio", "channel"];
  const currentStepIndex = flowSteps.indexOf(step);

  const handleStepContinue = () => {
    if (step === "photo" && selectedPhoto) {
      setStep("personality");
      return;
    }

    if (step === "personality" && selectedPersonality) {
      setStep("audio");
      return;
    }

    if (step === "audio" && selectedAudio) {
      setStep("channel");
      return;
    }

    if (step === "channel" && selectedChannel) {
      if (requiresPhone) {
        setStep("phone");
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (step === "phone") {
      setStep("channel");
      return;
    }

    if (step === "channel") {
      setStep("audio");
      return;
    }

    if (step === "audio") {
      setStep("personality");
      return;
    }

    if (step === "personality") {
      setStep("photo");
    }
  };

  const handleChannelSelect = (channel: CommunicationChannel) => {
    setSelectedChannel(channel);
    setPhoneError(undefined);
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
    if (!selectedPhoto || !selectedPersonality || !selectedAudio || !selectedChannel) {
      setPhoneError("Please complete all onboarding selections.");
      return;
    }

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
          selectedPhoto,
          communicationChannel: selectedChannel,
          phone: requiresPhone ? phone : null,
          selectedPersonality,
          selectedAudio,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to save preferences");
      }

      if (selectedChannel === "telegram" && data?.authCode) {
        sessionStorage.setItem("telegramAuthCode", data.authCode);
      }
      // Redirect based on selected channel
      if (selectedChannel === "imessage") {
        router.push("/imessage-chat");
      } else if (selectedChannel === "telegram") {
        router.push("/telegram-chat");
      } else {
        router.push("/chat");
      }
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
          {flowSteps.map((flowStep, idx) => (
            <div
              key={flowStep}
              className={`h-1 w-12 rounded-full transition-colors ${
                idx <= currentStepIndex ? "bg-white" : "bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        {step === "photo" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="font-cormorant text-3xl md:text-4xl text-white mb-3">
                Choose her photo
              </h2>
              <p className="font-jakarta text-white/60">
                Pick the look you want first
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {GIRL_PHOTOS.map((photo) => {
                const isSelected = selectedPhoto === photo.id;
                return (
                  <button
                    key={photo.id}
                    onClick={() => setSelectedPhoto(photo.id)}
                    className={`group rounded-2xl overflow-hidden border transition-all duration-300 ${
                      isSelected
                        ? "border-white shadow-lg shadow-white/20 scale-[1.01]"
                        : "border-white/10 hover:border-white/40"
                    }`}
                  >
                    <div className="relative aspect-[4/5] w-full">
                      <img
                        src={photo.image}
                        alt={photo.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="px-4 py-3 bg-white/5 text-white font-jakarta text-sm">
                      {photo.name}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 text-center">
              <button
                onClick={handleStepContinue}
                disabled={!selectedPhoto || loading}
                className={`
                  inline-flex items-center gap-3 px-10 py-4 font-jakarta font-medium rounded-full transition-all duration-300
                  ${selectedPhoto
                    ? "bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "personality" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="font-cormorant text-3xl md:text-4xl text-white mb-3">
                Choose her personality
              </h2>
              <p className="font-jakarta text-white/60">
                Select the vibe that fits you best
              </p>
            </div>

            <div className="grid gap-4">
              {PERSONALITIES.map((personality) => (
                <button
                  key={personality.id}
                  onClick={() => setSelectedPersonality(personality.id)}
                  className={`w-full rounded-2xl border p-5 text-left transition-all duration-300 ${
                    selectedPersonality === personality.id
                      ? "border-white bg-white/10"
                      : "border-white/10 bg-white/5 hover:border-white/30"
                  }`}
                >
                  <p className="font-cormorant text-2xl text-white">{personality.name}</p>
                  <p className="font-jakarta text-xs uppercase tracking-[0.2em] text-white/50 mt-1">
                    {personality.tagline}
                  </p>
                  <p className="font-jakarta text-sm text-white/70 mt-3 leading-relaxed">
                    {personality.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-8 py-3 text-white/70 hover:text-white font-jakarta text-sm"
              >
                Back
              </button>
              <button
                onClick={handleStepContinue}
                disabled={!selectedPersonality || loading}
                className={`
                  inline-flex items-center gap-3 px-10 py-4 font-jakarta font-medium rounded-full transition-all duration-300
                  ${selectedPersonality
                    ? "bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === "audio" && (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="font-cormorant text-3xl md:text-4xl text-white mb-3">
                Choose her voice
              </h2>
              <p className="font-jakarta text-white/60">
                Listen to samples and pick your favorite audio style
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {AUDIO_OPTIONS.map((audio) => {
                const isSelected = selectedAudio === audio.id;
                return (
                  <div
                    key={audio.id}
                    className={`rounded-2xl border p-4 transition-colors ${
                      isSelected ? "border-white bg-white/10" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <AudioPlayer src={audio.src} name={audio.name} />
                    <p className="mt-3 text-sm font-jakarta text-white/70">{audio.description}</p>
                    <button
                      onClick={() => setSelectedAudio(audio.id)}
                      className={`mt-4 w-full py-2 rounded-lg font-jakarta text-sm transition-colors ${
                        isSelected
                          ? "bg-white text-black"
                          : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select voice"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-8 py-3 text-white/70 hover:text-white font-jakarta text-sm"
              >
                Back
              </button>
              <button
                onClick={handleStepContinue}
                disabled={!selectedAudio || loading}
                className={`
                  inline-flex items-center gap-3 px-10 py-4 font-jakarta font-medium rounded-full transition-all duration-300
                  ${selectedAudio
                    ? "bg-white text-black hover:bg-white/90 shadow-lg hover:shadow-xl"
                    : "bg-white/10 text-white/50 cursor-not-allowed"
                  }
                `}
              >
                Continue
              </button>
            </div>
          </div>
        )}

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

            <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleBack}
                disabled={loading}
                className="px-8 py-3 text-white/70 hover:text-white font-jakarta text-sm"
              >
                Back
              </button>
              <button
                onClick={handleStepContinue}
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
                {selectedChannelLabel}
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
                  onClick={handleBack}
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
