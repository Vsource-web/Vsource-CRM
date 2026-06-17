
// crm-frontend-next\app\components\universities\university-course-form.tsx
"use client";

import { memo } from "react";
import { UseFieldArrayRemove, Control, useController } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Trash2 } from "lucide-react";

import { UniversityFormValues } from "@/lib/university-schema";

interface Props {
  index: number;
  control: Control<UniversityFormValues>;
  remove: UseFieldArrayRemove;
}

const DEGREE_OPTIONS = [
  "diploma",
  "bachelors",
  "masters",
  "phd",
  "mba",
  "certificate",
] as const;

function UniversityCourseFormComponent({ index, control, remove }: Props) {
  const { field: name } = useController({
    control,
    name: `courses.${index}.name`,
  });

  const { field: courseCode } = useController({
    control,
    name: `courses.${index}.courseCode`,
  });

  const { field: degree } = useController({
    control,
    name: `courses.${index}.degree`,
  });

  const { field: durationMonths } = useController({
    control,
    name: `courses.${index}.durationMonths`,
  });

  const { field: annualFee } = useController({
    control,
    name: `courses.${index}.annualTuitionFee`,
  });

  const { field: totalFee } = useController({
    control,
    name: `courses.${index}.totalTuitionFee`,
  });

  const { field: currency } = useController({
    control,
    name: `courses.${index}.currency`,
  });

  const { field: intake } = useController({
    control,
    name: `courses.${index}.intake`,
  });

  const { field: minimumPercentage } = useController({
    control,
    name: `courses.${index}.minimumPercentage`,
  });

  const { field: backlogLimit } = useController({
    control,
    name: `courses.${index}.backlogLimit`,
  });

  const { field: ieltsOverall } = useController({
    control,
    name: `courses.${index}.ieltsOverall`,
  });

  const { field: applicationDeadline } = useController({
    control,
    name: `courses.${index}.applicationDeadline`,
  });

  const { field: description } = useController({
    control,
    name: `courses.${index}.description`,
  });

  return (
    <Card className="rounded-2xl border">
      <CardContent className="p-5 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Course #{index + 1}</h4>

            <p className="text-sm text-muted-foreground">Course information</p>
          </div>

          <Button
            type="button"
            variant="destructive"
            size="icon"
            onClick={() => remove(index)}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>

        {/* Basic */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Course Name</Label>

            <Input
              value={name.value ?? ""}
              onChange={name.onChange}
              placeholder="Master of Computer Science"
            />
          </div>

          <div className="space-y-2">
            <Label>Course Code</Label>

            <Input
              value={courseCode.value ?? ""}
              onChange={courseCode.onChange}
              placeholder="MCS001"
            />
          </div>
        </div>

        {/* Degree */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Degree</Label>

            <Select value={degree.value} onValueChange={degree.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select degree" />
              </SelectTrigger>

              <SelectContent>
                {DEGREE_OPTIONS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Duration (Months)</Label>

            <Input
              type="number"
              value={durationMonths.value ?? ""}
              onChange={(e) => durationMonths.onChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Fees */}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Annual Fee</Label>

            <Input
              type="number"
              value={annualFee.value ?? ""}
              onChange={(e) => annualFee.onChange(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Total Fee</Label>

            <Input
              type="number"
              value={totalFee.value ?? ""}
              onChange={(e) => totalFee.onChange(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>Currency</Label>

            <Input
              value={currency.value ?? ""}
              onChange={currency.onChange}
              placeholder="AUD"
            />
          </div>
        </div>

        {/* Intake */}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Intake</Label>

            <Input
              value={intake.value ?? ""}
              onChange={intake.onChange}
              placeholder="February"
            />
          </div>

          <div className="space-y-2">
            <Label>Application Deadline</Label>

            <Input
              type="date"
              value={applicationDeadline.value ?? ""}
              onChange={applicationDeadline.onChange}
            />
          </div>
        </div>

        {/* Requirements */}

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Minimum Percentage</Label>

            <Input
              type="number"
              value={minimumPercentage.value ?? ""}
              onChange={(e) =>
                minimumPercentage.onChange(Number(e.target.value))
              }
            />
          </div>

          <div className="space-y-2">
            <Label>Backlog Limit</Label>

            <Input
              type="number"
              value={backlogLimit.value ?? ""}
              onChange={(e) => backlogLimit.onChange(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label>IELTS Overall</Label>

            <Input
              type="number"
              step="0.5"
              value={ieltsOverall.value ?? ""}
              onChange={(e) => ieltsOverall.onChange(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Description */}

        <div className="space-y-2">
          <Label>Description</Label>

          <Textarea
            rows={4}
            value={description.value ?? ""}
            onChange={description.onChange}
            placeholder="Course description..."
          />
        </div>
      </CardContent>
    </Card>
  );
}

export const UniversityCourseForm = memo(UniversityCourseFormComponent);
