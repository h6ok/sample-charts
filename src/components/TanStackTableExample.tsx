import { useState, useMemo, useEffect } from "react";
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
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());

  // デバウンス処理
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const toggleRowSelection = (rowId: number) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(rowId)) {
        newSet.delete(rowId);
      } else {
        newSet.add(rowId);
      }
      return newSet;
    });
  };

  const columns = useMemo<ColumnDef<EmployeeData>[]>(
    () => [
      {
        id: "select",
        header: "",
        size: 50,
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={selectedRows.has(row.original.id)}
            onChange={() => toggleRowSelection(row.original.id)}
          />
        ),
      },
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
    [selectedRows],
  );

  const filteredData = useMemo(() => {
    if (!debouncedSearch) return data;

    const lowerSearch = debouncedSearch.toLowerCase();
    const searchTerms = lowerSearch.split(" ").filter((t) => t.length > 0);

    return data.filter((row) => {
      const rowText = Object.entries(row)
        .filter(([key]) => key !== "id") // IDは検索対象外
        .map(([_, value]) => String(value))
        .join(" ")
        .toLowerCase();

      // AND検索: すべての単語を含む行のみ
      return searchTerms.every((term) => rowText.includes(term));
    });
  }, [data, debouncedSearch]);

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
          placeholder="フリーワード検索（スペース区切りでAND検索）..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="search-input"
          style={{ width: "400px" }}
        />
      </div>

      <div className="table-layout">
        <div className="column-visibility-sidebar">
          <h3>Column Visibility</h3>
          <div className="checkbox-list">
            {table
              .getAllLeafColumns()
              .filter((column) => column.id !== "select")
              .map((column) => (
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
                          header.getContext(),
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
                  <tr
                    key={row.id}
                    className={
                      selectedRows.has(row.original.id) ? "selected-row" : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{ width: cell.column.getSize() }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="table-info">
            Total Rows: {filteredData.length} | Visible Columns:{" "}
            {table.getVisibleLeafColumns().length} | Selected:{" "}
            {selectedRows.size}
          </div>
        </div>
      </div>
    </div>
  );
};
