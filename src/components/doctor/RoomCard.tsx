import type { Room } from "@/lib/types";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BedDouble, UserCircle, CheckCircle, XCircle, ListChecks } from "lucide-react";

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden shadow-lg transition-all hover:shadow-xl">
      <div className="relative h-48 w-full">
        <Image
          src={room.imageUrl || "https://picsum.photos/seed/defaultroom/400/300"}
          alt={`Room ${room.roomNumber}`}
          layout="fill"
          objectFit="cover"
          data-ai-hint="hospital room"
        />
        <Badge
          className="absolute right-2 top-2"
          variant={room.isOccupied ? "destructive" : "default"}
          style={room.isOccupied ? {} : { backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}
        >
          {room.isOccupied ? <XCircle className="mr-1 h-3 w-3" /> : <CheckCircle className="mr-1 h-3 w-3" />}
          {room.isOccupied ? "Occupied" : "Available"}
        </Badge>
      </div>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
            <BedDouble className="h-6 w-6 text-primary" />
            Room {room.roomNumber}
        </CardTitle>
        {room.isOccupied && room.patientName && (
          <CardDescription className="flex items-center gap-1 pt-1 text-sm">
            <UserCircle className="h-4 w-4 text-muted-foreground" /> Patient: {room.patientName}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-grow">
        {room.properties.length > 0 && (
          <div>
            <h4 className="mb-1 text-xs font-medium text-muted-foreground flex items-center gap-1"><ListChecks className="h-3 w-3" />Properties:</h4>
            <div className="flex flex-wrap gap-1">
              {room.properties.map(prop => (
                <Badge key={prop} variant="secondary" className="text-xs">{prop}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>ID: {room.id}</p>
      </CardFooter>
    </Card>
  );
}
