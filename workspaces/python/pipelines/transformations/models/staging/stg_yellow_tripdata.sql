with source as (
    select * from {{ source('staging', 'raw_yellow_trips') }}
),

renamed as (
    select
        -- Identifiers
        "VendorID" as vendor_id,
        "RatecodeID" as rate_code_id,
        "PULocationID" as pickup_location_id,
        "DOLocationID" as dropoff_location_id,

        -- Timestamps
        tpep_pickup_datetime as pickup_datetime,
        tpep_dropoff_datetime as dropoff_datetime,

        -- Trip info
        store_and_fwd_flag,
        passenger_count,
        trip_distance,

        -- Payment info
        payment_type,
        case payment_type
            when 1 then 'Credit Card'
            when 2 then 'Cash'
            when 3 then 'No Charge'
            when 4 then 'Dispute'
            when 5 then 'Unknown'
            when 6 then 'Voided trip'
            else 'Empty'
        end as payment_type_description,

        -- Financials
        fare_amount,
        extra,
        mta_tax,
        tip_amount,
        tolls_amount,
        improvement_surcharge,
        total_amount,
        congestion_surcharge,
        "Airport_fee" as airport_fee

    from source
)

select * from renamed