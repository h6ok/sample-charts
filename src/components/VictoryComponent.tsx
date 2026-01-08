import { useState } from 'react';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLegend,
  VictoryTooltip,
  VictoryVoronoiContainer,
} from 'victory';

interface VictoryComponentProps {
  title: string;
  scheduleData?: {
    date: string;
    project: string;
    planned: number[];
    actual: number[];
  } | null;
}

export const VictoryComponent = ({ title, scheduleData }: VictoryComponentProps) => {
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

  // Victory用のデータ形式に変換
  const plannedChartData = cumulativePlanned.map((value, index) => ({
    x: index,
    y: value,
    label: `${index}:00 - ${value.toFixed(1)}h`,
  }));

  const actualChartData = cumulativeActual.map((value, index) => ({
    x: index,
    y: value,
    label: `${index}:00 - ${value.toFixed(1)}h`,
  }));

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
        <VictoryChart
          theme={VictoryTheme.material}
          width={800}
          height={320}
          containerComponent={<VictoryVoronoiContainer />}
        >
          <VictoryLegend
            x={100}
            y={10}
            orientation="horizontal"
            gutter={20}
            data={[
              { name: 'Cumulative Planned Hours', symbol: { fill: '#4BC0C0' } },
              { name: 'Cumulative Actual Hours', symbol: { fill: '#FF6384' } },
            ]}
          />
          <VictoryAxis
            label="Time"
            style={{
              axisLabel: { padding: 30 },
            }}
            domain={[xMin, xMax]}
            tickFormat={(t: number) => `${t}:00`}
          />
          <VictoryAxis
            dependentAxis
            label="Cumulative Hours"
            style={{
              axisLabel: { padding: 40 },
            }}
            domain={yMin === '' && yMax === '' ? undefined : [yMin === '' ? 0 : yMin, yMax === '' ? 20 : yMax]}
          />
          <VictoryLine
            data={plannedChartData}
            style={{
              data: { stroke: '#4BC0C0', strokeWidth: 2 },
            }}
            labelComponent={<VictoryTooltip />}
          />
          <VictoryLine
            data={actualChartData}
            style={{
              data: { stroke: '#FF6384', strokeWidth: 2 },
            }}
            labelComponent={<VictoryTooltip />}
          />
        </VictoryChart>
      </div>
    </div>
  );
};
