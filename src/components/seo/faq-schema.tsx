import { HOME_FAQ, type FaqItem } from "@/content/faq";

/**
 * FAQPage structured data.
 *
 * Generated from the same constant the section renders, so the markup and the
 * schema cannot disagree — hand-maintained JSON-LD drifts from the visible copy
 * within about two edits, and Google treats that as a reason to ignore it.
 *
 * Only questions actually rendered on the page are included, which is the
 * condition Google's guidelines put on FAQ rich results.
 */
export function FaqSchema({ items = HOME_FAQ }: { items?: readonly FaqItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
