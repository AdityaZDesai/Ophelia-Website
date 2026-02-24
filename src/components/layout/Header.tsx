"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthModal, Button } from "@/components/ui";
import { NAV_LINKS } from "@/lib/constants";
import { signOut, useSession } from "@/lib/auth-client";

export function Header() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [accountRedirectPath, setAccountRedirectPath] = useState("/chat");
  const [loggingOut, setLoggingOut] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

  const getRedirectForChannel = (channel?: string | null) => {
    switch (channel) {
      case "imessage":
        return "/imessage-chat";
      case "whatsapp":
        return "/whatsapp-chat";
      case "telegram":
        return "/telegram-chat";
      case "discord":
        return "/discord-chat";
      default:
        return "/chat";
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!session) {
      setShowAccountMenu(false);
      return;
    }

    const loadUserStatus = async () => {
      try {
        const response = await fetch("/api/user/status", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const status = await response.json();
        setAccountRedirectPath(getRedirectForChannel(status?.communicationChannel));
      } catch {
        setAccountRedirectPath("/chat");
      }
    };

    loadUserStatus();
  }, [session]);

  useEffect(() => {
    if (!showAccountMenu) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setShowAccountMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showAccountMenu]);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const handleSignInClick = () => {
    setShowAuthModal(true);
    closeMobileMenu();
  };

  const handleAccountButtonClick = () => {
    setShowAccountMenu((prev) => !prev);
    closeMobileMenu();
  };

  const handleAccountMenuNavigate = (path: string) => {
    setShowAccountMenu(false);
    closeMobileMenu();
    router.push(path);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await signOut();
      setShowAccountMenu(false);
      closeMobileMenu();
      router.push("/");
    } finally {
      setLoggingOut(false);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
  };

  const isAuthenticated = !!session;
  const accountLabel = isPending ? "Loading..." : isAuthenticated ? "Your Account" : "Sign In";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-background/90 backdrop-blur-md py-4 shadow-sm"
            : "bg-transparent py-6"
        }`}
      >
        <nav className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="font-serif text-2xl font-medium tracking-wide">
            harmonica
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm tracking-wide text-text-muted hover:text-foreground transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA and Mobile Menu Button */}
          <div className="flex items-center gap-4 relative" ref={accountMenuRef}>
            <Button
              onClick={isAuthenticated ? handleAccountButtonClick : handleSignInClick}
              className="hidden sm:block"
              disabled={isPending}
            >
              {accountLabel}
            </Button>

            {isAuthenticated && showAccountMenu && (
              <div className="hidden sm:flex absolute right-0 top-[calc(100%+0.6rem)] w-56 flex-col gap-2 rounded-2xl border border-cream bg-background/95 p-3 shadow-xl backdrop-blur-md">
                <button
                  type="button"
                  onClick={() => handleAccountMenuNavigate(accountRedirectPath)}
                  className="w-full rounded-xl bg-foreground px-4 py-2.5 text-left text-sm font-medium text-background hover:bg-foreground/90 transition-colors"
                >
                  Go to your app
                </button>
                <button
                  type="button"
                  onClick={() => handleAccountMenuNavigate("/onboarding?edit=1")}
                  className="w-full rounded-xl border border-cream px-4 py-2.5 text-left text-sm text-foreground hover:bg-cream/40 transition-colors"
                >
                  Edit setup
                </button>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full rounded-xl border border-red-400/50 px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-foreground"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b border-cream transition-all duration-300 ${
            mobileMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex flex-col px-6 py-6 gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="text-lg tracking-wide text-text-muted hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => handleAccountMenuNavigate(accountRedirectPath)}
                  className="text-center text-sm font-medium px-6 py-3 bg-foreground text-background rounded-full mt-2"
                >
                  Go to your app
                </button>
                <button
                  onClick={() => handleAccountMenuNavigate("/onboarding?edit=1")}
                  className="text-center text-sm font-medium px-6 py-3 border border-cream text-foreground rounded-full"
                >
                  Edit setup
                </button>
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="text-center text-sm font-medium px-6 py-3 border border-red-400/50 text-red-400 rounded-full disabled:opacity-60"
                >
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </>
            ) : (
              <button
                onClick={handleSignInClick}
                className="text-center text-sm font-medium px-6 py-3 bg-foreground text-background rounded-full mt-2"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        selectedPersonality={null}
        onSuccess={handleAuthSuccess}
        initialMode="signin"
        allowModeSwitch={false}
      />
    </>
  );
}
