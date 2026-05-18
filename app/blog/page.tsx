import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Parent-focused SAT notes from Illuminairy — pacing, digital SAT, and Georgia admissions context."
};

const posts = [
  {
    slug: "pacing-mistakes-that-cost-points",
    title: "Pacing mistakes that cost SAT points (especially on Module 2)",
    excerpt:
      "When practice scores look strong but test day disappoints, timing on the harder adaptive module is often the cause. Here is what parents can watch for.",
    date: "2026-05-18"
  }
];

export default function BlogIndexPage() {
  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Notes for Georgia parents."
        text="Short, practical posts on the digital SAT — with links to our free guides when you want a worksheet."
        primary={{ label: "Free guides", href: "/guides" }}
      />
      <section className="px-5 pb-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-3xl">
          <SectionHeader eyebrow="Latest" title="Posts" />
          <ul className="mt-10 grid gap-6">
            {posts.map((post) => (
              <li
                key={post.slug}
                className="rounded-2xl border border-line bg-ivory-50 p-7"
              >
                <time className="text-[12px] font-medium uppercase tracking-wider text-gold-deep">
                  {post.date}
                </time>
                <h3 className="mt-2 text-[1.25rem] font-semibold text-ink">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-gold-deep"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-4 inline-block text-[13.5px] font-semibold text-gold-deep hover:underline"
                >
                  Read more →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
