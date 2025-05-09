"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Flag, FlagOff, ArrowUpDown, Search, ExternalLink } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { updatePatient as updatePatientAction } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";
import { PatientFilterControls } from "@/components/doctor/PatientFilterControls";

interface PatientDirectoryClientPageProps {
  initialPatients: Patient[];
}

type SortKey = "name" | "admissionDate" | "urgency";
type SortDirection = "asc" | "dsc";

export default function PatientDirectoryClientPage({ initialPatients }: PatientDirectoryClientPageProps) {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("admissionDate");
  const [sortDirection, setSortDirection] = useState<SortDirection>("dsc");
  const [filterFlagged, setFilterFlagged] = useState(false);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useState(() => {
    if (searchParams?.get('filter') === 'flagged') {
        setFilterFlagged(true);
    }
  });


  const urgencyOrder: Record<Patient['urgency'], number> = { High: 3, Medium: 2, Low: 1 };

  const sortedAndFilteredPatients = useMemo(() => {
    let filtered = patients;

    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.diagnosis && p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterFlagged) {
      filtered = filtered.filter(p => p.isFlagged);
    }
    
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortKey === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortKey === "admissionDate") {
        comparison = parseISO(a.admissionDate).getTime() - parseISO(b.admissionDate).getTime();
      } else if (sortKey === "urgency") {
        comparison = urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [patients, searchTerm, sortKey, sortDirection, filterFlagged, urgencyOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(prev => prev === "asc" ? "dsc" : "asc");
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  const toggleFlag = async (patient: Patient) => {
    const updatedPatient = { ...patient, isFlagged: !patient.isFlagged };
    const result = await updatePatientAction(updatedPatient);
    if (result) {
      setPatients(prevPatients => prevPatients.map(p => p.id === result.id ? result : p));
      toast({ title: "Success", description: `Patient ${result.isFlagged ? 'flagged' : 'unflagged'}.` });
    } else {
      toast({ title: "Error", description: "Failed to update flag status.", variant: "destructive" });
    }
  };
  
  const getSortIndicator = (key: SortKey) => {
    if (sortKey === key) {
      return sortDirection === "asc" ? <ArrowUpDown className="ml-2 h-4 w-4 inline transform rotate-0" /> : <ArrowUpDown className="ml-2 h-4 w-4 inline transform rotate-180" />;
    }
    return <ArrowUpDown className="ml-2 h-4 w-4 inline opacity-30" />;
  };

  return (
    <div className="space-y-6">
      <PatientFilterControls
        searchTerm={searchTerm}
        onSearchTermChange={setSearchTerm}
        sortKey={sortKey}
        onSortKeyChange={(val) => handleSort(val as SortKey)}
        sortDirection={sortDirection}
        onSortDirectionChange={(val) => setSortDirection(val as SortDirection)}
        filterFlagged={filterFlagged}
        onFilterFlaggedChange={setFilterFlagged}
      />

      <div className="overflow-x-auto rounded-lg border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Avatar</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("name")}>
                Name {getSortIndicator("name")}
              </TableHead>
              <TableHead>DOB</TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("admissionDate")}>
                Admission {getSortIndicator("admissionDate")}
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("urgency")}>
                Urgency {getSortIndicator("urgency")}
              </TableHead>
              <TableHead>Room</TableHead>
              <TableHead className="w-[50px] text-center">Flag</TableHead>
              <TableHead className="w-[50px] text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredPatients.length > 0 ? sortedAndFilteredPatients.map((patient) => (
              <TableRow key={patient.id} className={patient.isFlagged ? "bg-destructive/5 hover:bg-destructive/10" : ""}>
                <TableCell>
                  <Image
                    src={patient.avatarUrl || `https://picsum.photos/seed/${patient.id}/80/80`}
                    alt={patient.name}
                    width={32}
                    height={32}
                    className="rounded-full"
                    data-ai-hint="person portrait"
                  />
                </TableCell>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell>{format(parseISO(patient.dateOfBirth), "PP")}</TableCell>
                <TableCell>{format(parseISO(patient.admissionDate), "PP")}</TableCell>
                <TableCell>
                  <Badge variant={patient.urgency === 'High' ? 'destructive' : patient.urgency === 'Medium' ? 'secondary' : 'outline'}>
                    {patient.urgency}
                  </Badge>
                </TableCell>
                <TableCell>{patient.roomNumber || 'N/A'}</TableCell>
                <TableCell className="text-center">
                  <Button variant="ghost" size="icon" onClick={() => toggleFlag(patient)} title={patient.isFlagged ? "Unflag Record" : "Flag Record"}>
                    {patient.isFlagged ? <Flag className="h-5 w-5 text-destructive" /> : <FlagOff className="h-5 w-5 text-muted-foreground" />}
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/doctor/patients/${patient.id}`}>
                      View <ExternalLink className="ml-2 h-3 w-3" />
                    </Link>
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No patients match your criteria.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
