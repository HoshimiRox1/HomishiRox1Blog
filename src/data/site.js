// 站点静态数据是 Phase 1 页面、导航和角色系统的事实来源。
export const pages = [
  {
    id: "home",
    label: "Home",
    path: "/",
    color: "#D8CCFF",
    ink: "#111111",
    hoverInk: "#6B4DFF",
    title: "ROXY BLOG",
    description: "冷白底的首页海报。继续滚轮，角色会从右侧舞台进入。",
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    color: "#B9F5FF",
    ink: "#111111",
    hoverInk: "#1494AB",
    title: "PROFILE",
    description: "个人档案卡、喜好、联系方式和 GitHub 会在后续阶段展开。",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    path: "/portfolio",
    color: "#FFE7A6",
    ink: "#111111",
    hoverInk: "#A07400",
    title: "PORTFOLIO",
    description: "后续会在这里实现作品滚动擦除切换。",
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    color: "#C7F2D4",
    ink: "#111111",
    hoverInk: "#2D7B4D",
    title: "BLOG",
    description: "四个收藏板块会从这里进入。",
    sections: ["博客笔记", "番剧记录", "电影记录", "游戏记录"],
  },
];

export const characters = [
  {
    id: "colletta",
    name: "珂莱塔",
    title: "Colletta enters the poster frame.",
    accent: "#FFD6E8",
    image: new URL("../../waifus/珂莱塔-cutout.png", import.meta.url).href,
  },
  {
    id: "roxy",
    name: "洛琪希",
    title: "Roxy keeps the stage awake.",
    accent: "#D7FFF1",
    image: new URL("../../waifus/洛琪希-cutout.png", import.meta.url).href,
  },
];

export const marqueeText =
  "ROXY BLOG / FRESH BRUTALIST STAGE / HOME / PROFILE / PORTFOLIO / BLOG /";
