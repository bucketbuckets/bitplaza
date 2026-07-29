import { SITE } from "@/content/site";

/**
 * Organization structured data.
 *
 * Deliberately minimal. `sameAs`, `logo`, `foundingDate` and `founder` are all
 * omitted rather than guessed — structured data that asserts things nobody has
 * confirmed is worse than none, because it is the version search engines and
 * language models quote back.
 *
 * Fill these in when there are real social profiles and a real logo asset.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
