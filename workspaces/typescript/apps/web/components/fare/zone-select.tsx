"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getZonesByBorough } from "@/lib/zones";

interface ZoneSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
}

const zonesByBorough = getZonesByBorough();

export const ZoneSelect = ({ value, onValueChange, placeholder }: ZoneSelectProps) => (
  <Select value={value} onValueChange={onValueChange}>
    <SelectTrigger className="w-full bg-secondary border-border h-11">
      <SelectValue placeholder={placeholder} />
    </SelectTrigger>
    <SelectContent className="bg-card border-border max-h-64">
      {Object.entries(zonesByBorough).map(([borough, zones]) => (
        <SelectGroup key={borough}>
          <SelectLabel className="text-primary text-xs">{borough}</SelectLabel>
          {zones.map((zone) => (
            <SelectItem key={zone.id} value={zone.id.toString()}>
              {zone.zone}
            </SelectItem>
          ))}
        </SelectGroup>
      ))}
    </SelectContent>
  </Select>
);
