/**
 * Optional founder/expert clip for INT2 (`gpa-paradox`).
 * Set NEXT_PUBLIC_SATPLAN_INT2_VIDEO_URL when the asset is hosted (Mux, Vimeo, etc.).
 */
export const INT2_EXPERT_MEDIA = {
  title: "Why smart kids score low on the SAT",
  durationLabel: "2 min",
  videoSrc: process.env.NEXT_PUBLIC_SATPLAN_INT2_VIDEO_URL?.trim() ?? "",
  posterSrc: "/satplan/int2/expert-video-poster.jpg"
} as const;

export function int2ExpertVideoShipped(): boolean {
  return INT2_EXPERT_MEDIA.videoSrc.length > 0;
}
