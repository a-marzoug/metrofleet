# Business Use Cases

## **Case 001: Operational Visibility & Data Foundation**

**1. The Situation**

* **Context:** Metrofleet management relies on monthly CSV dumps from the NYC TLC website to analyze fleet performance.
* **Pain Point:** There is a 30-day lag between operations and reporting. Data often contains errors (negative fares, zero distances) that skew financial projections.
* **Impact:** The VP of Ops cannot make tactical decisions (e.g., "Deploy more cars to Queens") until it is too late, resulting in an estimated **15% loss in potential revenue efficiency**.

**2. The Solution**

* **Technical Deliverable:** An automated ELT Data Pipeline (Rust + Dagster + dbt) and an Executive Dashboard (Streamlit).
* **User Story:** "As the VP of Operations, I want to see yesterday's revenue and trip volume by Borough, so that I can adjust fleet distribution for the rest of the week."

**3. Success Metrics**

* **Business KPI:** Reduce "Time-to-Insight" from **30 days** to **24 hours**.
* **Technical KPI:** Data Quality Tests (Schema/Null checks) pass **100%** of the time.

**4. Implementation Phase**

* **Status:** ✅ Completed
* **Artifacts:** `dm_daily_revenue` table, Streamlit Admin Dashboard.

---

## **Case 002: Dynamic Price Estimation**

**1. The Situation**

* **Context:** Metrofleet taxis run on meters. Passengers do not know the final price until the trip ends.
* **Pain Point:** Competitors (Uber/Lyft) offer upfront pricing.
* **Impact:** **30% of potential customers** abandon the taxi queue because they fear "Meter Anxiety" (unexpected high fares due to traffic).

**2. The Solution**

* **Technical Deliverable:** A Machine Learning Regression Model (XGBoost) API.
* **Feature Engineering:** The model is enriched with **Meteorological Data** (Rain/Snow impact) and **Calendar Events** (Holiday demand patterns) to improve accuracy during edge cases (e.g., blizzards or Christmas).
* **User Story:** "As a Passenger, I want an accurate quote even during bad weather, so I don't get sticker shock."

**3. Success Metrics**

* **Technical KPI:** Model Mean Absolute Error (MAE) < **$2.50** (Reduced by ~15% after adding Weather/Holiday features).

**4. Implementation Phase**

* **Status:** 🚧 In Progress (Integration)
* **Artifacts:** `price_model.pkl`, FastAPI Gateway.
* **Pending:** TypeScript SDK & UI Integration.
