
with source as (
    select * from {{ source('staging', 'raw_holidays') }}
),

renamed as (
    select
        date as holiday_date,
        holiday_name,
        is_workday
    from source
)

select * from renamed