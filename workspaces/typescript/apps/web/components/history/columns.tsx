"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Trash2, MapPin, DollarSign, Route, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Trip {
  id: string;
  pickupZone: string;
  dropoffZone: string;
  distance: number;
  estimatedFare: number;
  createdAt: string;
}

export const createColumns = (onDelete: (id: string) => void): ColumnDef<Trip>[] => [
  {
    accessorKey: "pickupZone",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <MapPin className="w-4 h-4 text-primary mr-2" />
        Pickup
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { label: "Pickup" },
  },
  {
    accessorKey: "dropoffZone",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <MapPin className="w-4 h-4 text-violet-400 mr-2" />
        Dropoff
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    meta: { label: "Dropoff" },
  },
  {
    accessorKey: "distance",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Route className="w-4 h-4 mr-2" />
        Distance
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => `${row.original.distance.toFixed(2)} mi`,
    meta: { label: "Distance" },
  },
  {
    accessorKey: "estimatedFare",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <DollarSign className="w-4 h-4 text-primary mr-2" />
        Fare
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium text-primary">${row.original.estimatedFare.toFixed(2)}</span>,
    meta: { label: "Fare" },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button variant="ghost" className="p-0 hover:bg-transparent" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        <Calendar className="w-4 h-4 mr-2" />
        Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    filterFn: (row, _, filterValue) => {
      if (!filterValue?.from) return true;
      const date = new Date(row.original.createdAt);
      const from = new Date(filterValue.from);
      const to = filterValue.to ? new Date(filterValue.to) : new Date();
      return date >= from && date <= to;
    },
    meta: { label: "Date" },
  },
  {
    id: "actions",
    enableHiding: false,
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(row.original.id)}
        className="text-muted-foreground hover:text-white hover:bg-violet-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    ),
  },
];
