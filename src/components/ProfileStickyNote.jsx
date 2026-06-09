// Profile 贴纸只负责渲染单张便签，不保存拖动状态。
export default function ProfileStickyNote({ note, layout, dragProps = {} }) {
  return (
    <article
      className={`profile-note profile-note--${note.size} profile-board-panel`}
      data-note-id={note.id}
      style={{
        "--note-left": layout?.style["--note-left"],
        "--note-top": layout?.style["--note-top"],
        "--note-width": layout?.style["--note-width"],
        "--note-min-height": layout?.style["--note-min-height"],
        "--note-rotate": layout?.style["--note-rotate"],
        "--note-color": layout?.style["--note-color"],
        "--note-tone": note.tone,
        ...dragProps.style,
      }}
      {...dragProps.handlers}
    >
      <span className="profile-note__kicker">{note.kicker}</span>
      <h2>{note.title}</h2>
      {note.body ? <p>{note.body}</p> : null}
      {note.tags ? (
        <ul className="profile-note__tags" aria-label={`${note.kicker} tags`}>
          {note.tags.map((tag) => (
            <li className={`profile-pill profile-pill--${note.tone}`} key={tag}>
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
      {note.links ? (
        <div className="profile-note__links">
          {note.links.map((link) => (
            <a
              className={`profile-pill profile-pill--${note.tone}`}
              key={link.label}
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      ) : null}
    </article>
  );
}
