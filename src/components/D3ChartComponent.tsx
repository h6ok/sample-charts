import { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface D3ChartComponentProps {
  title: string;
  scheduleData?: {
    date: string;
    project: string;
    planned: number[];
    actual: number[];
  } | null;
}

export const D3ChartComponent = ({ title, scheduleData }: D3ChartComponentProps) => {
  const defaultPlanned = [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0];
  const defaultActual = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1.5, 2, 1, 0.5, 2, 1.5, 1, 0, 0, 0, 0, 0, 0, 0];

  const plannedData = scheduleData?.planned || defaultPlanned;
  const actualData = scheduleData?.actual || defaultActual;

  // 軸の範囲設定
  const [xMin, setXMin] = useState<number>(0);
  const [xMax, setXMax] = useState<number>(23);
  const [yMin, setYMin] = useState<number | ''>('');
  const [yMax, setYMax] = useState<number | ''>('');

  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 累積データに変換
  const cumulativePlanned = plannedData.reduce((acc: number[], value, index) => {
    acc.push(index === 0 ? value : acc[index - 1] + value);
    return acc;
  }, []);

  const cumulativeActual = actualData.reduce((acc: number[], value, index) => {
    acc.push(index === 0 ? value : acc[index - 1] + value);
    return acc;
  }, []);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Get container dimensions
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;

    // Set margins and dimensions
    const margin = { top: 20, right: 120, bottom: 50, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', containerWidth)
      .attr('height', containerHeight)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Filter data based on x-axis range
    const filteredIndices = Array.from({ length: 24 }, (_, i) => i).filter(i => i >= xMin && i <= xMax);
    const filteredPlanned = filteredIndices.map(i => ({ x: i, y: cumulativePlanned[i] }));
    const filteredActual = filteredIndices.map(i => ({ x: i, y: cumulativeActual[i] }));

    // Calculate y-axis domain
    const allValues = [...filteredPlanned.map(d => d.y), ...filteredActual.map(d => d.y)];
    const yDomainMin = yMin === '' ? Math.min(0, d3.min(allValues) || 0) : yMin;
    const yDomainMax = yMax === '' ? d3.max(allValues) || 10 : yMax;

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([yDomainMin, yDomainMax])
      .range([height, 0]);

    // Create line generator
    const line = d3.line<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Create area generator
    const area = d3.area<{ x: number; y: number }>()
      .x(d => xScale(d.x))
      .y0(height)
      .y1(d => yScale(d.y))
      .curve(d3.curveMonotoneX);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${d}:00`))
      .append('text')
      .attr('fill', '#666')
      .attr('x', width / 2)
      .attr('y', 40)
      .attr('text-anchor', 'middle')
      .text('Time');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .append('text')
      .attr('fill', '#666')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -45)
      .attr('text-anchor', 'middle')
      .text('Cumulative Hours');

    // Add planned area
    svg.append('path')
      .datum(filteredPlanned)
      .attr('fill', 'rgba(75, 192, 192, 0.2)')
      .attr('d', area);

    // Add planned line
    svg.append('path')
      .datum(filteredPlanned)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(75, 192, 192)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add planned points
    svg.selectAll('.dot-planned')
      .data(filteredPlanned)
      .enter()
      .append('circle')
      .attr('class', 'dot-planned')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 3)
      .attr('fill', 'rgb(75, 192, 192)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add actual area
    svg.append('path')
      .datum(filteredActual)
      .attr('fill', 'rgba(255, 99, 132, 0.2)')
      .attr('d', area);

    // Add actual line
    svg.append('path')
      .datum(filteredActual)
      .attr('fill', 'none')
      .attr('stroke', 'rgb(255, 99, 132)')
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add actual points
    svg.selectAll('.dot-actual')
      .data(filteredActual)
      .enter()
      .append('circle')
      .attr('class', 'dot-actual')
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y))
      .attr('r', 3)
      .attr('fill', 'rgb(255, 99, 132)')
      .attr('stroke', '#fff')
      .attr('stroke-width', 2);

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width + 20}, 20)`);

    // Planned legend
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 6)
      .attr('fill', 'rgb(75, 192, 192)');

    legend.append('text')
      .attr('x', 15)
      .attr('y', 5)
      .style('font-size', '12px')
      .text('Cumulative Planned Hours');

    // Actual legend
    legend.append('circle')
      .attr('cx', 0)
      .attr('cy', 30)
      .attr('r', 6)
      .attr('fill', 'rgb(255, 99, 132)');

    legend.append('text')
      .attr('x', 15)
      .attr('y', 35)
      .style('font-size', '12px')
      .text('Cumulative Actual Hours');

  }, [cumulativePlanned, cumulativeActual, xMin, xMax, yMin, yMax]);

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

      <div className="chart-container" ref={containerRef}>
        <svg ref={svgRef}></svg>
      </div>
    </div>
  );
};
