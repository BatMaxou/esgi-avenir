export interface DataTableState {
  pageIndex: number;
  pageSize: number;
  sorting: Array<{ id: string; desc: boolean }>;
  columnFilters: Array<{ id: string; value: unknown }>;
  columnVisibility: Record<string, boolean>;
}

export interface PaginationState {
  pageIndex: number;
  pageSize: number;
}
