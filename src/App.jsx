// App 保持轻量，真正的全站骨架由 AppShell 常驻管理。
import AppShell from "./components/AppShell";

// 渲染 Roxy Blog 的 Phase 1 应用。
export default function App() {
  return <AppShell />;
}
