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
    const items = sections.map(([id]) => document.getElementById(id));
    function update() {
      const visible = items.filter((item) => item && item.getBoundingClientRect().top <= 155);
      const last = items.at(-1);
      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 3;
      setActive((atBottom ? last : visible.at(-1))?.id ?? "visao-geral");
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
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
