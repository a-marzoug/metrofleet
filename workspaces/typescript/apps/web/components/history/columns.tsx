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
  },
  {
    id: "actions",
    header: () => <span className="sr-only">Actions</span>,
    cell: ({ row }) => (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onDelete(row.original.id)}
        className="text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    ),
  },
];
