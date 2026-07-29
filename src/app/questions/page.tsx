import type { Metadata } from "next";

import { FaqList } from "@/components/sections/faq";
import { Container } from "@/components/layout/container";
import { FaqSchema } from "@/components/seo/faq-schema";
import { FAQ } from "@/content/faq";

/**
 * /questions — the complete FAQ. The homepage carries five of these; this
 * page carries all of them, from the same constant, so they cannot drift.
 */

export const metadata: Metadata = {
  title: "Questions",
  description:
    "What Bitplaza is, how the open map works, who can create one, and how the company sustains itself. Plain answers, written to be checked.",
};

export default function QuestionsPage() {
  return (
    <article className="py-20 sm:py-28">
      <FaqSchema items={FAQ} />
      <Container width="narrow">
        <header className="flex flex-col gap-4">
          <p className="eyebrow text-apricot-ink">Questions</p>
          <h1 className="font-display text-display-1 text-ink">Everything people ask.</h1>
        </header>
        <div className="mt-12">
          <FaqList items={FAQ} />
        </div>
      </Container>
    </article>
  );
}
