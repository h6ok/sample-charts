import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnDef,
  VisibilityState,
} from "@tanstack/react-table";
import { EmployeeData, sampleData } from "../data/sampleTableData";
import "../styles/TanStackTable.css";

export const TanStackTableExample = () => {
  const [data] = useState(() => [...sampleData]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [searchColumn, setSearchColumn] = useState("firstName");
  const [searchValue, setSearchValue] = useState("");

  const columns = useMemo<ColumnDef<EmployeeData>[]>(
    () => [
      { accessorKey: "id", header: "ID", size: 60 },
      { accessorKey: "employeeId", header: "Employee ID", size: 120 },
      { accessorKey: "firstName", header: "First Name", size: 120 },
      { accessorKey: "lastName", header: "Last Name", size: 120 },
      { accessorKey: "email", header: "Email", size: 250 },
      { accessorKey: "department", header: "Department", size: 120 },
      { accessorKey: "position", header: "Position", size: 120 },
      {
        accessorKey: "salary",
        header: "Salary",
        size: 120,
        cell: (info) => `$${info.getValue<number>().toLocaleString()}`,
      },
      { accessorKey: "hireDate", header: "Hire Date", size: 120 },
      { accessorKey: "country", header: "Country", size: 100 },
      { accessorKey: "city", header: "City", size: 100 },
      { accessorKey: "phone", header: "Phone", size: 150 },
      { accessorKey: "age", header: "Age", size: 80 },
      { accessorKey: "experience", header: "Experience", size: 100 },
      { accessorKey: "performance", header: "Performance", size: 120 },
      { accessorKey: "projects", header: "Projects", size: 100 },
      { accessorKey: "status", header: "Status", size: 120 },
      { accessorKey: "manager", header: "Manager", size: 150 },
      { accessorKey: "skills", header: "Skills", size: 250 },
      { accessorKey: "education", header: "Education", size: 120 },
      { accessorKey: "certification", header: "Certification", size: 150 },
    ],
    []
  );

  const filteredData = useMemo(() => {
    if (!searchValue) return data;

    return data.filter((row) => {
      const value = row[searchColumn as keyof EmployeeData];
      return String(value).toLowerCase().includes(searchValue.toLowerCase());
    });
  }, [data, searchColumn, searchValue]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnVisibility,
    },
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="tanstack-table-container">
      <h2>TanStack Table Example</h2>

      <div className="search-controls">
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          style={{ width: '300px' }}
        />
        <select
          value={searchColumn}
          onChange={(e) => setSearchColumn(e.target.value)}
          className="search-select"
          style={{ width: '200px' }}
        >
          {columns.map((col) => {
            const key = 'accessorKey' in col ? col.accessorKey as string : '';
            const header = 'header' in col ? col.header as string : '';
            return (
              <option key={key} value={key}>
                {header}
              </option>
            );
          })}
        </select>
      </div>

      <div className="table-layout">
        <div className="column-visibility-sidebar">
          <h3>Column Visibility</h3>
          <div className="checkbox-list">
            {table.getAllLeafColumns().map((column) => (
              <label key={column.id} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={column.getIsVisible()}
                  onChange={column.getToggleVisibilityHandler()}
                />
                {column.columnDef.header as string}
              </label>
            ))}
          </div>
        </div>

        <div className="table-main">
          <div className="table-wrapper">
            <table className="tanstack-table">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        style={{ width: header.getSize() }}
                        onClick={header.column.getToggleSortingHandler()}
                        className={header.column.getCanSort() ? "sortable" : ""}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} style={{ width: cell.column.getSize() }}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-info">
            Total Rows: {filteredData.length} | Visible Columns: {table.getVisibleLeafColumns().length}
          </div>
        </div>
      </div>
    </div>
  );
};
