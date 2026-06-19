import { displaySerif, dmMono, hankenGrotesk } from "@/lib/funnel-fonts";

export default function DataVizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${displaySerif.variable} ${hankenGrotesk.variable} ${dmMono.variable}`}>
      {children}
    </div>
  );
}
