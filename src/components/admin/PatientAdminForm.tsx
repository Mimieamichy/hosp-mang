"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Patient } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CalendarIcon, Flag } from "lucide-react";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import { addPatient, updatePatient } from "@/lib/actions";
import { useToast } from "@/hooks/use-toast";

const patientFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50),
  dateOfBirth: z.date({ required_error: "Date of birth is required." }),
  admissionDate: z.date({ required_error: "Admission date is required." }),
  urgency: z.enum(["High", "Medium", "Low"]),
  isFlagged: z.boolean().default(false),
  roomNumber: z.string().optional(),
  diagnosis: z.string().optional(),
  notes: z.string().optional(),
});

type PatientFormValues = z.infer<typeof patientFormSchema>;

interface PatientAdminFormProps {
  patient?: Patient | null;
  onSubmitSuccess: (patient: Patient) => void;
  onCancel: () => void;
}

export function PatientAdminForm({ patient, onSubmitSuccess, onCancel }: PatientAdminFormProps) {
  const { toast } = useToast();
  const form = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      name: patient?.name || "",
      dateOfBirth: patient?.dateOfBirth ? new Date(patient.dateOfBirth) : undefined,
      admissionDate: patient?.admissionDate ? new Date(patient.admissionDate) : new Date(),
      urgency: patient?.urgency || "Medium",
      isFlagged: patient?.isFlagged || false,
      roomNumber: patient?.roomNumber || "",
      diagnosis: patient?.diagnosis || "",
      notes: patient?.notes || "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: PatientFormValues) {
    const patientData = {
      ...values,
      dateOfBirth: format(values.dateOfBirth, "yyyy-MM-dd"),
      admissionDate: format(values.admissionDate, "yyyy-MM-dd"),
    };

    try {
      if (patient) {
        const updatedPatientData: Patient = { ...patient, ...patientData };
        const result = await updatePatient(updatedPatientData);
        if (result) {
          onSubmitSuccess(result);
        } else {
          toast({ title: "Error", description: "Failed to update patient.", variant: "destructive" });
        }
      } else {
        const result = await addPatient(patientData);
        onSubmitSuccess(result);
      }
    } catch (error) {
      console.error("Failed to save patient:", error);
      toast({ title: "Error", description: "An error occurred while saving the patient record.", variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto p-1 pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl><Input placeholder="e.g., Alice Wonderland" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of Birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="admissionDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Admission Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                      >
                        {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="urgency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Urgency Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl><SelectTrigger><SelectValue placeholder="Select urgency" /></SelectTrigger></FormControl>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="roomNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number (Optional)</FormLabel>
              <FormControl><Input placeholder="e.g., 101A" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="diagnosis"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Diagnosis (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Initial diagnosis or reason for admission" className="resize-none" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes (Optional)</FormLabel>
              <FormControl><Textarea placeholder="Any other relevant notes for this patient" className="min-h-[100px] resize-y" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isFlagged"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="flex items-center">
                  <Flag className={cn("mr-2 h-4 w-4", field.value ? "text-destructive" : "text-muted-foreground")} />
                  Flag this record for follow-up
                </FormLabel>
                <FormDescription>
                  Flagged records will be highlighted for special attention.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (patient ? "Saving..." : "Registering...") : (patient ? "Save Changes" : "Register Patient")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
