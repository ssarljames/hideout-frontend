import { ResourceService } from './resource.service';
import { Observable } from 'rxjs';



export class Resource {
}

export interface ApiPagination {
  current_page: number;
  last_page: number;
  prev_page_url: string;
  next_page_url: string;
  per_page: number;
  total: number;
}

export interface ApiResponse {
  data: any;
  pagination: ApiPagination;
}
