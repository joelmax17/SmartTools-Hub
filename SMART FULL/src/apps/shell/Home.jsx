import { Link } from "react-router-dom";
import tools from "./tools-registry";
export default function Home(){
  return (<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {tools.map((t)=>(<Link key={t.slug} to={`/${t.slug}`} className="bg-panel p-5 rounded-xl border border-[color:var(--line)] hover:border-brand transition">
      <h2 className="text-xl font-semibold mb-2">{t.name}</h2><p className="opacity-75 text-sm">{t.description}</p></Link>))}
  </div>);
}
