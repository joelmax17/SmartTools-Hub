import Sidebar from "./Sidebar";
export default function AppShell({ children }) {
  return (<div className="flex h-screen w-screen"><Sidebar /><div className="flex-1 overflow-auto p-6">{children}</div></div>);
}
