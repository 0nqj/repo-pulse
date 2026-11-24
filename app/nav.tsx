"use client";

import { useSelectedLayoutSegment } from "next/navigation";
import { useEffect } from "react";

const pages = [
  { segment: null, label: "Visão geral" },
  { segment: "historico", label: "Histórico" },
  { segment: "automacao", label: "Automação" },
];

function pageUrl(basePath: string, segment: string | null) {
  return segment ? `${basePath}/${segment}/` : `${basePath}/`;
}

export default function Nav({ basePath }: { basePath: string }) {
  const current = useSelectedLayoutSegment();

  useEffect(() => {
    if (current !== null) return;
    function openLegacyLink() {
      const fragment = window.location.hash.slice(1);
      const target = pages.find(({ segment }) => (segment ?? "visao-geral") === fragment);
      if (target) window.location.replace(pageUrl(basePath, target.segment) + window.location.search);
    }
    openLegacyLink();
    window.addEventListener("hashchange", openLegacyLink);
    return () => window.removeEventListener("hashchange", openLegacyLink);
  }, [basePath, current]);

  return (
    <nav aria-label="Navegação do painel">
      {pages.map(({ segment, label }) => (
        <a
          key={label}
          href={pageUrl(basePath, segment)}
          aria-current={segment === current ? "page" : undefined}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
