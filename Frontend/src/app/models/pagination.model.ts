export class PaginationModel {
  pageSize: number;
  currentPage: number;
  sortOrder: string;
  sortBy: string;
  filter: JSON;
  totalLength: number;
}
