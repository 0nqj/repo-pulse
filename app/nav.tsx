"use client";

import { useEffect, useState } from "react";
const sections = [
  ["visao-geral", "Visão geral"],
  ["historico", "Histórico"],
  ["automacao", "Automação"],
];
export default function Nav() {
  const [active, setActive] = useState("visao-geral");
  useEffect(() => {
    const items = sections.map(([id]) => document.getElementById(id)).filter((item) => item !== null);
    function update() {
      const root = document.documentElement;
      const limit = root.scrollHeight - window.innerHeight;
      const offset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
      const target = items.find((item) => "#" + item.id === window.location.hash);
      const atBottom = window.scrollY >= limit - 1;
      // Várias âncoras podem chegar à mesma posição no fim de uma tela alta.
      if (atBottom && target && (limit <= 1 || target.getBoundingClientRect().top >= offset - 1)) {
        setActive(target.id);
        return;
      }
      const visible = items.filter((item) => item.getBoundingClientRect().top <= offset + 1);
      const current = atBottom && limit > 1 ? items.at(-1) : visible.at(-1);
      setActive(current?.id ?? "visao-geral");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      window.removeEventListener("hashchange", update);
    };
  }, []);
  return (
    <nav aria-label="Navegação do painel">
      {sections.map(([id, label]) => (
        <a key={id} href={"#" + id} aria-current={active === id ? "location" : undefined}>
          {label}
        </a>
      ))}
    </nav>
  );
}
