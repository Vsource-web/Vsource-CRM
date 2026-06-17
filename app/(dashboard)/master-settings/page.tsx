// crm-frontend-next\app\(dashboard)\master-settings\page.tsx
"use client";

import { useEffect, useState } from "react";

import { PageHeader, PageTransition } from "@/components/common/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Plus, Trash2 } from "lucide-react";

import { toast } from "sonner";

import {
  MasterItem,
  getMasters,
  createMaster,
  deleteMaster,
} from "@/lib/master-settings";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categories = [
  {
    key: "countries",
    label: "Countries",
    endpoint: "/countries",
  },
  {
    key: "intakes",
    label: "Intakes",
    endpoint: "/intakes",
  },
  {
    key: "lead-sources",
    label: "Lead Sources",
    endpoint: "/lead-sources",
  },
  {
    key: "lead-degrees",
    label: "Lead Degrees",
    endpoint: "/lead-degrees",
  },
  {
    key: "lead-universities",
    label: "Lead Universities",
    endpoint: "/lead-universities",
  },
];

export default function MasterSettings() {
  const [selected, setSelected] = useState<(typeof categories)[number]["key"]>(
    categories[0].key,
  );
  const [items, setItems] = useState<MasterItem[]>([]);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const current = categories.find((x) => x.key === selected)!;

  const loadData = async () => {
    try {
      setLoading(true);

      const data = await getMasters(current.endpoint);

      setItems(data);
    } catch {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selected]);

  const handleAdd = async () => {
    if (!value.trim()) {
      return;
    }

    try {
      await createMaster(current.endpoint, value.trim());

      toast.success(`${current.label} added`);

      setValue("");
      await loadData();
    } catch {
      toast.error("Failed to add");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMaster(current.endpoint, id);

      toast.success("Deleted");
      await loadData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <PageTransition>
      <div className="space-y-6">
        <PageHeader
          title="Master Settings"
          description="Manage Countries, Intakes, Lead Sources, Lead Degrees and Lead Universities"
        />

        <Card>
          <CardContent className="space-y-6 p-6">
            <div className="overflow-x-auto">
              <Tabs
                value={selected}
                onValueChange={(value) =>
                  setSelected(value as (typeof categories)[number]["key"])
                }
              >
                <TabsList className="inline-flex min-w-max">
                  {categories.map((item) => (
                    <TabsTrigger
                      key={item.key}
                      value={item.key}
                      className="px-6 whitespace-nowrap"
                    >
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Input
                className="flex-1"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Add new ${current.label.slice(0, -1)}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAdd();
                  }
                }}
              />

              <Button onClick={handleAdd}>
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </div>

            <div className="space-y-2">
              {loading ? (
                <p>Loading...</p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-2xl border bg-card px-4 py-3 shadow-sm"
                  >
                    <span>{item.name}</span>

                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageTransition>
  );
}
