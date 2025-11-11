import { Link, useLocation } from "react-router-dom";
import tools from "./tools-registry";
export default function Sidebar(){
  const { pathname } = useLocation();
  return (<aside className="w-64 bg-panel border-r border-[color:var(--line)] p-4 overflow-y-auto hidden md:block">
    <h1 className="text-2xl font-bold mb-6">SmartTools Hub</h1>
    <nav className="flex flex-col gap-2">
      <Link to="/" className={`px-3 py-2 rounded-md text-sm ${pathname === "/" ? "bg-[#1a2240]" : "bg-[#11172b] hover:bg-[#1a2240]"}`}>Inicio</Link>
      {tools.map((t)=>(<Link key={t.slug} to={`/${t.slug}`} className={`px-3 py-2 rounded-md text-sm ${pathname === "/"+t.slug ? "bg-[#1a2240]" : "bg-[#11172b] hover:bg-[#1a2240]"}`}>{t.name}</Link>))}
    </nav>
  </aside>);
}
