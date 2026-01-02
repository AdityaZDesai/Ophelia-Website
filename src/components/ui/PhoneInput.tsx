"use client";

import { useState } from "react";

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  // Format phone number as user types
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "");
    
    // Format as (XXX) XXX-XXXX for US numbers
    let formatted = input;
    if (input.length >= 6) {
      formatted = `(${input.slice(0, 3)}) ${input.slice(3, 6)}-${input.slice(6, 10)}`;
    } else if (input.length >= 3) {
      formatted = `(${input.slice(0, 3)}) ${input.slice(3)}`;
    } else if (input.length > 0) {
      formatted = `(${input}`;
    }
    
    onChange(formatted);
  };

  return (
    <div className="space-y-2">
      <label className="block font-jakarta text-sm text-white/70">
        Phone Number
      </label>
      
      <div
        className={`
          relative flex items-center rounded-xl border-2 transition-all duration-300
          ${isFocused 
            ? "border-white/40 bg-white/10" 
            : error 
              ? "border-red-500/50 bg-red-500/5" 
              : "border-white/10 bg-white/5"
          }
        `}
      >
        {/* Country Code Dropdown */}
        <div className="flex items-center gap-2 pl-4 pr-3 py-3 border-r border-white/10">
          <select
            className="bg-transparent text-white/60 font-jakarta text-sm pr-1 focus:outline-none"
            value={
              value.startsWith("+44")
                ? "+44"
                : value.startsWith("+61")
                ? "+61"
                : value.startsWith("+1")
                ? "+1"
                : "+1"
            }
            onChange={e => {
              const currentNumber = value.replace(/^\+\d+\s*/, "");
              onChange(`${e.target.value} ${currentNumber}`);
            }}
          >
            <option value="+1">🇺🇸 +1 (USA)</option>
            <option value="+1">🇨🇦 +1 (Canada)</option>
            <option value="+44">🇬🇧 +44 (UK)</option>
            <option value="+61">🇦🇺 +61 (Australia)</option>
            {/* Add more country codes as needed */}
          </select>
        </div>
        {/* Phone Input */}
        <input
          type="tel"
          placeholder="(555) 000-0000"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={14}
          className="flex-1 px-4 py-3 bg-transparent text-white placeholder-white/30 font-jakarta text-sm focus:outline-none"
        />
        
        {/* Phone Icon */}
        <div className="pr-4">
          <svg
            className={`w-5 h-5 transition-colors ${error ? "text-red-400" : "text-white/30"}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
            />
          </svg>
        </div>
      </div>
      
      {error && (
        <p className="font-jakarta text-xs text-red-400 flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </p>
      )}
      
      <p className="font-jakarta text-xs text-white/40">
        We&apos;ll use this number to text you as Ophelia
      </p>
    </div>
  );
}

