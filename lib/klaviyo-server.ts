const KLAVIYO_REVISION = "2024-10-15";

type ProfileProps = Record<string, string | number | boolean | null | undefined>;

export async function trackKlaviyoEvent(
  email: string,
  metricName: string,
  properties?: ProfileProps
) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!apiKey) {
    return { ok: false as const, skipped: "not_configured" };
  }

  const body = {
    data: {
      type: "event",
      attributes: {
        profile: {
          data: {
            type: "profile",
            attributes: { email }
          }
        },
        metric: {
          data: {
            type: "metric",
            attributes: { name: metricName }
          }
        },
        properties: properties ?? {},
        time: new Date().toISOString()
      }
    }
  };

  try {
    const response = await fetch("https://a.klaviyo.com/api/events/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/vnd.api+json",
        revision: KLAVIYO_REVISION
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Klaviyo event error:", response.status, text);
      return { ok: false as const, error: text };
    }

    return { ok: true as const };
  } catch (err) {
    console.error("Klaviyo event fetch failed:", err);
    return { ok: false as const, error: String(err) };
  }
}

export async function upsertKlaviyoProfile(
  email: string,
  attrs: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    properties?: ProfileProps;
  }
) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  if (!apiKey) {
    return { ok: false as const, skipped: "not_configured" };
  }

  const body = {
    data: {
      type: "profile",
      attributes: {
        email,
        first_name: attrs.firstName,
        last_name: attrs.lastName,
        phone_number: attrs.phone,
        properties: attrs.properties ?? {}
      }
    }
  };

  try {
    const response = await fetch("https://a.klaviyo.com/api/profile-import/", {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${apiKey}`,
        "Content-Type": "application/vnd.api+json",
        revision: KLAVIYO_REVISION
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Klaviyo profile error:", response.status, text);
      return { ok: false as const, error: text };
    }

    return { ok: true as const };
  } catch (err) {
    console.error("Klaviyo profile fetch failed:", err);
    return { ok: false as const, error: String(err) };
  }
}

export async function onIntakeSubmitted(profile: {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  leadSource: string;
  targetExam: string;
  scoreRange: string;
  mainGoal: string;
  programInvestment: string;
  studentFirst: string;
  qualified: boolean;
}) {
  await upsertKlaviyoProfile(profile.email, {
    firstName: profile.firstName,
    lastName: profile.lastName,
    phone: profile.phone,
    properties: {
      lead_stage: profile.qualified ? "intake_submitted" : "lost",
      lead_source: profile.leadSource,
      target_exam: profile.targetExam,
      score_range: profile.scoreRange,
      main_goal: profile.mainGoal,
      program_investment: profile.programInvestment,
      student_first_name: profile.studentFirst
    }
  });

  return trackKlaviyoEvent(profile.email, "Intake Submitted", {
    lead_source: profile.leadSource,
    target_exam: profile.targetExam,
    qualified: profile.qualified
  });
}

export async function onEnrollmentCompleted(profile: {
  email: string;
  programLabel: string;
}) {
  await upsertKlaviyoProfile(profile.email, {
    properties: {
      lead_stage: "won",
      enrollment_status: "active",
      program_label: profile.programLabel
    }
  });

  return trackKlaviyoEvent(profile.email, "Enrollment Completed", {
    program_label: profile.programLabel
  });
}
