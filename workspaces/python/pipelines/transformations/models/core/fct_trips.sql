{{ config(materialized='table') }}

with yellow_data as (
    select *, 
           'Yellow' as service_type 
    from {{ ref('stg_yellow_tripdata') }}
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
    trips.payment_type_description
from yellow_data as trips
inner join zones as pickup_zone 
    on trips.pickup_location_id = pickup_zone.locationid
inner join zones as dropoff_zone 
    on trips.dropoff_location_id = dropoff_zone.locationid
where 
    -- Business Logic: Filter out anomalies
    trips.trip_distance > 0 
    and trips.fare_amount > 0
    and trips.total_amount < 5000 -- Remove extreme outliers/testing data