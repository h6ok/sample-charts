import { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartComponentProps {
  title: string;
  scheduleData?: {
    date: string;
    project: string;
    planned: number[];
    actual: number[];
  } | null;
}

export const ChartComponent = ({ title, scheduleData }: ChartComponentProps) => {
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

  const lineData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [
      {
        label: 'Cumulative Planned Hours',
        data: cumulativePlanned,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Cumulative Actual Hours',
        data: cumulativeActual,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: yMin === '' || yMin === 0,
        min: yMin === '' ? undefined : yMin,
        max: yMax === '' ? undefined : yMax,
        title: {
          display: true,
          text: 'Cumulative Hours'
        }
      },
      x: {
        min: xMin,
        max: xMax,
        title: {
          display: true,
          text: 'Time'
        }
      }
    }
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
        <Line data={lineData} options={options} />
      </div>
    </div>
  );
};
