import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface RechartsComponentProps {
  title: string;
  scheduleData?: {
    date: string;
    project: string;
    planned: number[];
    actual: number[];
  } | null;
}

export const RechartsComponent = ({ title, scheduleData }: RechartsComponentProps) => {
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

  // Recharts用のデータ形式に変換
  const chartData = Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    hour: i,
    planned: cumulativePlanned[i],
    actual: cumulativeActual[i],
  })).filter(d => d.hour >= xMin && d.hour <= xMax);

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
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis
              domain={[yMin === '' ? 'auto' : yMin, yMax === '' ? 'auto' : yMax]}
              label={{ value: 'Cumulative Hours', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="planned"
              stroke="#4BC0C0"
              strokeWidth={2}
              name="Cumulative Planned Hours"
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#FF6384"
              strokeWidth={2}
              name="Cumulative Actual Hours"
              dot={{ r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
