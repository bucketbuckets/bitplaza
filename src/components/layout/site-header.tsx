"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Container } from "./container";
import { Wordmark } from "./wordmark";
import { capture } from "@/lib/analytics/client";
import { NAV_CTA, NAV_LINKS, ROUTES } from "@/content/site";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { cn } from "@/lib/utils";

/**
 * The header: four page links and one action. The appearance control lives in
 * the footer and the mobile menu, never in prime navigation space.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onLeaderCta() {
    capture("leader_cta_clicked", { location: "header" });
    setMenuOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-edge bg-paper/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <Container width="wide">
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
                  <Link
                    href={link.href}
                    className="rounded-pill px-3 py-2 text-sm text-ink-muted transition-colors hover:text-ink"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Owner call: the light/dark control lives in the header too. */}
            <ThemeToggle className="hidden sm:inline-flex" />
            {/* Secondary on purpose: the hero's primary owns the accent in the
                first viewport. The header offers the action; it does not shout. */}
            <Button asChild size="sm" variant="secondary" className="hidden sm:inline-flex">
              <Link href={NAV_CTA.href} onClick={onLeaderCta}>
                {NAV_CTA.label}
              </Link>
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
                <Dialog.Overlay className="fixed inset-0 z-50 bg-paper/70 backdrop-blur-sm lg:hidden" />
                <Dialog.Content
                  className="fixed inset-x-0 top-0 z-50 border-b border-edge bg-surface p-5 shadow-deep lg:hidden"
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
                          <Link
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className="flex min-h-12 items-center rounded-card px-3 text-base text-ink"
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <ThemeToggle />
                    <Button asChild size="sm">
                      <Link href={NAV_CTA.href} onClick={onLeaderCta}>
                        {NAV_CTA.label}
                      </Link>
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
