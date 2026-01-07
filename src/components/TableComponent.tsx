import { useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import { useState } from 'react';

export interface WorkSchedule {
  id: number;
  date: string;
  project: string;
  assignee: string;
  status: string;
  hourlyData: {
    planned: number[];
    actual: number[];
  };
}

export const mockData: WorkSchedule[] = [
  {
    id: 1,
    date: '2026-01-07',
    project: 'Website Redesign',
    assignee: 'John Doe',
    status: 'In Progress',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0.5, 1.5, 2, 1, 0.5, 2, 1.5, 1, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 2,
    date: '2026-01-08',
    project: 'API Development',
    assignee: 'Jane Smith',
    status: 'Completed',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 3,
    date: '2026-01-09',
    project: 'Database Migration',
    assignee: 'Bob Johnson',
    status: 'Pending',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 4,
    date: '2026-01-10',
    project: 'UI Components',
    assignee: 'Alice Williams',
    status: 'In Progress',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2.5, 1, 1, 2, 2, 1.5, 0.5, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 5,
    date: '2026-01-13',
    project: 'Testing & QA',
    assignee: 'Charlie Brown',
    status: 'In Progress',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 1, 1, 1, 2, 1, 1, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1.5, 1, 1, 1, 1.5, 1, 0.5, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 6,
    date: '2026-01-14',
    project: 'Documentation',
    assignee: 'Eva Davis',
    status: 'Completed',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 1, 1, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 7,
    date: '2026-01-15',
    project: 'Security Audit',
    assignee: 'Frank Miller',
    status: 'Pending',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }
  },
  {
    id: 8,
    date: '2026-01-16',
    project: 'Performance Tuning',
    assignee: 'Grace Lee',
    status: 'In Progress',
    hourlyData: {
      planned: [0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 1, 1, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0],
      actual: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1.5, 2, 2, 1, 1, 2, 2, 1.5, 1, 0, 0, 0, 0, 0, 0],
    }
  },
];

interface TableComponentProps {
  title: string;
  onRowSelect: (schedule: WorkSchedule | null) => void;
}

export const TableComponent = ({ title, onRowSelect }: TableComponentProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null);

  const columns = useMemo<ColumnDef<WorkSchedule>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 50,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        size: 100,
      },
      {
        accessorKey: 'project',
        header: 'Project',
      },
      {
        accessorKey: 'assignee',
        header: 'Assignee',
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: (info) => {
          const status = info.getValue() as string;
          const colors = {
            'Completed': { bg: '#d4edda', text: '#155724' },
            'In Progress': { bg: '#fff3cd', text: '#856404' },
            'Pending': { bg: '#f8d7da', text: '#721c24' },
          };
          const color = colors[status as keyof typeof colors] || colors['Pending'];
          return (
            <span
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 500,
                backgroundColor: color.bg,
                color: color.text,
              }}
            >
              {status}
            </span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data: mockData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="grid-item">
      <div className="drag-handle" title="Drag to move"></div>
      <h3>{title}</h3>
      <div className="table-container">
        <table>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    {{
                      asc: ' 🔼',
                      desc: ' 🔽',
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => {
                  const newSelectedId = selectedRowId === row.id ? null : row.id;
                  setSelectedRowId(newSelectedId);
                  onRowSelect(newSelectedId ? row.original : null);
                }}
                className={selectedRowId === row.id ? 'selected-row' : ''}
                style={{ cursor: 'pointer' }}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
