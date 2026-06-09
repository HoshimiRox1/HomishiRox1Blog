// 章节封面复用 Phase 1 占位页的纯色大标题舞台感。
export default function SectionCover({
  className = "",
  description,
  index,
  rootRef,
  sections,
  title,
}) {
  const coverClassName = ["placeholder-page", "section-cover", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={coverClassName} ref={rootRef}>
      <div className="placeholder-content">
        <p className="placeholder-index">{index}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        {sections ? (
          <ul className="blog-sections">
            {sections.map((section) => (
              <li key={section}>{section}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
