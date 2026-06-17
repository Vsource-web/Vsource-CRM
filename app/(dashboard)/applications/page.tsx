// crm-frontend-next\app\(dashboard)\applications\page.tsx
"use client";
import { useState } from "react";
import { PageHeader, PageTransition } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, GripVertical } from "lucide-react";
import type { Application, ApplicationStage, University } from "@/types";
import { toast } from "sonner";
const names = [
  "Aarav Sharma",
  "Priya Iyer",
  "Rohan Kapoor",
  "Sneha Reddy",
  "Karan Mehta",
  "Ananya Singh",
  "Vikram Joshi",
  "Diya Patel",
  "Aditya Rao",
  "Isha Verma",
  "Arjun Nair",
  "Meera Pillai",
  "Yash Gupta",
  "Tara Bose",
  "Nikhil Khanna",
  "Riya Malhotra",
  "Kabir Sethi",
  "Aisha Khan",
  "Dev Choudhary",
  "Sara Ali",
];
const sources = [
  "Website",
  "Facebook",
  "Instagram",
  "Walk-in",
  "Referral",
  "Google Ads",
  "Education Fair",
  "QR Lead",
];
const branches = [
  "Hyderabad",
  "Bangalore",
  "Chennai",
  "Delhi",
  "Mumbai",
  "Pune",
  "Kolkata",
  "Vijayawada",
];
const counselors = [
  "Aditi Rao",
  "Vinod Bansal",
  "Sneha Kapoor",
  "Manoj Verma",
  "Pooja Iyer",
  "Rahul Singh",
];
const countries = [
  "USA",
  "UK",
  "Canada",
  "Australia",
  "Germany",
  "Ireland",
  "New Zealand",
  "France",
];
const programs = [
  "MS Computer Science",
  "MBA",
  "MS Data Science",
  "BBA",
  "MS Cybersecurity",
  "MS Finance",
  "MS Business Analytics",
  "BSc Nursing",
];
const intakes = ["Fall 2025", "Spring 2026", "Summer 2026", "Fall 2026"];
const pick = <T,>(arr: T[], i: number) => arr[i % arr.length];
const universities: University[] = [
  {
    id: "U1",
    name: "Stanford University",
    country: "USA",
    city: "Palo Alto",
    ranking: 3,
    tuitionFee: 58000,
    duration: "2 years",
    intakes: ["Fall", "Spring"],
    scholarships: true,
    programs: ["MS CS", "MBA"],
  },
  {
    id: "U2",
    name: "University of Toronto",
    country: "Canada",
    city: "Toronto",
    ranking: 18,
    tuitionFee: 42000,
    duration: "2 years",
    intakes: ["Fall"],
    scholarships: true,
    programs: ["MS Data Science"],
  },
  {
    id: "U3",
    name: "Oxford University",
    country: "UK",
    city: "Oxford",
    ranking: 2,
    tuitionFee: 52000,
    duration: "1 year",
    intakes: ["Fall"],
    scholarships: false,
    programs: ["MBA", "MSc"],
  },
  {
    id: "U4",
    name: "University of Melbourne",
    country: "Australia",
    city: "Melbourne",
    ranking: 33,
    tuitionFee: 38000,
    duration: "2 years",
    intakes: ["Feb", "Jul"],
    scholarships: true,
    programs: ["MS IT"],
  },
  {
    id: "U5",
    name: "TU Munich",
    country: "Germany",
    city: "Munich",
    ranking: 28,
    tuitionFee: 1500,
    duration: "2 years",
    intakes: ["Winter", "Summer"],
    scholarships: true,
    programs: ["MS Engineering"],
  },
  {
    id: "U6",
    name: "Trinity College Dublin",
    country: "Ireland",
    city: "Dublin",
    ranking: 81,
    tuitionFee: 26000,
    duration: "1 year",
    intakes: ["Fall"],
    scholarships: true,
    programs: ["MS CS", "MBA"],
  },
  {
    id: "U7",
    name: "University of Auckland",
    country: "New Zealand",
    city: "Auckland",
    ranking: 68,
    tuitionFee: 32000,
    duration: "1.5 years",
    intakes: ["Feb", "Jul"],
    scholarships: false,
    programs: ["MS Business"],
  },
  {
    id: "U8",
    name: "Sorbonne University",
    country: "France",
    city: "Paris",
    ranking: 35,
    tuitionFee: 18000,
    duration: "2 years",
    intakes: ["Sep"],
    scholarships: true,
    programs: ["MA", "MSc"],
  },
];

