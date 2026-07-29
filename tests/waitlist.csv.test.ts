import { describe, expect, it } from "vitest";

import { escapeCsvValue, toCsvRow } from "@/lib/waitlist/csv";

describe("escapeCsvValue", () => {
  it("passes plain values through untouched", () => {
    expect(escapeCsvValue("hello")).toBe("hello");
  });

  it("quotes commas, quotes and newlines per RFC 4180", () => {
    expect(escapeCsvValue("a,b")).toBe('"a,b"');
    expect(escapeCsvValue('say "hi"')).toBe('"say ""hi"""');
    expect(escapeCsvValue("line1\nline2")).toBe('"line1\nline2"');
  });

  it("neutralizes spreadsheet formula injection", () => {
    expect(escapeCsvValue("=HYPERLINK(evil)")).toBe("'=HYPERLINK(evil)");
    expect(escapeCsvValue("+1234")).toBe("'+1234");
    expect(escapeCsvValue("-2+3")).toBe("'-2+3");
    expect(escapeCsvValue("@SUM(A1)")).toBe("'@SUM(A1)");
    expect(escapeCsvValue("\t=cmd")).toBe("'\t=cmd");
  });

  it("quotes an injected value that also contains a comma", () => {
    expect(escapeCsvValue("=1,2")).toBe("\"'=1,2\"");
  });
});

describe("toCsvRow", () => {
  it("joins values and renders null/undefined as empty cells", () => {
    expect(toCsvRow(["a", 1, null, undefined, "b,c"])).toBe('a,1,,,"b,c"');
  });
});
