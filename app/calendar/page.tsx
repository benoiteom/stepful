"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect, useState } from "react";
import DatePicker from "@/components/DatePicker";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Minus } from "lucide-react";
import { TimeSlotDialog } from "@/components/TimeSlotDialog";
import { BookSlotDialog } from "@/components/BookSlotDialog";

const HOUR_WIDTH = 140;
const HOUR_OFFSET = 40;
const HOURS = [
  "01:00 AM",
  "02:00 AM",
  "03:00 AM",
  "04:00 AM",
  "05:00 AM",
  "06:00 AM",
  "07:00 AM",
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
  "09:00 PM",
  "10:00 PM",
  "11:00 PM",
];
const DAYS = { Mon: [], Tue: [], Wed: [], Thu: [], Fri: [], Sat: [], Sun: [] };

type TimeSlot = {
  id: number;
  coach_id: string;
  start: Date;
  end: Date;
  is_booked: boolean;
};

type Block = {
  id: number;
  left: number;
  start: Date;
  end: Date;
  is_booked: boolean;
};

export default function Calendar() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const getMondayForDate = (date: Date | undefined) => {
    if (!date) date = new Date();
    var day = date.getDay();
    var prevMonday = new Date();
    if (date.getDay() == 0) {
      prevMonday.setDate(date.getDate() - 7);
    } else {
      prevMonday.setDate(date.getDate() - (day - 1));
    }
    return new Date(prevMonday.setHours(0, 0, 0, 0));
  };

  const [date, setDate] = useState<Date | undefined>(undefined);

  const [blocks, setBlocks] = useState<Record<string, Block[]>>({});

  const [userType, setUserType] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    authCheck();
  }, []);

  useEffect(() => {
    if (!date) return;
    getBlocksByUserType(userType, userId);
  }, [date]);

  const authCheck = async () => {
    try {
      const res = await fetch("/api/auth");

      if (!res.ok) throw new Error("Failed to get slots for student");
      const user = await res.json();

      if (user && user.status !== 400) {
        let type = user.email.includes("coach") ? "coach" : null;
        type = type || (user.email.includes("student") ? "student" : null);
        if (!type) router.push("/");
        setUserType(type);
        setUserId(user.id);

        setDate(getMondayForDate(new Date()));
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const getBlocksByUserType = async (
    type: string | null,
    userId: string | null
  ) => {
    setLoading(true);
    if (type === "student") {
      try {
        const res = await fetch(
          "/api/slots/available?date=" +
            format(date || new Date(), "yyyy-MM-dd"),
          {
            method: "GET",
          }
        );
        if (!res.ok) throw new Error("Failed to get slots for student");
        const data = await res.json();
        setBlocks(
          data.reduce((acc: Record<string, Block[]>, slot: TimeSlot) => {
            const date = format(slot.start, "EEE");
            const block = {
              id: slot.id,
              left: new Date(slot.start).getHours() * HOUR_WIDTH + HOUR_OFFSET,
              start: slot.start,
              end: slot.end,
              is_booked: slot.is_booked,
            };
            acc[date] = [...acc[date], block];
            return acc;
          }, DAYS)
        );
      } catch (error) {
        console.error(error);
      }
    } else if (type === "coach") {
      try {
        const res = await fetch(
          "/api/slots?coachId=" +
            userId +
            "&date=" +
            format(date || new Date(), "yyyy-MM-dd"),
          {
            method: "GET",
          }
        );

        if (!res.ok) throw new Error("Failed to get slots for coach");
        const data = await res.json();
        setBlocks(
          data
            .filter((slot: TimeSlot) => !slot.is_booked && slot.coach_id === userId)
            .reduce((acc: Record<string, Block[]>, slot: TimeSlot) => {
              const date = format(slot.start, "EEE");
              const block = {
                id: slot.id,
                left:
                  new Date(slot.start).getHours() * HOUR_WIDTH + HOUR_OFFSET,
                start: slot.start,
                end: slot.end,
                is_booked: slot.is_booked,
              };
              acc[date] = [...acc[date], block];
              return acc;
            }, DAYS)
        );
      } catch (error) {
        console.error(error);
      }
    }
    setLoading(false);
  };

  const refreshSlots = () => {
    getBlocksByUserType(userType, userId);
  };

  return (
    <>
      <Navbar />
      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 w-full max-w-7xl px-3">
        <main className="w-full flex-1 flex flex-col gap-6">
          <p className="text-zinc-400 text-xs -mb-5">
            Availability for the week of:
          </p>
          <div className="w-full flex items-center justify-between">
            <DatePicker
              date={date}
              setDate={(e) => setDate(getMondayForDate(e))}
            />
            {userType === "coach" && userId && (
              <TimeSlotDialog coachId={userId} setNewSlot={refreshSlots} />
            )}
          </div>

          <div className="w-full mt-4 overflow-x-auto">
            {/* TIME LABELS */}
            <div
              className="relative h-6"
              style={{ width: HOUR_WIDTH * 24 + HOUR_OFFSET + "px" }}
            >
              {loading && (
                <div className="absolute top-3 left-3">
                  <div className="spinner spinner-dark" />
                </div>
              )}
              {HOURS.map((hour, index) => (
                <p
                  key={index}
                  className="absolute top-0 text-xs text-black -translate-x-1/2"
                  style={{
                    left: `${HOUR_WIDTH * (index + 1) + HOUR_OFFSET}px`,
                  }}
                >
                  {hour}
                </p>
              ))}
            </div>

            {/* TIME LINES */}
            <div
              className="relative"
              style={{ width: HOUR_WIDTH * 24 + HOUR_OFFSET + "px" }}
            >
              {HOURS.map((_, index) => (
                <div
                  key={index}
                  className="absolute top-0 w-0 border-r-2 border-r-zinc-100 border-dashed"
                  style={{
                    height: 96 * 7 + "px",
                    left: HOUR_WIDTH * (index + 1) + HOUR_OFFSET + "px",
                  }}
                />
              ))}
            </div>

            {/* CALENDAR ROWS */}
            {Object.keys(DAYS).map((day, index) => (
              <div
                key={index}
                className={`relative h-24 border-t-2 border-t-zinc-200 ${
                  index === Object.keys(DAYS).length - 1
                    ? "border-b-2 border-b-zinc-200"
                    : ""
                }`}
                style={{ width: HOUR_WIDTH * 24 + "px" }}
              >
                <p className="text-sm font-bold uppercase">{day}</p>

                {!loading &&
                  blocks &&
                  (blocks[day] || []).map((block, index) => (
                    <div
                      key={index}
                      className={`absolute cursor-pointer top-0 mt-1 flex items-center justify-center rounded-xl ${
                        block.is_booked ? "bg-indigo-600" : "bg-indigo-100"
                      }`}
                      style={{
                        width: HOUR_WIDTH * 2 - 2 + "px",
                        height: "86px",
                        left: block.left + 2 + "px",
                      }}
                    >
                      {block.is_booked ? (
                        <>
                          <p className="text-sm font-bold text-white">
                            Booked!
                          </p>
                          <p className="text-sm text-white">
                            {format(block.start, "p")} -{" "}
                            {format(block.end, "p")}
                          </p>
                        </>
                      ) : (
                        <>
                          {userType === "student" ? (
                            <BookSlotDialog timeSlotId={block.id} studentId={userId} />
                          ) : (
                            <Minus size={16} className="text-zinc-600" />
                          )}
                        </>
                      )}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </main>
      </div>
      <Footer />
    </>
  );
}
