import { useState, useEffect, useRef } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { ChartComponent } from './components/ChartComponent';
import { RechartsComponent } from './components/RechartsComponent';
import { NivoComponent } from './components/NivoComponent';
import { ApexChartsComponent } from './components/ApexChartsComponent';
import { D3ChartComponent } from './components/D3ChartComponent';
import { TableComponent, WorkSchedule } from './components/TableComponent';
import 'react-grid-layout/css/styles.css';
import 'react-grid-layout/css/styles.css';
import './styles/index.css';

const App = () => {
  const [layouts] = useState<Layout[]>([
    { i: 'table', x: 0, y: 0, w: 12, h: 2 },
    { i: 'chartjs-chart', x: 0, y: 2, w: 6, h: 2 },
    { i: 'recharts-chart', x: 6, y: 2, w: 6, h: 2 },
    { i: 'nivo-chart', x: 0, y: 4, w: 6, h: 2 },
    { i: 'apexcharts-chart', x: 6, y: 4, w: 6, h: 2 },
    { i: 'd3-chart', x: 0, y: 6, w: 6, h: 2 },
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const handleRowSelect = (schedule: WorkSchedule | null) => {
    setSelectedSchedule(schedule);
  };

  const chartData = selectedSchedule ? {
    date: selectedSchedule.date,
    project: selectedSchedule.project,
    planned: selectedSchedule.hourlyData.planned,
    actual: selectedSchedule.hourlyData.actual,
  } : null;

  return (
    <div className="dashboard" ref={containerRef}>
      <div className="dashboard-header">
        <h1>Work Schedule Dashboard</h1>
        <p>
          Planned vs Actual work hours
          {selectedSchedule && (
            <span style={{ marginLeft: '16px', color: '#4CAF50', fontWeight: 500 }}>
              Showing data for: {selectedSchedule.date} - {selectedSchedule.project}
            </span>
          )}
        </p>
      </div>

      <GridLayout
        className="layout"
        layout={layouts}
        cols={12}
        rowHeight={200}
        width={containerWidth}
        margin={[20, 60]}
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        preventCollision={false}
        draggableHandle=".drag-handle"
      >
        <div key="table">
          <TableComponent title="Work Schedule List" onRowSelect={handleRowSelect} />
        </div>
        <div key="chartjs-chart">
          <ChartComponent title="Chart.js" scheduleData={chartData} />
        </div>
        <div key="recharts-chart">
          <RechartsComponent title="Recharts" scheduleData={chartData} />
        </div>
        <div key="nivo-chart">
          <NivoComponent title="Nivo" scheduleData={chartData} />
        </div>
        <div key="apexcharts-chart">
          <ApexChartsComponent title="ApexCharts" scheduleData={chartData} />
        </div>
        <div key="d3-chart">
          <D3ChartComponent title="D3.js" scheduleData={chartData} />
        </div>
      </GridLayout>
    </div>
  );
};

export default App;
