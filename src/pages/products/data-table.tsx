"use client";

import * as React from "react";
import { z } from "zod";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  getSortedRowModel,
  getFilteredRowModel,
  type VisibilityState,
  type ColumnFiltersState,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, EllipsisVerticalIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getProductsPaginated, type ProductSchema } from "@/services/product-service";
import { useNavigate, useSearchParams } from "react-router";

const columns: ColumnDef<z.infer<typeof ProductSchema>>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nama Produk",
    enableHiding: false,
  },
  {
    accessorKey: "sku",
    header: () => <div className="text-center">SKU</div>,
    cell: ({ row }) => (
      <div className="text-center">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.sku}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "cost",
    header: () => <div className="w-full text-right">Cost</div>,
    cell: ({row}) => <div className="w-full text-right">{row.original.cost}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="w-full text-right">Price</div>,
    cell: ({row}) => <div className="w-full text-right">{row.original.price}</div>,
  },
  {
    accessorKey: "stock",
    header: () => <div className="text-center">Stock</div>,
    cell: ({row}) => <div className="text-center">{row.original.stock}</div>,
  },
  {
    id: "actions",
    cell: () => (
      <div className="flex justify-end pr-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <EllipsisVerticalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Make a copy</DropdownMenuItem>
            <DropdownMenuItem>Favorite</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
]

export function DataTable({
  initialPageSize = 10,
}: {
  initialPageSize?: number;
}) {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const initialPageIndex = Number(searchParams.get("page") ?? 1) - 0;
    const initialPageSizeFromUrl = Number(searchParams.get("size") ?? initialPageSize);

    const [data, setData] = React.useState<z.infer<typeof ProductSchema>[]>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: initialPageSize,
    })
    const [totalRows, setTotalRows] = React.useState(0);
    const [totalPages, setTotalPages] = React.useState(1);

    React.useEffect(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", (pagination.pageIndex + 1).toString());
      params.set("size", pagination.pageSize.toString());
      navigate(`?${params.toString()}`, { replace: true });
    }, [pagination.pageIndex, pagination.pageSize]);

    // Fetch data dari server setiap pagination berubah
    React.useEffect(() => {
      async function fetchData() {
        const res = await getProductsPaginated({
          page: pagination.pageIndex + 1,
          size: pagination.pageSize,
          sort: sorting.length ? sorting[0].id : undefined,
          order: sorting.length ? (sorting[0].desc ? "desc" : "asc") : undefined,
          filters: columnFilters,
        });
        setData(res.data);
        setTotalRows(res.total);
        setTotalPages(res.totalPages ?? Math.ceil(res.total / pagination.pageSize));
      }
      fetchData();
    }, [pagination, sorting, columnFilters]);

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        getRowId: row => row.id!.toString(),
        enableRowSelection: true,
        onRowSelectionChange: setRowSelection,
        onColumnVisibilityChange: setColumnVisibility,
        onColumnFiltersChange: setColumnFilters,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        pageCount: totalPages,
    });

  return (
    <>
        <div className="overflow-hidden rounded-lg border">
        <Table>
            <TableHeader className="bg-muted sticky top-0 z-10">
            {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                ))}
                </TableRow>
            ))}
            </TableHeader>
            <TableBody className="**:data-[slot=table-cell]:first:w-8">
            {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map(row => (
                <TableRow key={row.id}>
                    {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                    ))}
                </TableRow>
                ))
            ) : (
                <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                    Tidak ada data.
                </TableCell>
                </TableRow>
            )}
            </TableBody>
        </Table>
        </div>
        <div className="flex items-center justify-between px-4">
          <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="flex w-full items-center gap-8 lg:w-fit">
            <div className="hidden items-center gap-2 lg:flex">
              <Label htmlFor="rows-per-page" className="text-sm font-medium">
                Rows per page
              </Label>
              <Select
                value={`${table.getState().pagination.pageSize}`}
                onValueChange={(value) => {
                  table.setPageSize(Number(value))
                }}
              >
                <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                  <SelectValue
                    placeholder={table.getState().pagination.pageSize}
                  />
                </SelectTrigger>
                <SelectContent side="top">
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <SelectItem key={pageSize} value={`${pageSize}`}>
                      {pageSize}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex w-fit items-center justify-center text-sm font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </div>
            <div className="ml-auto flex items-center gap-2 lg:ml-0">
              <Button
                variant="outline"
                className="hidden h-8 w-8 p-0 lg:flex"
                onClick={() => table.setPageIndex(0)}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to first page</span>
                <ChevronsLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                <span className="sr-only">Go to previous page</span>
                <ChevronLeftIcon />
              </Button>
              <Button
                variant="outline"
                className="size-8"
                size="icon"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to next page</span>
                <ChevronRightIcon />
              </Button>
              <Button
                variant="outline"
                className="hidden size-8 lg:flex"
                size="icon"
                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                disabled={!table.getCanNextPage()}
              >
                <span className="sr-only">Go to last page</span>
                <ChevronsRightIcon />
              </Button>
            </div>
          </div>
        </div>
    </>
  );
}
