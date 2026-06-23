import Link from "next/link";
import type { PortalProfile } from "@/lib/portal/load-dashboard";

type Props = {
  profile: PortalProfile;
};

/** Header chip — navigates to full profile page (no dropdown). */
export function PortalProfileLink({ profile }: Props) {
  return (
    <Link
      href="/portal/profile"
      className="portal-profile__chip"
      aria-label={`Open profile for ${profile.studentName}`}
    >
      <span className="portal-profile__avatar" aria-hidden="true">
        {profile.studentInitials}
      </span>
      <span className="portal-profile__name">{profile.studentName}</span>
    </Link>
  );
}
