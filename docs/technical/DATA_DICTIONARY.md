# Metrofleet Data Dictionary

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

### `fct_trips`

The central fact table for trip analysis and model training. Joined with Weather and Holiday data.

| Column | Type | Description | Source |
|--------|------|-------------|--------|
| `pickup_datetime` | Timestamp | Trip start time. | TLC |
| `total_amount` | Float | Final meter fare + surcharges + tips. | TLC |
| `trip_distance` | Float | Distance in miles. | TLC |
| `precip_mm` | Float | Precipitation (Rain/Snow) in mm at pickup hour. | **Open-Meteo** |
| `temp_c` | Float | Temperature (Celsius) at pickup hour. | **Open-Meteo** |
| `is_holiday` | Boolean | `True` if pickup date is a US/NY Public Holiday. | **Holidays Lib** |
| `holiday_name` | String | Name of the holiday (e.g., "Christmas Day") or "Non-Holiday". | **Holidays Lib** |

## Raw Data (Sources)

### `raw_yellow_trips`

Direct ingestion from NYC TLC Parquet files.

- **Partition Strategy:** Partitioned by Month (`YYYY-MM`) based on file source.
- **Update Frequency:** Monthly (historical) or Daily (simulated).

### `raw_weather`

Hourly weather data ingested from the Open-Meteo Archive API.

- **Update Frequency:** Monthly (Partitioned by Month).
- **Granularity:** Hourly.
- **Location:** NYC Central Park (Lat: 40.7831, Lon: -73.9712).

### `raw_holidays`

Reference table generated via the Python `holidays` library.

- **Update Frequency:** Ad-hoc (Full Refresh).
- **Scope:** US Federal and NY State Holidays (2023-2027).

## Data Quality Rules

Defined in `dbt` tests.

1. **Fare Floor:** `total_amount` must be > $0.
2. **Distance Floor:** `trip_distance` must be > 0.
3. **Zone Integrity:** All `LocationID`s must map to a valid Zone in `seeds/taxi_zone_lookup.csv`.
