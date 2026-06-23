import posthog from "posthog-js";
import {
  getPostHogKey,
  getPostHogUiHost,
  POSTHOG_PROXY_PATH
} from "@/lib/posthog";

const key = getPostHogKey();

if (key) {
  posthog.init(key, {
    api_host: POSTHOG_PROXY_PATH,
    ui_host: getPostHogUiHost(),
    person_profiles: "identified_only",
    capture_pageview: false,
    capture_pageleave: true,
    capture_performance: {
      web_vitals: true
    },
    disable_session_recording: true,
    session_recording: {
      maskAllInputs: true,
      maskInputOptions: {
        password: true,
        email: true,
        tel: true
      }
    },
    defaults: "2026-01-30"
  });
}
