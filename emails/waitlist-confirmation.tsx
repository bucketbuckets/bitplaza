import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

/**
 * The waitlist confirmation. design.md voice: celebrate briefly, say what is
 * next, no jargon. One accent (apricot with ink text — white on apricot fails
 * contrast, same rule as the site), system fonts because webfonts in email are
 * unreliable, and everything important repeated in the plain-text part.
 */

export interface WaitlistConfirmationProps {
  firstName: string;
  position: number;
  referralUrl: string;
  /** Display labels, e.g. ["Bitcoin", "Music"]. May be empty. */
  communityLabels: string[];
  siteUrl: string;
}

const ink = "#1a1310";
const inkMuted = "#5c4f47";
const paper = "#fdf6ec";
const apricot = "#ff6a3d";
const edge = "#e8dccb";

export function WaitlistConfirmation({
  firstName,
  position,
  referralUrl,
  communityLabels,
  siteUrl,
}: WaitlistConfirmationProps) {
  const communityLine =
    communityLabels.length > 0
      ? `We'll open the doors to ${formatList(communityLabels)} as those plazas come alive.`
      : "We'll let you know as each plaza comes alive.";

  return (
    <Html lang="en">
      <Head />
      <Preview>{`You're #${position} on the Bitplaza waitlist.`}</Preview>
      <Body style={{ backgroundColor: paper, margin: 0, padding: "32px 12px" }}>
        <Container
          style={{
            backgroundColor: "#ffffff",
            border: `1px solid ${edge}`,
            borderRadius: 20,
            maxWidth: 520,
            padding: "36px 32px",
            fontFamily:
              "-apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          }}
        >
          <Text style={{ color: apricot, fontSize: 13, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: 0 }}>
            Bitplaza
          </Text>

          <Heading as="h1" style={{ color: ink, fontSize: 28, lineHeight: "34px", margin: "16px 0 0" }}>
            {firstName}, you&apos;re in.
          </Heading>

          <Section
            style={{
              backgroundColor: apricot,
              borderRadius: 16,
              margin: "24px 0",
              padding: "20px 24px",
            }}
          >
            <Text style={{ color: ink, fontSize: 16, fontWeight: 700, margin: 0 }}>
              You&apos;re number {position.toLocaleString("en-US")} in line.
            </Text>
          </Section>

          <Text style={{ color: inkMuted, fontSize: 16, lineHeight: "25px", margin: "0 0 16px" }}>
            The first plaza — Bitcoin Culture Hub — opens to the waitlist in
            order. {communityLine}
          </Text>

          <Hr style={{ borderColor: edge, margin: "24px 0" }} />

          <Heading as="h2" style={{ color: ink, fontSize: 18, margin: "0 0 8px" }}>
            Want in sooner? Bring your people.
          </Heading>

          <Text style={{ color: inkMuted, fontSize: 16, lineHeight: "25px", margin: "0 0 12px" }}>
            Every person who joins with your link moves you up the list — and
            means more of your people are already inside when you arrive.
          </Text>

          <Text style={{ margin: "0 0 24px" }}>
            <Link
              href={referralUrl}
              style={{ color: "#b8451f", fontSize: 16, fontWeight: 600, textDecoration: "underline", wordBreak: "break-all" as const }}
            >
              {referralUrl}
            </Link>
          </Text>

          <Text style={{ color: inkMuted, fontSize: 14, lineHeight: "22px", margin: 0 }}>
            What happens next: we&apos;re building in the open. You&apos;ll hear
            from us when your place is ready — and only about that.
          </Text>

          <Hr style={{ borderColor: edge, margin: "24px 0" }} />

          <Text style={{ color: inkMuted, fontSize: 12, lineHeight: "18px", margin: 0 }}>
            You received this because you joined the waitlist at{" "}
            <Link href={siteUrl} style={{ color: inkMuted }}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </Link>
            . If that wasn&apos;t you, ignore this email and nothing further
            will be sent.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/** The plain-text alternative — some inboxes render only this. */
export function waitlistConfirmationText(props: WaitlistConfirmationProps): string {
  const communityLine =
    props.communityLabels.length > 0
      ? `We'll open the doors to ${formatList(props.communityLabels)} as those plazas come alive.`
      : "We'll let you know as each plaza comes alive.";

  return [
    `${props.firstName}, you're in.`,
    "",
    `You're number ${props.position.toLocaleString("en-US")} in line on the Bitplaza waitlist.`,
    "",
    `The first plaza — Bitcoin Culture Hub — opens to the waitlist in order. ${communityLine}`,
    "",
    "Want in sooner? Bring your people.",
    "Every person who joins with your link moves you up the list:",
    props.referralUrl,
    "",
    "What happens next: we're building in the open. You'll hear from us when your place is ready — and only about that.",
    "",
    `You received this because you joined the waitlist at ${props.siteUrl}. If that wasn't you, ignore this email and nothing further will be sent.`,
  ].join("\n");
}

function formatList(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

export default WaitlistConfirmation;
