use crate::error::TlcError;

pub fn generate_url(r#type: &str, year: i32, month: i32) -> String {
    format!("https://d37ci6vzurychx.cloudfront.net/trip-data/{}_tripdata_{}-{:02}.parquet", r#type, year, month)
}

pub fn parse_date(date_str: &str) -> Result<(i32, i32), TlcError> {
    let parts: Vec<&str> = date_str.split('-').collect();
    if parts.len() != 2 {
        return Err(TlcError::InvalidDate("Expected YYYY-MM".to_string()));
    }
    let year = parts[0].parse::<i32>().map_err(|_| TlcError::InvalidDate("Invalid year".to_string()))?;
    let month = parts[1].parse::<i32>().map_err(|_| TlcError::InvalidDate("Invalid month".to_string()))?;
    if month < 1 || month > 12 {
        return Err(TlcError::InvalidMonth(month));
    }
    Ok((year, month))
}

pub fn generate_date_range(start: &str, end: &str) -> Result<Vec<(i32, i32)>, TlcError> {
    let (start_year, start_month) = parse_date(start)?;
    let (end_year, end_month) = parse_date(end)?;

    let mut dates = Vec::new();
    let mut current_year = start_year;
    let mut current_month = start_month;

    while current_year < end_year || (current_year == end_year && current_month <= end_month) {
        dates.push((current_year, current_month));
        
        current_month += 1;
        if current_month > 12 {
            current_month = 1;
            current_year += 1;
        }
    }

    Ok(dates)
}
