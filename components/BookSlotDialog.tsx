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
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function BookSlotDialog({ timeSlotId, studentId }: { timeSlotId: number | null, studentId: string | null }) {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/slots/available", {
        method: "POST",
        body: JSON.stringify({
          timeSlotId,
          studentId,
        }),
      });

      if (!res.ok) throw new Error("Failed to create time slot");
      setIsOpen(false);
      router.push("/calls")
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-48 rounded-lg bg-indigo-100" variant={"link"} onClick={() => setIsOpen(true)}>
          <PlusCircle width={18} />
          <span className="font-normal ml-2">Book Time Slot</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Book Time Slot</DialogTitle>
          <DialogDescription>
            Book this time slot to meet with a coach.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {isLoading && (
            <div className="relative mr-4">
              <div className="spinner spinner-dark" />
            </div>
          )}
          <Button type="submit" onClick={handleSubmit}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
