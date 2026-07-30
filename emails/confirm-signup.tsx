import {
  Body,
  Button,
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
 * The double opt-in email. One job: the confirm tap. No position and no
 * referral link here; both are assigned on confirm and arrive in the welcome
 * email, so nothing in this message competes with the button.
 *
 * Same rules as its sibling (waitlist-confirmation): apricot takes ink text,
 * system fonts, no em dashes, and the plain-text twin carries everything.
 * The small arch above the heading is the site's portal shape; this email is
 * the one true doorway into the list, so it earns the motif.
 */

export interface ConfirmSignupProps {
  /** Optional: the form no longer asks for a name. */
  firstName?: string | null;
  confirmUrl: string;
  siteUrl: string;
  /** Copy only. Enforcement lives on the token row, not in this file. */
  expiresInDays: number;
}

export const confirmSignupSubject = "Confirm your Bitplaza signup";

const ink = "#1a1310";
const inkMuted = "#5c4f47";
const paper = "#fdf6ec";
const apricot = "#ff6a3d";
const edge = "#e8dccb";

function heading(firstName: string | null | undefined): string {
  return firstName ? `${firstName}, confirm your spot.` : "Confirm your spot.";
}

export function ConfirmSignup({
  firstName,
  confirmUrl,
  siteUrl,
  expiresInDays,
}: ConfirmSignupProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>One tap locks in your place in line.</Preview>
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

          <Section style={{ margin: "28px 0 0" }}>
            <div
              style={{
                backgroundColor: apricot,
                borderRadius: "999px 999px 0 0",
                height: 56,
                width: 44,
              }}
            />
          </Section>

          <Heading as="h1" style={{ color: ink, fontSize: 28, lineHeight: "34px", margin: "16px 0 0" }}>
            {heading(firstName)}
          </Heading>

          <Text style={{ color: inkMuted, fontSize: 16, lineHeight: "25px", margin: "16px 0 28px" }}>
            You asked to join the Bitplaza waitlist. One tap and your place in
            line is locked in.
          </Text>

          <Section style={{ margin: "0 0 12px" }}>
            <Button
              href={confirmUrl}
              style={{
                backgroundColor: apricot,
                borderRadius: 999,
                color: ink,
                fontSize: 16,
                fontWeight: 700,
                padding: "14px 32px",
                textDecoration: "none",
              }}
            >
              Confirm my spot
            </Button>
          </Section>

          <Text style={{ color: inkMuted, fontSize: 14, lineHeight: "22px", margin: "0 0 24px" }}>
            This link works once and expires in {expiresInDays}{" "}
            {expiresInDays === 1 ? "day" : "days"}.
          </Text>

          <Text style={{ color: inkMuted, fontSize: 14, lineHeight: "22px", margin: "0 0 8px" }}>
            If the button doesn&apos;t work, paste this into your browser:
          </Text>
          <Text style={{ margin: "0 0 24px" }}>
            <Link
              href={confirmUrl}
              style={{ color: "#b8451f", fontSize: 14, fontWeight: 600, textDecoration: "underline", wordBreak: "break-all" as const }}
            >
              {confirmUrl}
            </Link>
          </Text>

          <Hr style={{ borderColor: edge, margin: "0 0 24px" }} />

          <Text style={{ color: inkMuted, fontSize: 14, lineHeight: "22px", margin: 0 }}>
            Once you confirm, we&apos;ll send your number in line and a link
            that moves you up when friends join through it.
          </Text>

          <Hr style={{ borderColor: edge, margin: "24px 0" }} />

          <Text style={{ color: inkMuted, fontSize: 12, lineHeight: "18px", margin: 0 }}>
            You received this one email because this address was entered on the
            waitlist at{" "}
            <Link href={siteUrl} style={{ color: inkMuted }}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </Link>
            . If that wasn&apos;t you, ignore it. Nothing more will be sent and
            the address won&apos;t be added to the list.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

/** The plain-text alternative — some inboxes render only this. */
export function confirmSignupText(props: ConfirmSignupProps): string {
  return [
    heading(props.firstName),
    "",
    "You asked to join the Bitplaza waitlist. Open this link and your place in line is locked in:",
    props.confirmUrl,
    "",
    `This link works once and expires in ${props.expiresInDays} ${props.expiresInDays === 1 ? "day" : "days"}.`,
    "",
    "Once you confirm, we'll send your number in line and a link that moves you up when friends join through it.",
    "",
    `You received this one email because this address was entered on the waitlist at ${props.siteUrl}. If that wasn't you, ignore it. Nothing more will be sent and the address won't be added to the list.`,
  ].join("\n");
}

export default ConfirmSignup;
