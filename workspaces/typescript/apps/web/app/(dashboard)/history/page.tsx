"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable, createColumns, HistoryPageHeader, HistoryEmptyState, type Trip } from "@/components/history";
import { deleteTrip } from "@/app/actions/trips";

const HistoryPage = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      const res = await fetch("/api/trips");
      const data = await res.json();
      setTrips(data);
      setLoading(false);
    };
    fetchTrips();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const columns = useMemo(() => createColumns(handleDelete), []);

  if (loading) {
    return (
      <>
        <HistoryPageHeader />
        <div className="bg-sidebar rounded-xl p-8 text-center text-muted-foreground">Loading trips...</div>
      </>
    );
  }

  if (trips.length === 0) {
    return (
      <>
        <HistoryPageHeader />
        <HistoryEmptyState />
      </>
    );
  }

  return (
    <>
      <HistoryPageHeader />
      <DataTable columns={columns} data={trips} />
    </>
  );
};

export default HistoryPage;
