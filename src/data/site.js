// 站点静态数据是 Phase 1 页面、导航和角色系统的事实来源。
export const pages = [
  {
    id: "home",
    label: "Home",
    path: "/",
    color: "#FBF5E7",
    ink: "#090909",
    title: "ROXY BLOG",
    description: "高对比个人主页骨架。继续滚轮，角色会从右侧舞台进入。",
  },
  {
    id: "profile",
    label: "Profile",
    path: "/profile",
    color: "#E30613",
    ink: "#FBF5E7",
    title: "PROFILE",
    description: "个人档案卡、喜好、联系方式和 GitHub 将在后续阶段展开。",
  },
  {
    id: "portfolio",
    label: "Portfolio",
    path: "/portfolio",
    color: "#FFCC00",
    ink: "#090909",
    title: "PORTFOLIO",
    description: "后续会在这里实现作品滚动擦除切换。",
  },
  {
    id: "blog",
    label: "Blog",
    path: "/blog",
    color: "#0047AB",
    ink: "#FBF5E7",
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
    accent: "#E30613",
    image: new URL("../../waifus/珂莱塔-cutout.png", import.meta.url).href,
  },
  {
    id: "roxy",
    name: "洛琪希",
    title: "Roxy keeps the stage awake.",
    accent: "#0047AB",
    image: new URL("../../waifus/洛琪希-cutout.png", import.meta.url).href,
  },
];

export const marqueeText =
  "ROXY BLOG / ANIME ENERGY / NOTES / PORTFOLIO / BGM ON DEMAND /";
