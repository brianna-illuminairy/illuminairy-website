import { landingPhotoSlots } from "@/lib/landing/assets";
import { LandingPhoto } from "./landing-photo";

type HeroMediaGridProps = {
  primary: {
    slotLabel: string;
    src: string | null | undefined;
    alt: string;
  };
  secondary: {
    slotLabel: string;
    src: string | null | undefined;
    alt: string;
  };
};

/** B3a-style dual portrait grid — shared so every LP variant feels equally premium. */
export function HeroMediaGrid({ primary, secondary }: HeroMediaGridProps) {
  return (
    <div className="grid-2 il-hero-media-grid">
      <LandingPhoto
        slotLabel={primary.slotLabel}
        src={primary.src}
        alt={primary.alt}
        aspect="tall"
        fill
        sizes="(max-width: 1023px) 45vw, 280px"
        className="tall"
        priority
      />
      <LandingPhoto
        slotLabel={secondary.slotLabel}
        src={secondary.src}
        alt={secondary.alt}
        aspect="tall"
        fill
        sizes="(max-width: 1023px) 45vw, 280px"
        className="tall"
        priority
      />
    </div>
  );
}

/** Default B3a hero pair (student + session). */
export function B3aHeroMediaGrid() {
  return (
    <HeroMediaGrid
      primary={{
        slotLabel: "lp-b3a-student.jpg",
        src: landingPhotoSlots.b3aHeroStudent,
        alt: "Child studying for the SAT"
      }}
      secondary={{
        slotLabel: "lp-b3a-session.jpg",
        src: landingPhotoSlots.b3aHeroSession,
        alt: "SAT tutor session online"
      }}
    />
  );
}
