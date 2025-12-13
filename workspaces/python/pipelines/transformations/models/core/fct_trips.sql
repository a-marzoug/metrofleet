{{ config(materialized='table') }}


with yellow_data as (
    select *, 
           'Yellow' as service_type 
    from {{ ref('stg_yellow_tripdata') }}
), 

weather as (
    select * from {{ ref('stg_weather') }}
),

holidays as (
    select * from {{ ref('stg_holidays') }}
),

zones as (
    select "LocationID" as locationid, "Borough" as borough, "Zone" as zone 
    from {{ ref('taxi_zone_lookup') }}
)

select
    trips.vendor_id,
    trips.service_type,
    trips.pickup_location_id,
    pickup_zone.borough as pickup_borough,
    pickup_zone.zone as pickup_zone,
    trips.dropoff_location_id,
    dropoff_zone.borough as dropoff_borough,
    dropoff_zone.zone as dropoff_zone,
    trips.pickup_datetime,
    trips.dropoff_datetime,
    trips.trip_distance,
    trips.fare_amount,
    trips.tip_amount,
    trips.total_amount,
    trips.payment_type_description,
    -- Weather Join (Round to nearest hour)
    weather.temp_c,
    weather.precip_mm,
    weather.is_bad_weather,
    -- Holiday Join
    coalesce(
        holidays.holiday_name,
        'Non-Holiday'
    ) as holiday_name,
    case
        when holidays.holiday_name is not null then true
        else false
    end as is_holiday
from
    yellow_data as trips
    inner join zones as pickup_zone on trips.pickup_location_id = pickup_zone.locationid
    inner join zones as dropoff_zone on trips.dropoff_location_id = dropoff_zone.locationid
    -- Left Join Weather on the exact hour
    left join weather on date_trunc('hour', trips.pickup_datetime) = weather.weather_timestamp

-- Left Join Holidays on the date
left join holidays on date (trips.pickup_datetime) = holidays.holiday_date
where
    -- Business Logic: Filter out anomalies
    trips.trip_distance > 0
    and trips.fare_amount > 0
    and trips.total_amount < 5000 -- Remove extreme outliers/testing data