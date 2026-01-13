import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TextField,
  Checkbox,
  FormControlLabel,
  Box,
  Typography,
} from "@mui/material";
import { EmployeeData, sampleData } from "../data/sampleTableData";

type Order = "asc" | "desc";

export const MuiTableExample = () => {
  const [data] = useState<EmployeeData[]>([...sampleData]);
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<keyof EmployeeData>("id");
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

  const columns: Array<{ id: keyof EmployeeData; label: string; minWidth?: number }> = [
    { id: "id", label: "ID", minWidth: 60 },
    { id: "employeeId", label: "Employee ID", minWidth: 120 },
    { id: "firstName", label: "First Name", minWidth: 120 },
    { id: "lastName", label: "Last Name", minWidth: 120 },
    { id: "email", label: "Email", minWidth: 250 },
    { id: "department", label: "Department", minWidth: 120 },
    { id: "position", label: "Position", minWidth: 120 },
    { id: "salary", label: "Salary", minWidth: 120 },
    { id: "hireDate", label: "Hire Date", minWidth: 120 },
    { id: "country", label: "Country", minWidth: 100 },
    { id: "city", label: "City", minWidth: 100 },
    { id: "phone", label: "Phone", minWidth: 150 },
    { id: "age", label: "Age", minWidth: 80 },
    { id: "experience", label: "Experience", minWidth: 100 },
    { id: "performance", label: "Performance", minWidth: 120 },
    { id: "projects", label: "Projects", minWidth: 100 },
    { id: "status", label: "Status", minWidth: 120 },
    { id: "manager", label: "Manager", minWidth: 150 },
    { id: "skills", label: "Skills", minWidth: 250 },
    { id: "education", label: "Education", minWidth: 120 },
    { id: "certification", label: "Certification", minWidth: 150 },
  ];

  const [columnVisibility, setColumnVisibility] = useState<Record<keyof EmployeeData, boolean>>(
    columns.reduce((acc, col) => {
      acc[col.id] = true;
      return acc;
    }, {} as Record<keyof EmployeeData, boolean>)
  );

  const visibleColumns = useMemo(() => {
    return columns.filter((col) => columnVisibility[col.id]);
  }, [columnVisibility]);

  const handleRequestSort = (property: keyof EmployeeData) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredAndSortedData = useMemo(() => {
    let filtered = data;

    if (debouncedSearch) {
      const lowerSearch = debouncedSearch.toLowerCase();
      const searchTerms = lowerSearch.split(' ').filter(t => t.length > 0);

      filtered = filtered.filter((row) => {
        const rowText = Object.entries(row)
          .filter(([key]) => key !== 'id') // IDは検索対象外
          .map(([_, value]) => String(value))
          .join(' ')
          .toLowerCase();

        // AND検索: すべての単語を含む行のみ
        return searchTerms.every(term => rowText.includes(term));
      });
    }

    return filtered.sort((a, b) => {
      const aValue = a[orderBy];
      const bValue = b[orderBy];

      if (aValue < bValue) {
        return order === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return order === "asc" ? 1 : -1;
      }
      return 0;
    });
  }, [data, debouncedSearch, order, orderBy]);

  const toggleColumnVisibility = (column: keyof EmployeeData) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Material UI Table Example
      </Typography>

      <Box sx={{ mb: 3, display: "flex", justifyContent: "flex-end" }}>
        <TextField
          label="フリーワード検索（スペース区切りでAND検索）"
          variant="outlined"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ width: 400 }}
        />
      </Box>

      <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
        <Paper sx={{
          width: 200,
          flexShrink: 0,
          p: 2,
          maxHeight: 600,
          overflow: "auto",
          position: "sticky",
          top: 0
        }}>
          <Typography variant="h6" gutterBottom sx={{
            position: "sticky",
            top: -16,
            backgroundColor: "white",
            pb: 1,
            pt: 0,
            mb: 1,
            borderBottom: "2px solid #ddd",
            zIndex: 1
          }}>
            Column Visibility
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            {columns.map((col) => (
              <FormControlLabel
                key={col.id}
                control={
                  <Checkbox
                    checked={columnVisibility[col.id]}
                    onChange={() => toggleColumnVisibility(col.id)}
                    size="small"
                  />
                }
                label={<Typography variant="body2">{col.label}</Typography>}
              />
            ))}
          </Box>
        </Paper>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5", width: 50 }}
                  >
                  </TableCell>
                  {visibleColumns.map((column) => (
                    <TableCell
                      key={column.id}
                      style={{ minWidth: column.minWidth }}
                      sx={{ fontWeight: "bold", backgroundColor: "#f5f5f5" }}
                    >
                      <TableSortLabel
                        active={orderBy === column.id}
                        direction={orderBy === column.id ? order : "asc"}
                        onClick={() => handleRequestSort(column.id)}
                      >
                        {column.label}
                      </TableSortLabel>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAndSortedData.map((row) => (
                  <TableRow
                    hover
                    key={row.id}
                    sx={{
                      backgroundColor: selectedRows.has(row.id) ? "#e3f2fd" : "inherit",
                      "&:hover": {
                        backgroundColor: selectedRows.has(row.id) ? "#bbdefb !important" : undefined,
                      },
                    }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selectedRows.has(row.id)}
                        onChange={() => toggleRowSelection(row.id)}
                      />
                    </TableCell>
                    {visibleColumns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.id === "salary"
                            ? `$${(value as number).toLocaleString()}`
                            : String(value)}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="body2">
              Total Rows: {filteredAndSortedData.length} | Visible Columns:{" "}
              {visibleColumns.length} | Selected: {selectedRows.size}
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
};
