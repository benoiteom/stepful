import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle } from "lucide-react";
import { useState } from "react";

export function TimeSlotDialog({ coachId, setNewSlot }: { coachId: string | null, setNewSlot: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const [month, day, year] = date.split("/");
      const [hour, minute] = time.split(":");
      const newDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );
      const res = await fetch("/api/slots", {
        method: "POST",
        body: JSON.stringify({
          date: newDate.toISOString(),
          coachId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create time slot");
      setIsOpen(false);
      setNewSlot();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-48 rounded-lg" onClick={() => setIsOpen(true)}>
          <PlusCircle width={18} />
          <span className="font-normal ml-2">New Time Slot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Time Slot</DialogTitle>
          <DialogDescription>
            Add a new time slot for students to book.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            type="text"
            id="date"
            placeholder="MM/DD/YYYY"
            className="mb-2"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Label htmlFor="time">Time</Label>
          <Input
            type="text"
            id="time"
            placeholder="HH:MM"
            className="mb-2"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>
        <DialogFooter>
          {isLoading && (
            <div className="relative mr-4">
              <div className="spinner spinner-dark" />
            </div>
          )}
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
