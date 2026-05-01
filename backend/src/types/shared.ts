export interface UserRolePayload {
  id: string;
  email: string;
}

export interface PaginationQuery {
  limit?: number;
  offset?: number;
}
