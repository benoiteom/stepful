"use client";

import {
  ArrowUpCircle,
  CheckCircle2,
  CircleEllipsis,
  LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

type Status = {
  value: string;
  label: string;
  icon: LucideIcon;
};

const statuses: Status[] = [
  {
    value: "new",
    label: "New",
    icon: ArrowUpCircle,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: CircleEllipsis,
  },
  {
    value: "resolved",
    label: "Resolved",
    icon: CheckCircle2,
  },
];

export default function StatusDropdown({
  statusKey,
  setStatus,
}: {
  statusKey: string;
  setStatus: (_: string) => void;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedStatus, setSelectedStatus] = useState<Status | null>(
    statuses.find((status) => status.value === statusKey) || null
  );

  useEffect(() => {
    setSelectedStatus(statuses.find((status) => status.value === statusKey) || null);
  }, [statusKey]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="w-[124px] justify-center">
          {selectedStatus ? (
            <>
              <selectedStatus.icon className="mr-2 h-4 w-4 shrink-0" />
              {selectedStatus.label}
            </>
          ) : (
            <>Set status</>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 max-w-[124px]" side="bottom" align="start">
        <Command>
          <CommandList>
            <CommandGroup>
              {statuses.map((status) => (
                <CommandItem
                  key={status.value}
                  value={status.value}
                  onSelect={(value) => {
                    setStatus(value);
                    setOpen(false);
                  }}
                >
                  <status.icon className="mr-2 h-4 w-4" />
                  <span>{status.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
