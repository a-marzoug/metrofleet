"use client";

import { useState, useEffect } from "react";
import { History, Search, ArrowUpDown, Trash2, MapPin, DollarSign, Route, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { deleteTrip } from "@/app/actions/trips";

interface Trip {
    id: string;
    pickupZone: string;
    dropoffZone: string;
    distance: number;
    estimatedFare: number;
    createdAt: string;
}

export default function HistoryPage() {
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [zone, setZone] = useState("");
    const [sortBy, setSortBy] = useState("createdAt");
    const [order, setOrder] = useState("desc");

    const fetchTrips = async () => {
        setLoading(true);
        const params = new URLSearchParams();
        if (zone) params.set("zone", zone);
        params.set("sortBy", sortBy);
        params.set("order", order);

        const res = await fetch(`/api/trips?${params}`);
        const data = await res.json();
        setTrips(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchTrips();
    }, [sortBy, order]);

    const handleSearch = () => {
        fetchTrips();
    };

    const handleDelete = async (id: string) => {
        await deleteTrip(id);
        setTrips(trips.filter((t) => t.id !== id));
    };

    const toggleOrder = () => {
        setOrder(order === "asc" ? "desc" : "asc");
    };

    return (
        <div className="h-screen flex">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto p-6">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold font-techno">
                            <span className="text-foreground">Trip</span>{" "}
                            <span className="neon-text">History</span>
                        </h1>
                        <p className="text-muted-foreground mt-1">
                            View and manage your past fare predictions
                        </p>
                    </div>

                    {/* Filters */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-sidebar rounded-xl p-4 mb-6"
                    >
                        <div className="flex items-center gap-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Search className="w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search by zone name..."
                                        value={zone}
                                        onChange={(e) => setZone(e.target.value)}
                                        className="bg-secondary border-border"
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    />
                                </div>
                            </div>

                            <Select value={sortBy} onValueChange={setSortBy}>
                                <SelectTrigger className="w-40 bg-secondary border-border">
                                    <SelectValue placeholder="Sort by" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="createdAt">Date</SelectItem>
                                    <SelectItem value="fare">Fare</SelectItem>
                                    <SelectItem value="distance">Distance</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button
                                variant="outline"
                                size="icon"
                                onClick={toggleOrder}
                                className="border-border"
                            >
                                <ArrowUpDown className={`w-4 h-4 ${order === "asc" ? "rotate-180" : ""}`} />
                            </Button>

                            <Button onClick={handleSearch} className="neon-button">
                                Search
                            </Button>
                        </div>
                    </motion.div>

                    {/* Trips Table */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-sidebar rounded-xl overflow-hidden"
                    >
                        {loading ? (
                            <div className="p-8 text-center text-muted-foreground">
                                Loading trips...
                            </div>
                        ) : trips.length === 0 ? (
                            <div className="p-8 text-center">
                                <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                                <p className="text-muted-foreground">No trips found</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Make a fare prediction to see it here
                                </p>
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-border">
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-primary" />
                                                Pickup
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-violet-400" />
                                                Dropoff
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Route className="w-4 h-4" />
                                                Distance
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="w-4 h-4 text-primary" />
                                                Fare
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Date
                                            </div>
                                        </th>
                                        <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {trips.map((trip, index) => (
                                        <motion.tr
                                            key={trip.id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                                        >
                                            <td className="px-4 py-3 text-sm">{trip.pickupZone}</td>
                                            <td className="px-4 py-3 text-sm">{trip.dropoffZone}</td>
                                            <td className="px-4 py-3 text-sm">
                                                {trip.distance.toFixed(2)} mi
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-primary">
                                                ${trip.estimatedFare.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-muted-foreground">
                                                {new Date(trip.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(trip.id)}
                                                    className="text-muted-foreground hover:text-violet-400 hover:bg-violet-500/10"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </motion.div>
                </main>
            </div>
        </div>
    );
}
