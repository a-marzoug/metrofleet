{{ config(materialized='table') }}

select 
    -- Dimensions
    date_trunc('day', pickup_datetime) as revenue_date,
    service_type,
    pickup_borough,

    -- Metrics
    count(*) as total_trips,
    sum(fare_amount) as total_fare,
    sum(tip_amount) as total_tips,
    sum(total_amount) as total_revenue,
    avg(trip_distance) as avg_distance,
    avg(total_amount) as avg_ticket_size

from {{ ref('fct_trips') }}
group by 1, 2, 3
order by 1 desc