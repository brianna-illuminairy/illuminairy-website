import {
  INT2_EXPERT_MEDIA,
  int2ExpertVideoShipped
} from "@/lib/sat-plan-funnel/int2-expert-media";

type Int2ExpertVideoProps = {
  title?: string;
};

export function Int2ExpertVideo({ title = INT2_EXPERT_MEDIA.title }: Int2ExpertVideoProps) {
  if (!int2ExpertVideoShipped()) {
    return null;
  }

  return (
    <div className="int2-expert-video quiz-step-trust-graphic">
      <div className="quiz-step-trust-card int2-expert-video__card">
        <p className="int2-expert-video__meta">
          <span className="int2-expert-video__play" aria-hidden="true">
            ▶
          </span>
          {INT2_EXPERT_MEDIA.durationLabel} · SAT program lead
        </p>
        <video
          className="int2-expert-video__player"
          controls
          playsInline
          preload="metadata"
          poster={INT2_EXPERT_MEDIA.posterSrc}
          aria-label={title}
        >
          <source src={INT2_EXPERT_MEDIA.videoSrc} />
          <track kind="captions" />
        </video>
      </div>
    </div>
  );
}
