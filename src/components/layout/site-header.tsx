"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "./container";
import { Wordmark } from "./wordmark";
import { capture } from "@/lib/analytics/client";
import { NAV_LINKS, ROUTES } from "@/content/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function openWaitlist(source: "nav" | "footer") {
    capture("waitlist_started", { source, prefilled: false });
    setMenuOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-rule bg-ground/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 sm:h-18">
          <Link
            href={ROUTES.home}
            className="rounded-sm"
            aria-label="Bitplaza — home"
            onClick={() => setMenuOpen(false)}
          >
            <Wordmark />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="rounded-pill px-3 py-2 text-sm text-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <a href="#waitlist" onClick={() => openWaitlist("nav")}>
                Request early access
              </a>
            </Button>

            <Dialog.Root open={menuOpen} onOpenChange={setMenuOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="grid size-11 place-items-center rounded-pill text-ink lg:hidden"
                >
                  <Menu className="size-5" aria-hidden="true" strokeWidth={1.75} />
                </button>
              </Dialog.Trigger>

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-50 bg-ground/70 backdrop-blur-sm lg:hidden" />
                <Dialog.Content
                  className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-surface p-5 shadow-deep lg:hidden"
                  aria-describedby={undefined}
                >
                  <Dialog.Title className="sr-only">Menu</Dialog.Title>

                  <div className="flex items-center justify-between">
                    <Wordmark />
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="grid size-11 place-items-center rounded-pill text-ink"
                      >
                        <X className="size-5" aria-hidden="true" strokeWidth={1.75} />
                      </button>
                    </Dialog.Close>
                  </div>

                  <nav aria-label="Primary" className="mt-6">
                    <ul className="flex flex-col gap-1">
                      {NAV_LINKS.map((link) => (
                        <li key={link.href}>
                          <a
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-12 items-center rounded-card px-3 text-base text-ink"
                          >
                            {link.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <ThemeToggle />
                    <Button asChild size="sm">
                      <a href="#waitlist" onClick={() => openWaitlist("nav")}>
                        Request early access
                      </a>
                    </Button>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </div>
      </Container>
    </header>
  );
}
