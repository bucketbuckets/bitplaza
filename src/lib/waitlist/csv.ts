/**
 * CSV assembly for the admin export. Separated from the route so the escaping
 * rules are unit-testable — they are security rules, not formatting niceties.
 */

/**
 * Excel and Sheets execute cells that begin with = + - @ as formulas, so a
 * signup whose "first name" is `=HYPERLINK(...)` becomes code the moment an
 * admin opens the export. Neutralized with a leading apostrophe (the
 * spreadsheet convention for "this is text"), then normal RFC 4180 quoting.
 */
export function escapeCsvValue(value: string): string {
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  if (/[",\n\r]/.test(v)) v = `"${v.replaceAll('"', '""')}"`;
  return v;
}

export function toCsvRow(values: readonly (string | number | null | undefined)[]): string {
  return values
    .map((v) => (v === null || v === undefined ? "" : escapeCsvValue(String(v))))
    .join(",");
}
