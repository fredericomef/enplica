"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from "recharts";

import { ENPLICA_AREAS } from "@/domain/diagnostic/enplica.config";

import type { AreaResult } from "@/domain/diagnostic/diagnostic.types";

interface DiagnosticRadarChartProps {
  areas: AreaResult[];
}

function getLevel(score: number) {
  if (score >= 7) return "saudavel";
  if (score >= 4) return "atencao";
  return "tratar";
}

function getLevelColor(score: number) {
  const level = getLevel(score);

  if (level === "saudavel") return "#22C55E";
  if (level === "atencao") return "#FACC15";
  return "#EF4444";
}

export function DiagnosticRadarChart({
  areas,
}: DiagnosticRadarChartProps) {
  const data = areas.map((areaResult) => {
    const area = ENPLICA_AREAS.find(
      (item) => item.id === areaResult.areaId,
    );

    return {
      subject: areaResult.areaId,
      fullName: area?.name ?? areaResult.areaId,
      score: Number(areaResult.score),
      fullMark: 9,
      level: getLevel(Number(areaResult.score)),
    };
  });

  if (!data.length) {
    return (
      <div className="flex h-[440px] w-full items-center justify-center text-white/50">
        Dados do diagnóstico indisponíveis.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="h-[440px] w-full min-w-0">
        <ResponsiveContainer
          width="100%"
          height="100%"
          minWidth={300}
          minHeight={360}
        >
          <RadarChart
            data={data}
            cx="50%"
            cy="50%"
            outerRadius="68%"
          >
            <PolarGrid
              stroke="rgba(255,255,255,0.14)"
            />

            <PolarAngleAxis
              dataKey="subject"
              tick={({ x, y, payload }) => {
                const item = data.find(
                  (entry) => entry.subject === payload.value,
                );

                const score = item?.score ?? 0;
                const color = getLevelColor(score);

                return (
                  <text
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={color}
                    fontSize={14}
                    fontWeight={700}
                  >
                    {payload.value} {score}
                  </text>
                );
              }}
            />

            <PolarRadiusAxis
              angle={90}
              domain={[0, 9]}
              tick={false}
              axisLine={false}
            />

            <Radar
              name="ENPLICA"
              dataKey="score"
              stroke="#00B8FF"
              fill="#00B8FF"
              fillOpacity={0.18}
              strokeWidth={2.5}
              dot={({ cx, cy, payload }) => {
                const color = getLevelColor(payload.score);

                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={6}
                    fill={color}
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                );
              }}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-green-500" />
          <span className="text-white/80">
            Saudável <span className="text-white/50">7–9</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
          <span className="text-white/80">
            Atenção <span className="text-white/50">4–6</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <span className="text-white/80">
            Tratar <span className="text-white/50">0–3</span>
          </span>
        </div>
      </div>

      <p className="mt-3 text-center text-sm text-white/50">
        Quanto mais próximo da borda, mais saudável está a área.
      </p>
    </div>
  );
}