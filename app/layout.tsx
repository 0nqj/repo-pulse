import type { Metadata } from "next";
import Icon from "./icons";
import Nav from "./nav";
import { repoUrl } from "./dashboard-data";
import "./globals.css";

const repositoryName = process.env.GITHUB_REPOSITORY?.split("/")[1];
const basePath =
  process.env.GITHUB_ACTIONS === "true" && repositoryName && !repositoryName.endsWith(".github.io")
    ? `/${repositoryName}`
    : "";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: "Repo Pulse — métricas reais do repositório",
  description: "Painel público de telemetria do repositório, atualizado por uma automação transparente.",
  icons: { icon: `${basePath}/icon.svg` },
  openGraph: {
    title: "Repo Pulse",
    description: "Métricas reais. Automação transparente.",
    images: [`${basePath}/og.png`],
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repo Pulse",
    description: "Métricas reais. Automação transparente.",
    images: [`${basePath}/og.png`],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <a className="skip-link" href="#conteudo">
          Pular para o painel
        </a>
        <header className="topbar">
          <div className="shell header-inner">
            <a href={basePath + "/"} className="brand" aria-label="Repo Pulse, início">
              <span className="brand-mark">
                <Icon name="pulse" size={23} />
              </span>
              Repo Pulse
            </a>
            <Nav basePath={basePath} />
            {repoUrl && (
              <a className="github-button" href={repoUrl}>
                <Icon name="github" size={15} />
                GitHub
                <Icon name="arrow" size={12} />
              </a>
            )}
          </div>
        </header>
        <main className="shell" id="conteudo" tabIndex={-1}>
          {children}
        </main>
        <footer className="shell">
          <span>
            <Icon name="pulse" size={16} />
            Repo Pulse
          </span>
          <span>Horários de São Paulo · UTC−03</span>
        </footer>
      </body>
    </html>
  );
}
