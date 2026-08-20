"use client";

import dynamic from "next/dynamic";

const ActivityChart = dynamic(() => import("./activity-chart"), { ssr: false });

interface Props {
  data: { date: string; count: number }[];
}

export default function ActivityChartWrapper({ data }: Props) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <ActivityChart data={data} />
    </div>
  );
}
