import { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ApexChartsComponentProps {
  title: string;
  scheduleData?: {
    date: string;
    project: string;
    planned: number[];
    actual: number[];
  } | null;
}

export const ApexChartsComponent = ({
  title,
  scheduleData,
}: ApexChartsComponentProps) => {
  const defaultPlanned = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0,
  ];
  const defaultActual = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1.5, 2, 1, 0.5, 2, 1.5, 1, 0, 0, 0, 0, 0, 0,
    0,
  ];

  const plannedData = scheduleData?.planned || defaultPlanned;
  const actualData = scheduleData?.actual || defaultActual;

  // 軸の範囲設定
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(23);
  const [yMin, setYMin] = useState<number | "">("");
  const [yMax, setYMax] = useState<number | "">("");

  // 累積データに変換
  const cumulativePlanned = useMemo(
    () =>
      plannedData.reduce((acc: number[], value, index) => {
        acc.push(index === 0 ? value : acc[index - 1] + value);
        return acc;
      }, []),
    [plannedData],
  );

  const cumulativeActual = useMemo(
    () =>
      actualData.reduce((acc: number[], value, index) => {
        acc.push(index === 0 ? value : acc[index - 1] + value);
        return acc;
      }, []),
    [actualData],
  );

  const series = [
    {
      name: "Cumulative Planned Hours",
      data: cumulativePlanned,
    },
    {
      name: "Cumulative Actual Hours",
      data: cumulativeActual,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: true,
      },
      animations: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "straight",
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
    },
    xaxis: {
      categories: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      title: {
        text: "Time",
      },
      min: xMin,
      max: xMax,
    },
    yaxis: {
      title: {
        text: "Cumulative Hours",
      },
      min: yMin === "" ? undefined : yMin,
      max: yMax === "" ? undefined : yMax,
    },
    tooltip: {
      enabled: true,
      shared: true,
      intersect: false,
      followCursor: false,
      fixed: {
        enabled: true,
        position: "topRight",
      },
      y: {
        formatter: (value: number) => `${value.toFixed(1)} hours`,
      },
    },
  };

  return (
    <div className="grid-item" style={{ overflow: "visible" }}>
      <div className="drag-handle" title="Drag to move"></div>
      <h3>
        {title}
        {scheduleData && (
          <span style={{ fontSize: "14px", color: "#666", marginLeft: "8px" }}>
            - {scheduleData.date} ({scheduleData.project})
          </span>
        )}
      </h3>

      <div className="axis-controls">
        <div className="axis-control-group">
          <label>X-axis (Time):</label>
          <div className="range-inputs">
            <input
              type="number"
              min="0"
              max="23"
              value={xMin}
              onChange={(e) => setXMin(Number(e.target.value))}
              placeholder="Min"
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              max="23"
              value={xMax}
              onChange={(e) => setXMax(Number(e.target.value))}
              placeholder="Max"
            />
          </div>
        </div>

        <div className="axis-control-group">
          <label>Y-axis (Hours):</label>
          <div className="range-inputs">
            <input
              type="number"
              min="0"
              value={yMin}
              onChange={(e) =>
                setYMin(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Auto"
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              value={yMax}
              onChange={(e) =>
                setYMax(e.target.value === "" ? "" : Number(e.target.value))
              }
              placeholder="Auto"
            />
          </div>
        </div>
      </div>

      <div className="chart-container" style={{ overflow: "visible" }}>
        <Chart
          options={options}
          series={series}
          type="line"
          height="100%"
          width="100%"
        />
      </div>
    </div>
  );
};
