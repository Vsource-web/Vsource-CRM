// app\components\common\CommandPalette.tsx
"use client";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAuth, useUi } from "@/store";
import { navigationItems } from "@/config/navigation";

export function CommandPalette() {
  const { commandOpen, setCommandOpen } = useUi();
  const router = useRouter();

  const canRead = useAuth((s) => s.canRead);
  const canCreateLead = useAuth((s) => s.canCreate("MASTER_LEADS"));

  const canCreateMbbs = useAuth((s) => s.canCreate("MBBS_LEADS"));

  const allowedItems = navigationItems.filter((item) =>
    canRead(item.moduleCode),
  );

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search modules, leads, students…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {allowedItems.map((it) => {
            const Icon = it.icon;
            return (
              <CommandItem
                key={it.to}
                onSelect={() => {
                  router.push(it.to);
                  setCommandOpen(false);
                }}
              >
                <Icon className="size-4 mr-2" /> {it.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          {canCreateLead && (
            <CommandItem
              onSelect={() => {
                router.push("/leads/add");
                setCommandOpen(false);
              }}
            >
              + Add Masters Lead
            </CommandItem>
          )}
          {canCreateMbbs && (
            <CommandItem
              onSelect={() => {
                router.push("/mbbs-leads/add");
                setCommandOpen(false);
              }}
            >
              + Add MBBS Lead
            </CommandItem>
          )}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
