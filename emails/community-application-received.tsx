import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

/** Acknowledgement for a community-builder application. Same visual rules as
 * the confirmation: apricot accent with ink text, system fonts, honest copy. */

export interface CommunityApplicationReceivedProps {
  firstName: string;
  communityName: string;
  siteUrl: string;
}

const ink = "#1a1310";
const inkMuted = "#5c4f47";
const paper = "#fdf6ec";
const apricot = "#ff6a3d";
const edge = "#e8dccb";

export function CommunityApplicationReceived({
  firstName,
  communityName,
  siteUrl,
}: CommunityApplicationReceivedProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{`We received your application for ${communityName}.`}</Preview>
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

          <Heading as="h1" style={{ color: ink, fontSize: 28, lineHeight: "34px", margin: "16px 0 16px" }}>
            {firstName}, we got it.
          </Heading>

          <Text style={{ color: inkMuted, fontSize: 16, lineHeight: "25px", margin: "0 0 16px" }}>
            Your application to build a plaza for{" "}
            <span style={{ color: ink, fontWeight: 600 }}>{communityName}</span>{" "}
            is in. A person, not a filter, reads every one, so it may take a
            few days.
          </Text>

          <Text style={{ color: inkMuted, fontSize: 16, lineHeight: "25px", margin: 0 }}>
            If your community is a fit for an early plaza, we&apos;ll reply to
            this address to set up a conversation.
          </Text>

          <Hr style={{ borderColor: edge, margin: "24px 0" }} />

          <Text style={{ color: inkMuted, fontSize: 12, lineHeight: "18px", margin: 0 }}>
            You received this because you applied at{" "}
            <Link href={siteUrl} style={{ color: inkMuted }}>
              {siteUrl.replace(/^https?:\/\//, "")}
            </Link>
            . If that wasn&apos;t you, ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export function communityApplicationReceivedText(
  props: CommunityApplicationReceivedProps,
): string {
  return [
    `${props.firstName}, we got it.`,
    "",
    `Your application to build a plaza for ${props.communityName} is in. A person, not a filter, reads every one, so it may take a few days.`,
    "",
    "If your community is a fit for an early plaza, we'll reply to this address to set up a conversation.",
    "",
    `You received this because you applied at ${props.siteUrl}. If that wasn't you, ignore this email.`,
  ].join("\n");
}

export default CommunityApplicationReceived;
