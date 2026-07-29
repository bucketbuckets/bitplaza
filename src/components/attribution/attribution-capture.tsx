"use client";

import { useEffect } from "react";

import { captureAttribution } from "@/lib/attribution/capture";

/** Mounts once in the root layout; renders nothing. */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
