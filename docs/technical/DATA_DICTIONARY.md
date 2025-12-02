# MetroFleet Data Dictionary

## Core Business Metrics (Marts)

### `dm_daily_revenue`

The primary source for the Executive Dashboard. Aggregates financial performance by day and borough.

| Column | Type | Description |
|--------|------|-------------|
| `revenue_date` | Date | The date of the trip pickup. |
| `pickup_borough` | String | NYC Borough (Manhattan, Queens, etc.) based on Taxi Zone. |
| `total_trips` | Int | Count of valid trips (excluding voided/disputed). |
| `total_revenue` | Float | Sum of `total_amount` (Fares + Tips + Surcharges). |
| `avg_ticket_size` | Float | Average revenue generated per single trip. |

## Raw Data (Sources)

### `raw_yellow_trips`

Direct ingestion from NYC TLC Parquet files.

- **Partition Strategy:** Partitioned by Month (`YYYY-MM`) based on file source.
- **Update Frequency:** Monthly (historical) or Daily (simulated).

## Data Quality Rules

Defined in `dbt` tests.

1. **Fare Floor:** `total_amount` must be > $0.
2. **Distance Floor:** `trip_distance` must be > 0.
3. **Zone Integrity:** All `LocationID`s must map to a valid Zone in `seeds/taxi_zone_lookup.csv`.
