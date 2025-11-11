import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import AppShell from "./apps/shell/AppShell";
import Home from "./apps/shell/Home";
import tools from "./apps/shell/tools-registry";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppShell>
        <Suspense fallback={<div className="p-6">Cargando…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            {tools.map((t) => (<Route key={t.slug} path={`/${t.slug}`} element={<t.component />} />))}
          </Routes>
        </Suspense>
      </AppShell>
    </BrowserRouter>
  </React.StrictMode>
);
