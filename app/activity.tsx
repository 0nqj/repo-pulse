"use client";

import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Icon from "./icons";
import { formatDay, number, type Day } from "./telemetry";

const periods = [7, 30, 90] as const;
export default function Activity({ days, hasData }: { days: Day[]; hasData: boolean }) {
  const [period, setPeriod] = useState<number>(30);
  const [selected, setSelected] = useState<number | null>(null);
  const plot = useRef<HTMLDivElement>(null);
  const data = days.slice(-period);
  const index = selected ?? data.length - 1;
  const current = data[index];
  const total = data.reduce((sum, day) => sum + day.count, 0);
  const max = Math.max(1, ...data.map((day) => day.count));
  const step = Math.max(1, Math.ceil(max / 4));
  const ceiling = Math.max(step * 2, Math.ceil(max / step) * step);
  const ticks = Array.from({ length: ceiling / step + 1 }, (_, i) => ceiling - i * step);

  function move(event: KeyboardEvent<HTMLButtonElement>, position: number) {
    const target = { ArrowRight: position + 1, ArrowLeft: position - 1, Home: 0, End: data.length - 1 }[
      event.key
    ];
    if (target === undefined) return;
    event.preventDefault();
    const next = Math.min(data.length - 1, Math.max(0, target));
    plot.current?.querySelectorAll("button")[next]?.focus();
  }

  return (
    <section className="panel chart-panel" aria-labelledby="chart-title">
      <div className="panel-head">
        <h2 id="chart-title">
          <Icon name="activity" />
          Atividade de coleta
        </h2>
        <div className="periods" role="group" aria-label="Período do gráfico">
          {periods.map((value) => (
            <button
              key={value}
              aria-label={`${value} dias`}
              aria-pressed={value === period}
              onClick={() => {
                setPeriod(value);
                setSelected(null);
              }}
            >
              {value}d
            </button>
          ))}
        </div>
      </div>
      {hasData ? (
        <>
          <div className="chart-summary">
            <strong>{number(total)}</strong>
            <span>coletas no período</span>
          </div>
          <div className="chart" aria-label="Coletas por dia">
            <div className="y-axis" aria-hidden="true">
              {ticks.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="plot">
              <div className="grid-lines" aria-hidden="true">
                {ticks.map((t) => (
                  <i key={t} />
                ))}
              </div>
              <div
                className={`bars range-${period}`}
                ref={plot}
                role="group"
                aria-label="Leituras por dia. Use as setas para navegar."
              >
                {data.map((day, i) => (
                  <button
                    key={day.date}
                    type="button"
                    tabIndex={i === index ? 0 : -1}
                    aria-label={`${formatDay(day.date)}, ${day.count} ${day.count === 1 ? "coleta" : "coletas"}`}
                    className={i === index ? "selected" : ""}
                    onPointerEnter={(event) => {
                      if (event.pointerType === "mouse") setSelected(i);
                    }}
                    onClick={() => setSelected(i)}
                    onFocus={() => setSelected(i)}
                    onKeyDown={(event) => move(event, i)}
                  >
                    {day.count > 0 && <i style={{ height: (100 * day.count) / ceiling + "%" }} />}
                  </button>
                ))}
              </div>
            </div>
            <div className="x-axis" aria-hidden="true">
              {[0, 0.25, 0.5, 0.75, 1].map((part) => (
                <span key={part}>{formatDay(data[Math.round((data.length - 1) * part)].date)}</span>
              ))}
            </div>
          </div>
          <div className="chart-foot">
            <span>
              <i className="legend-square" />
              Coletas por dia
            </span>
            <span className="mono">
              {formatDay(current.date)}
              <b>·</b>
              {current.count} {current.count === 1 ? "coleta" : "coletas"}
            </span>
          </div>
        </>
      ) : (
        <p className="empty">O gráfico aparecerá após a primeira coleta.</p>
      )}
    </section>
  );
}
