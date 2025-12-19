export type DailyRevenue = {
  revenue_date: string;
  pickup_borough: string;
  total_trips: number;
  total_revenue: number;
  avg_ticket_size: number;
};

export type Trip = {
  pickup_datetime: string;
  total_amount: number;
  trip_distance: number;
  precip_mm: number;
  temp_c: number;
  is_holiday: boolean;
  holiday_name: string;
};

export type QueryResult = DailyRevenue | Trip | Record<string, unknown>;

export type ToolOutput =
  | { data: QueryResult[]; note?: string }
  | { error: string };
