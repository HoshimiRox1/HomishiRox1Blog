// Profile 页面编排章节封面与 Sticky Board，不直接维护具体文案。
import { useRef, useState } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { profile } from "../data/profile";
import ProfileIdentityCard from "./ProfileIdentityCard";
import ProfileStickyNote from "./ProfileStickyNote";
import SectionCover from "./SectionCover";
import { useDraggableNotes } from "./useDraggableNote";
import { resolveProfileNoteLayout } from "../utils/profileLayout";
import { PROFILE_DESKTOP_RESPONSIVE_VARS } from "../utils/profileResponsive";

gsap.registerPlugin(useGSAP);

// 渲染 Profile 的封面阶段和白板阶段。
export default function ProfilePage() {
  const [isBoardVisible, setIsBoardVisible] = useState(false);
  const pageRef = useRef(null);
  const whiteboardRef = useRef(null);
  const { getDragProps } = useDraggableNotes(whiteboardRef);
  const resolvedNoteLayout = resolveProfileNoteLayout(profile.notes);

  useGSAP(
    () => {
      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (!isBoardVisible) {
        gsap.fromTo(
          ".placeholder-content",
          { autoAlpha: 0, y: 28 },
          {
            autoAlpha: 1,
            y: 0,
            duration: reduceMotion ? 0 : 0.62,
            ease: "power3.out",
          },
        );
        return;
      }

      gsap.fromTo(
        ".profile-board-panel",
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          duration: reduceMotion ? 0 : 0.58,
          ease: "power3.out",
          stagger: reduceMotion ? 0 : 0.06,
        },
      );
    },
    { scope: pageRef, dependencies: [isBoardVisible] },
  );

  // 首次滚动或上滑从封面进入白板。
  function revealBoard(event) {
    if (isBoardVisible) {
      return;
    }

    if ("deltaY" in event && Math.abs(event.deltaY) < 8) {
      return;
    }

    setIsBoardVisible(true);
  }

  return (
    <section
      className={`profile-page ${
        isBoardVisible ? "profile-page--board" : "profile-page--cover"
      }`}
      onTouchMove={revealBoard}
      onWheel={revealBoard}
      ref={pageRef}
    >
      {isBoardVisible ? (
        <div className="profile-board" style={PROFILE_DESKTOP_RESPONSIVE_VARS}>
          <section className="profile-whiteboard" ref={whiteboardRef}>
            <div className="profile-board-title">
              PROFILE
              <br />
              BOARD
            </div>
            <div className="profile-board-hint">DRAG NOTES / HOVER TILT</div>
            <ProfileIdentityCard profile={profile} />
            <div className="profile-note-field">
              {profile.notes.map((note) => {
                const layout = resolvedNoteLayout.find((item) => item.id === note.id);

                return (
                  <ProfileStickyNote
                    dragProps={getDragProps(note.id)}
                    key={note.id}
                    layout={layout}
                    note={note}
                  />
                );
              })}
            </div>
            <div className="profile-board-footer">
              {profile.footerTags.map((tag) => (
                <span className="profile-pill profile-pill--profile" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <SectionCover
          className="profile-cover"
          description={profile.cover.description}
          index="02"
          title={profile.cover.title}
        />
      )}
    </section>
  );
}
