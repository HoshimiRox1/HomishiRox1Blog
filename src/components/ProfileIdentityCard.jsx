// Profile 身份卡承担页面视觉重心，内容从 profile 数据读取。
import { useState } from "react";

// 渲染头像、名称和个人定位。
export default function ProfileIdentityCard({ profile }) {
  const [hasAvatarError, setHasAvatarError] = useState(false);

  return (
    <aside className="profile-identity-card profile-board-panel">
      <div className="profile-identity-card__meta">
        <span className="profile-pill profile-pill--profile">{profile.indexLabel}</span>
        <span className="profile-pill profile-pill--paper">{profile.handle}</span>
      </div>
      <div className="profile-avatar" aria-label={`${profile.displayName} avatar`}>
        {hasAvatarError ? (
          <span>???</span>
        ) : (
          <img
            alt=""
            src={profile.avatarSrc}
            onError={() => setHasAvatarError(true)}
          />
        )}
      </div>
      <h1 className="profile-identity-card__title">
        {profile.displayNameLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <p>{profile.identityCopy}</p>
    </aside>
  );
}
