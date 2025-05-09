"use client";

import { useState, useMemo } from "react";
import type { Room } from "@/lib/types";
import { RoomCard } from "@/components/doctor/RoomCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Filter } from "lucide-react";

interface RoomAvailabilityClientPageProps {
  initialRooms: Room[];
}

export default function RoomAvailabilityClientPage({ initialRooms }: RoomAvailabilityClientPageProps) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "available" | "occupied">("all");
  const [filterProperty, setFilterProperty] = useState("");

  const allProperties = useMemo(() => {
    const propertiesSet = new Set<string>();
    initialRooms.forEach(room => room.properties.forEach(prop => propertiesSet.add(prop)));
    return Array.from(propertiesSet).sort();
  }, [initialRooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesStatus = 
        filterStatus === "all" ||
        (filterStatus === "available" && !room.isOccupied) ||
        (filterStatus === "occupied" && room.isOccupied);
      
      const matchesText = 
        filterText === "" ||
        room.roomNumber.toLowerCase().includes(filterText.toLowerCase()) ||
        (room.patientName && room.patientName.toLowerCase().includes(filterText.toLowerCase()));

      const matchesProperty =
        filterProperty === "" || room.properties.includes(filterProperty);

      return matchesStatus && matchesText && matchesProperty;
    });
  }, [rooms, filterStatus, filterText, filterProperty]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 rounded-lg border bg-card p-4 shadow-sm md:grid-cols-2 lg:grid-cols-4 lg:items-end">
        <div>
          <Label htmlFor="room-search">Search Room/Patient</Label>
          <div className="relative mt-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="room-search"
              placeholder="Room No. or Patient Name"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="room-status">Status</Label>
          <Select value={filterStatus} onValueChange={(value) => setFilterStatus(value as typeof filterStatus)}>
            <SelectTrigger id="room-status" className="mt-1">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Rooms</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="room-property">Property</Label>
          <Select value={filterProperty} onValueChange={setFilterProperty}>
            <SelectTrigger id="room-property" className="mt-1">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Properties</SelectItem>
              {allProperties.map(prop => (
                <SelectItem key={prop} value={prop}>{prop}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* Example of a switch filter, could be used for 'Show ICU only' etc. */}
        {/* <div className="flex items-center space-x-2 self-end pb-2">
          <Switch id="icu-only" />
          <Label htmlFor="icu-only">ICU Only</Label>
        </div> */}
      </div>

      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <Card className="col-span-full flex h-60 items-center justify-center">
          <CardContent className="text-center text-muted-foreground">
            <Filter className="mx-auto mb-2 h-12 w-12" />
            <p className="text-lg">No rooms match your current filters.</p>
            <p>Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Dummy Card component if not using shadcn Card for the main container of the table
const Card = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;
const CardContent = ({className, children}: {className?:string, children: React.ReactNode}) => <div className={className}>{children}</div>;
