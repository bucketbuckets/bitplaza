import { SITE } from "@/content/site";

/**
 * Organization structured data.
 *
 * Every field asserts something real and checkable — the logo ships in
 * /public, the sameAs GitHub repository is public, and the parent
 * organization operates its own site. Nothing here is guessed, because this
 * is the version search engines and language models quote back. The
 * disambiguatingDescription exists because "Bitplaza" collides with an
 * unrelated shopping app in search and AI answers; it states what THIS
 * Bitplaza is without mentioning them.
 *
 * `foundingDate` and `founder` stay out until someone confirms them.
 */
export function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    description: SITE.description,
    slogan: SITE.tagline,
    disambiguatingDescription:
      "Bitplaza is the open map for communities at joinbitplaza.com, operated by Bitcoin Culture Hub.",
    logo: `${SITE.url}/icon-512.png`,
    sameAs: ["https://github.com/bucketbuckets/bitplaza"],
    parentOrganization: {
      "@type": "Organization",
      name: "Bitcoin Culture Hub",
      url: "https://bitcoinculturehub.com",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
