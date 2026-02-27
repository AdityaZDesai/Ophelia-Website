import { FOOTER_LINKS } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 border-t border-glass-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-8">
            <a href="#" className="font-display text-xl font-semibold gradient-text">
              harmonica
            </a>
            <span className="hidden md:block text-text-light">|</span>
            <p className="text-text-muted text-sm">AI girlfriend avatar for your desktop</p>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8">
            {FOOTER_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-muted hover:text-foreground transition-colors text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-glass-border text-center">
          <p className="text-text-light text-xs">
            &copy; {currentYear} harmonica. Powered by Clawdbot.
          </p>
        </div>
      </div>
    </footer>
  );
}
