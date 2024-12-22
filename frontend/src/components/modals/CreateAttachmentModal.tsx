// components/modals/CreateAttachmentModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { DateRange } from "react-day-picker";
import { CalendarDateRangePicker } from "../ui/date-range-picker";
import { toast } from "sonner";
const attachmentSchema = z.object({
  name: z.string().min(1, "Название приложения обязательно"),
  advertiser_name: z.string().min(1, "Название рекламодателя обязательно"),
  advertiser_inn: z.string().min(10, "ИНН должен содержать 10 цифр"),
  advertiser_kpp: z.string().min(9, "КПП должен содержать 9 цифр"),
  brand_name: z.string().min(1, "Название бренда обязательно"),
  responsible_user_name: z.string().min(1, "Имя ответственного обязательно"),
  budget: z
    .string()
    .transform(Number)
    .pipe(z.number().min(0, "Бюджет должен быть положительным числом")),
  date_start: z.date(),
  date_end: z.date(),
});

interface CreateAttachmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  contractId: string;
}

export const CreateAttachmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  contractId,
}: CreateAttachmentModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<z.infer<typeof attachmentSchema>>({
    resolver: zodResolver(attachmentSchema),
  });

  const handleFormSubmit = async (data: z.infer<typeof attachmentSchema>) => {
    if (!dateRange.from || !dateRange.to) {
      toast.error("Выберите период действия приложения");
      return;
    }

    try {
      setIsLoading(true);
      await onSubmit({
        ...data,
        id: uuidv4(),
        date_start: dateRange.from.toISOString(),
        date_end: dateRange.to.toISOString(),
        status: "draft",
        contract_id: contractId,
        payments: [],
      });
      reset();
      setDateRange({ from: undefined, to: undefined });
      onClose();
    } catch (error) {
      console.error("Error creating attachment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Создание приложения</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("name")}
              placeholder="Название приложения"
              className="w-full"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("advertiser_name")}
              placeholder="Название рекламодателя"
              className="w-full"
            />
            {errors.advertiser_name && (
              <p className="text-sm text-red-500">
                {errors.advertiser_name.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                {...register("advertiser_inn")}
                placeholder="ИНН"
                className="w-full"
              />
              {errors.advertiser_inn && (
                <p className="text-sm text-red-500">
                  {errors.advertiser_inn.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input
                {...register("advertiser_kpp")}
                placeholder="КПП"
                className="w-full"
              />
              {errors.advertiser_kpp && (
                <p className="text-sm text-red-500">
                  {errors.advertiser_kpp.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Input
              {...register("brand_name")}
              placeholder="Название бренда"
              className="w-full"
            />
            {errors.brand_name && (
              <p className="text-sm text-red-500">
                {errors.brand_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("responsible_user_name")}
              placeholder="Ответственный"
              className="w-full"
            />
            {errors.responsible_user_name && (
              <p className="text-sm text-red-500">
                {errors.responsible_user_name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("budget")}
              type="number"
              placeholder="Бюджет"
              className="w-full"
            />
            {errors.budget && (
              <p className="text-sm text-red-500">{errors.budget.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <CalendarDateRangePicker
              date={dateRange}
              onDateChange={(range) => {
                setDateRange(range);
              }}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                setDateRange({ from: undefined, to: undefined });
                onClose();
              }}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
