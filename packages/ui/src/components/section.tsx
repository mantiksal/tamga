/**
 * A card header. It carries the card's own left line and is closed by the
 * single rule weight used everywhere else.
 */
export function SectionHead({
  title,
  meta,
  mono = false,
  action,
}: {
  title: string;
  meta?: string;
  /**
   * set when the title is an identifier: a host, service or region TR: başlık bir
   * tanımlayıcıysa verin: bir sunucu, servis ya da bölge adı
   */
  mono?: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="tamga-head tamga-gutter tamga-section">
      <h3 className={`text-subhead font-semibold ${mono ? "font-mono text-control font-bold" : ""}`}>
        {title}
      </h3>
      {meta ? <span className="tamga-label">{meta}</span> : null}
      {action ? <div className="ml-auto flex items-center gap-2">{action}</div> : null}
    </div>
  );
}
