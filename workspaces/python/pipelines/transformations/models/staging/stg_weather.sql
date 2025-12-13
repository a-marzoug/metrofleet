
with source as (
    select * from {{ source('staging', 'raw_weather') }}
),

renamed as (
    select
        timestamp as weather_timestamp,
        temp_c,
        precip_mm,
        snow_cm,
        wind_kmh,
        -- Simple logic: if precip > 0 or snow > 0, it's "bad weather"
        case 
            when precip_mm > 0.5 or snow_cm > 0.5 then true 
            else false 
        end as is_bad_weather
    from source
)

select * from renamed