import { useState } from 'react';
import ReactECharts from 'echarts-for-react';

interface EChartsComponentProps {
  title: string;
  scheduleData?: {
    date: string;
    project: string;
    planned: number[];
    actual: number[];
  } | null;
}

export const EChartsComponent = ({ title, scheduleData }: EChartsComponentProps) => {
  const defaultPlanned = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0];
  const defaultActual = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1.5, 2, 1, 0.5, 2, 1.5, 1, 0, 0, 0, 0, 0, 0, 0];

  const plannedData = scheduleData?.planned || defaultPlanned;
  const actualData = scheduleData?.actual || defaultActual;

  // 軸の範囲設定
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(23);
  const [yMin, setYMin] = useState<number | ''>('');
  const [yMax, setYMax] = useState<number | ''>('');

  // 累積データに変換
  const cumulativePlanned = plannedData.reduce((acc: number[], value, index) => {
    acc.push(index === 0 ? value : acc[index - 1] + value);
    return acc;
  }, []);

  const cumulativeActual = actualData.reduce((acc: number[], value, index) => {
    acc.push(index === 0 ? value : acc[index - 1] + value);
    return acc;
  }, []);

  const option = {
    tooltip: {
      trigger: 'axis',
    },
    legend: {
      data: ['Cumulative Planned Hours', 'Cumulative Actual Hours'],
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      name: 'Time',
      nameLocation: 'middle',
      nameGap: 30,
      data: Array.from({ length: 24 }, (_, i) => `${i}:00`),
      min: xMin,
      max: xMax,
    },
    yAxis: {
      type: 'value',
      name: 'Cumulative Hours',
      min: yMin === '' ? undefined : yMin,
      max: yMax === '' ? undefined : yMax,
    },
    series: [
      {
        name: 'Cumulative Planned Hours',
        type: 'line',
        data: cumulativePlanned,
        smooth: true,
        lineStyle: {
          color: '#4BC0C0',
          width: 2,
        },
        itemStyle: {
          color: '#4BC0C0',
        },
        areaStyle: {
          color: 'rgba(75, 192, 192, 0.2)',
        },
      },
      {
        name: 'Cumulative Actual Hours',
        type: 'line',
        data: cumulativeActual,
        smooth: true,
        lineStyle: {
          color: '#FF6384',
          width: 2,
        },
        itemStyle: {
          color: '#FF6384',
        },
        areaStyle: {
          color: 'rgba(255, 99, 132, 0.2)',
        },
      },
    ],
  };

  return (
    <div className="grid-item">
      <div className="drag-handle" title="Drag to move"></div>
      <h3>
        {title}
        {scheduleData && (
          <span style={{ fontSize: '14px', color: '#666', marginLeft: '8px' }}>
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
              onChange={(e) => setYMin(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Auto"
            />
            <span>-</span>
            <input
              type="number"
              min="0"
              value={yMax}
              onChange={(e) => setYMax(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Auto"
            />
          </div>
        </div>
      </div>

      <div className="chart-container">
        <ReactECharts option={option} style={{ height: '100%', width: '100%' }} />
      </div>
    </div>
  );
};
