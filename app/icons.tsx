import type { ReactNode } from "react";

const paths: Record<string, ReactNode> = {
  pulse: <path d="M2 13h4l3.5-8 4.5 14 3.5-9 2 3H22" />,
  activity: (
    <>
      <path d="M3 18V6m0 12h18M7 14l3-4 3 2 6-7" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5.5" rx="8" ry="3.5" />
      <path d="M4 5.5v12c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5v-12M4 11.5c0 2 3.6 3.5 8 3.5s8-1.5 8-3.5" />
    </>
  ),
  drive: (
    <>
      <path d="m5 5-3 9v5h20v-5l-3-9H5Zm-3 9h20M6 17h.1m3 0h.1" />
    </>
  ),
  star: <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9L12 3Z" />,
  fork: (
    <>
      <circle cx="6" cy="5" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <circle cx="12" cy="19" r="2.5" />
      <path d="M6 7.5v1a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-1M12 12.5v4" />
    </>
  ),
  branch: (
    <>
      <circle cx="7" cy="5" r="2.5" />
      <circle cx="7" cy="19" r="2.5" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M7 7.5v9M7 15c5 0 10-1 10-4.5" />
    </>
  ),
  book: (
    <>
      <path d="M5 4a2 2 0 0 1 2-2h12v19H7a2 2 0 0 1-2-2V4Zm0 15a2 2 0 0 1 2-2h12M9 5h5" />
    </>
  ),
  arrow: <path d="M6 18 18 6M7 6h11v11" />,
  github: (
    <path
      fill="currentColor"
      stroke="none"
      d="M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.76-.24.76-.54v-2.08c-3.1.68-3.76-1.32-3.76-1.32-.51-1.29-1.25-1.63-1.25-1.63-1.02-.7.08-.68.08-.68 1.12.08 1.72 1.15 1.72 1.15 1 .71 1.78 1.25 3.25.87.1-.73.39-1.23.71-1.51-2.48-.29-5.09-1.24-5.09-5.53 0-1.22.44-2.22 1.16-3-.12-.28-.5-1.42.11-2.96 0 0 .95-.3 3.08 1.15a10.6 10.6 0 0 1 5.6 0c2.13-1.45 3.07-1.15 3.07-1.15.62 1.54.24 2.68.12 2.96.72.78 1.15 1.78 1.15 3 0 4.3-2.61 5.24-5.1 5.52.4.35.76 1.03.76 2.08v3.13c0 .3.2.65.77.54A11.2 11.2 0 0 0 12 .8Z"
    />
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  history: (
    <>
      <path d="M3 11a9 9 0 1 1 2 7M3 5v6h6M12 7v5l3 2" />
    </>
  ),
  back: <path d="m14.5 6-6 6 6 6" />,
  next: <path d="m9.5 6 6 6-6 6" />,
  download: (
    <>
      <path d="M12 3v12m-5-5 5 5 5-5M4 15v5h16v-5" />
    </>
  ),
  commit: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M2 12h6m8 0h6" />
    </>
  ),
  bot: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="3" />
      <path d="M12 3v4m-4 6h.1m7.9 0h.1M9 16h6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M7 3v4m10-4v4M3 10h18" />
    </>
  ),
};
export default function Icon({ name, size = 16 }: { name: keyof typeof paths; size?: number }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}
