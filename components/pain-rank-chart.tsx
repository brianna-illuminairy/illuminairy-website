import {
  painRankBarPercent,
  painRankings,
  type PainRanking
} from "@/lib/pain-voice-quotes";
import { homePlatform } from "@/lib/site";

function formatMentions(n: number): string {
  return n.toLocaleString("en-US");
}

function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) {
    return <span className="pain-rank-badge pain-rank-badge--gold">1</span>;
  }
  if (rank === 2) {
    return <span className="pain-rank-badge pain-rank-badge--silver">2</span>;
  }
  if (rank === 3) {
    return <span className="pain-rank-badge pain-rank-badge--bronze">3</span>;
  }
  return <span className="pain-rank-badge">{rank}</span>;
}

function RankRow({ item }: { item: PainRanking }) {
  const width = painRankBarPercent(item.mentions);
  const topThree = item.rank <= 3;

  return (
    <li className={["pain-rank-row", topThree ? "pain-rank-row--top" : ""].join(" ")}>
      <RankBadge rank={item.rank} />
      <div className="pain-rank-body">
        <div className="pain-rank-label-row">
          <p className="pain-rank-label">{item.label}</p>
          <p className="pain-rank-count">
            <span className="sr-only">Mention count: </span>
            {formatMentions(item.mentions)}
          </p>
        </div>
        <div className="pain-rank-track" aria-hidden>
          <span
            className={[
              "pain-rank-bar",
              item.rank === 1 ? "pain-rank-bar--lead" : ""
            ].join(" ")}
            style={{ width: `${width}%` }}
          />
        </div>
      </div>
    </li>
  );
}

export function PainRankChart() {
  const { painVoice } = homePlatform;
  const totalMentions = painRankings.reduce((sum, p) => sum + p.mentions, 0);

  return (
    <div className="pain-rank-chart mx-auto mt-10 max-w-content">
      <div className="pain-rank-chart-header">
        <div>
          <p className="pain-rank-chart-eyebrow">{painVoice.rankTitle}</p>
          <p className="pain-rank-chart-sub">{painVoice.rankSubtitle}</p>
        </div>
        <p className="pain-rank-chart-total">
          <span className="pain-rank-chart-total-num">
            {formatMentions(totalMentions)}
          </span>
          <span className="pain-rank-chart-total-label">tagged pain mentions</span>
        </p>
      </div>

      <ol className="pain-rank-list" aria-label="Top customer pains by frequency">
        {painRankings.map((item) => (
          <RankRow key={item.id} item={item} />
        ))}
      </ol>

      <p className="pain-rank-footnote">
        Below: each pain paired with what changes after — real quotes on the left.
      </p>
    </div>
  );
}
