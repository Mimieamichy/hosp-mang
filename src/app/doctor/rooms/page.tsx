import { PageHeader } from "@/components/PageHeader";
import { mockRooms } from "@/lib/data";
import RoomAvailabilityClientPage from "./RoomAvailabilityClientPage";

export default function RoomAvailabilityPage() {
  const rooms = mockRooms; // Fetch or pass data as needed

  return (
    <div>
      <PageHeader
        title="Room Availability"
        description="View current room occupancy and filter by room properties."
      />
      <RoomAvailabilityClientPage initialRooms={rooms} />
    </div>
  );
}
