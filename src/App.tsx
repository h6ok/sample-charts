import { useState } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import { ChartComponent } from './components/ChartComponent';
import { TableComponent, WorkSchedule } from './components/TableComponent';
import 'react-grid-layout/css/styles.css';
import 'react-grid-layout/css/styles.css';
import './styles/index.css';

const App = () => {
  const [layouts] = useState<Layout[]>([
    { i: 'line-chart', x: 0, y: 0, w: 12, h: 2 },
    { i: 'table', x: 0, y: 2, w: 12, h: 2 },
  ]);

  const [selectedSchedule, setSelectedSchedule] = useState<WorkSchedule | null>(null);

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
    <div className="dashboard">
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
        width={1200}
        isDraggable={true}
        isResizable={true}
        compactType="vertical"
        preventCollision={false}
        draggableHandle=".drag-handle"
      >
        <div key="line-chart">
          <ChartComponent title="Hourly Work Schedule" scheduleData={chartData} />
        </div>
        <div key="table">
          <TableComponent title="Work Schedule List" onRowSelect={handleRowSelect} />
        </div>
      </GridLayout>
    </div>
  );
};

export default App;
