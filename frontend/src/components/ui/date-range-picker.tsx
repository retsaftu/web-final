import * as React from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import { ru } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";

interface CalendarDateRangePickerProps {
  className?: string;
  date: DateRange | undefined;
  onDateChange: (date: DateRange | undefined) => void; // Изменили тип
}

export function CalendarDateRangePicker({
  className,
  date,
  onDateChange,
}: CalendarDateRangePickerProps) {
  const handleDateChange: SelectRangeEventHandler = (range) => {
    onDateChange(range); // Теперь TypeScript не будет жаловаться
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd.MM.yyyy", { locale: ru })} -{" "}
                  {format(date.to, "dd.MM.yyyy", { locale: ru })}
                </>
              ) : (
                format(date.from, "dd.MM.yyyy", { locale: ru })
              )
            ) : (
              <span>Выберите период</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            locale={ru}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
