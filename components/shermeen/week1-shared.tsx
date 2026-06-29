export function SlideEmbed({ title, src }: { title: string; src: string }) {
  const embedSrc = `${src}?embed=1`;

  return (
    <div className="shermeen-week1__slides-block">
      <h4 className="shermeen-week1__slides-title">{title}</h4>
      <iframe src={embedSrc} title={title} className="shermeen-week1__slide-frame" />
    </div>
  );
}