export const applications: Application[] = Array.from(
  { length: 18 },
  (_, i) => ({
    id: `AP${3000 + i}`,
    studentName: pick(names, i),
    university: pick(universities, i).name,
    program: pick(programs, i),
    stage: (
      ["inquiry", "documents", "applied", "offer", "visa", "enrolled"] as const
    )[i % 6],
    intake: pick(intakes, i),
    counselor: pick(counselors, i),
    updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
  }),
);
const STAGES: { key: ApplicationStage; label: string; color: string }[] = [
  { key: "inquiry", label: "Inquiry", color: "bg-info/15 text-info" },
  { key: "documents", label: "Documents", color: "bg-warning/15 text-warning" },
  { key: "applied", label: "Applied", color: "bg-primary/10 text-primary" },
  {
    key: "offer",
    label: "Offer Received",
    color: "bg-success/15 text-success",
  },
  { key: "visa", label: "Visa Process", color: "bg-chart-5/15 text-chart-5" },
  { key: "enrolled", label: "Enrolled", color: "bg-success text-white" },
];

function ApplicationsPage() {
  const [dragId, setDragId] = useState<string | null>(null);
  const [apps, setApps] = useState<Application[]>(applications);
  const [open, setOpen] = useState(false);
  const empty = {
    studentName: "",
    university: "",
    program: "MS Computer Science",
    intake: "Fall 2026",
    counselor: "Aditi Rao",
  };
  const [form, setForm] = useState(empty);

  const moveTo = (id: string, stage: ApplicationStage) => {
    setApps((prev) =>
      prev.map((a) =>
        a.id === id
          ? {
              ...a,
              stage,
              updatedAt: new Date().toISOString(),
            }
          : a,
      ),
    );
  };
  const add = () => {
    if (!form.studentName || !form.university)
      return toast.error("Student and university required");
    setApps([
      {
        id: `AP${Date.now()}`,
        ...form,
        stage: "inquiry",
        updatedAt: new Date().toISOString(),
      },
      ...apps,
    ]);
    setOpen(false);
    setForm(empty);
    toast.success("Application created");
  };

  return (
    <PageTransition>
      <PageHeader
        title="Applications"
        description="Kanban pipeline from inquiry to enrollment."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="size-4 mr-1.5" /> New Application
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New application</DialogTitle>
              </DialogHeader>
              <div className="grid gap-3 py-2">
                <div className="grid gap-1.5">
                  <Label>Student name</Label>
                  <Input
                    value={form.studentName}
                    onChange={(e) =>
                      setForm({ ...form, studentName: e.target.value })
                    }
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label>University</Label>
                  <Input
                    value={form.university}
                    onChange={(e) =>
                      setForm({ ...form, university: e.target.value })
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1.5">
                    <Label>Program</Label>
                    <Input
                      value={form.program}
                      onChange={(e) =>
                        setForm({ ...form, program: e.target.value })
                      }
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label>Intake</Label>
                    <Input
                      value={form.intake}
                      onChange={(e) =>
                        setForm({ ...form, intake: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label>Counselor</Label>
                  <Input
                    value={form.counselor}
                    onChange={(e) =>
                      setForm({ ...form, counselor: e.target.value })
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={add}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {STAGES.map((stage) => {
          const items = apps.filter((a) => a.stage === stage.key);
          return (
            <div
              key={stage.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dragId && moveTo(dragId, stage.key)}
              className="rounded-2xl bg-secondary/40 border border-border p-3 min-h-[420px]"
            >
              <div className="flex items-center justify-between mb-3">
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${stage.color}`}
                >
                  {stage.label}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((a) => (
                  <Card
                    key={a.id}
                    draggable
                    onDragStart={() => setDragId(a.id)}
                    onDragEnd={() => setDragId(null)}
                    className="cursor-grab active:cursor-grabbing hover:shadow-md transition-all"
                  >
                    <CardContent className="p-3">
                      <div className="flex items-start gap-1.5">
                        <GripVertical className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold truncate">
                            {a.studentName}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {a.university}
                          </div>
                          <div className="text-[11px] text-muted-foreground truncate">
                            {a.program}
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <Badge variant="outline" className="text-[9px]">
                              {a.intake}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground">
                              {a.counselor.split(" ")[0]}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {items.length === 0 && (
                  <div className="text-center text-[11px] text-muted-foreground py-8">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </PageTransition>
  );
}
export default ApplicationsPage;
