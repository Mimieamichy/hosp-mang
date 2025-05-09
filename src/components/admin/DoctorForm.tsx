"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { Doctor } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addDoctor, updateDoctor } from "@/lib/actions"; // Server actions
import { useToast } from "@/hooks/use-toast";

const doctorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(50, "Name must be at most 50 characters."),
  specialty: z.string().min(2, "Specialty must be at least 2 characters.").max(50, "Specialty must be at most 50 characters."),
});

type DoctorFormValues = z.infer<typeof doctorFormSchema>;

interface DoctorFormProps {
  doctor?: Doctor | null;
  onSubmitSuccess: (doctor: Doctor) => void;
  onCancel: () => void;
}

export function DoctorForm({ doctor, onSubmitSuccess, onCancel }: DoctorFormProps) {
  const { toast } = useToast();
  const form = useForm<DoctorFormValues>({
    resolver: zodResolver(doctorFormSchema),
    defaultValues: {
      name: doctor?.name || "",
      specialty: doctor?.specialty || "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: DoctorFormValues) {
    try {
      if (doctor) {
        // Update existing doctor
        const updatedDoctorData: Doctor = { ...doctor, ...values };
        const result = await updateDoctor(updatedDoctorData);
        if (result) {
          onSubmitSuccess(result);
        } else {
          toast({ title: "Error", description: "Failed to update doctor.", variant: "destructive" });
        }
      } else {
        // Add new doctor
        const result = await addDoctor(values);
        onSubmitSuccess(result);
      }
    } catch (error) {
      console.error("Failed to save doctor:", error);
      toast({ title: "Error", description: "An error occurred while saving the doctor.", variant: "destructive" });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Dr. John Doe" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="specialty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Specialty</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Cardiology" {...field} disabled={isSubmitting} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (doctor ? "Saving..." : "Adding..." ): (doctor ? "Save Changes" : "Add Doctor")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
