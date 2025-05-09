"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Search, Flag, ArrowUp, ArrowDown } from "lucide-react";

interface PatientFilterControlsProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  sortKey: string;
  onSortKeyChange: (key: string) => void;
  sortDirection: "asc" | "dsc";
  onSortDirectionChange: (direction: "asc" | "dsc") => void;
  filterFlagged: boolean;
  onFilterFlaggedChange: (flagged: boolean) => void;
}

export function PatientFilterControls({
  searchTerm,
  onSearchTermChange,
  sortKey,
  onSortKeyChange,
  sortDirection,
  onSortDirectionChange,
  filterFlagged,
  onFilterFlaggedChange,
}: PatientFilterControlsProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 rounded-lg border bg-card p-4 shadow-sm md:flex-row md:items-end">
      <div className="flex-grow">
        <Label htmlFor="search-patient" className="text-sm font-medium">Search Patients</Label>
        <div className="relative mt-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="search-patient"
            type="text"
            placeholder="Search by name, ID, diagnosis..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 md:flex md:items-end md:gap-2">
        <div>
            <Label htmlFor="sort-key" className="text-sm font-medium">Sort By</Label>
            <Select value={sortKey} onValueChange={onSortKeyChange}>
            <SelectTrigger id="sort-key" className="mt-1 w-full md:w-[180px]">
                <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="admissionDate">Admission Date</SelectItem>
                <SelectItem value="urgency">Urgency</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <div>
            <Label htmlFor="sort-direction" className="text-sm font-medium">Direction</Label>
            <Select value={sortDirection} onValueChange={onSortDirectionChange as (value: string) => void}>
            <SelectTrigger id="sort-direction" className="mt-1 w-full md:w-[120px]">
                <SelectValue placeholder="Order" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="asc"><ArrowUp className="mr-2 inline h-4 w-4" />Ascending</SelectItem>
                <SelectItem value="dsc"><ArrowDown className="mr-2 inline h-4 w-4" />Descending</SelectItem>
            </SelectContent>
            </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-2 md:pt-0 md:self-end md:pb-2">
        <Switch
          id="filter-flagged"
          checked={filterFlagged}
          onCheckedChange={onFilterFlaggedChange}
        />
        <Label htmlFor="filter-flagged" className="flex items-center text-sm font-medium">
          <Flag className="mr-2 h-4 w-4 text-destructive" /> Show Flagged Only
        </Label>
      </div>
    </div>
  );
}
