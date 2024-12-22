// components/modals/CreateContractModal.tsx
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

const contractSchema = z.object({
  number: z.string().min(1, "Номер договора обязателен"),
  agency: z.string().min(1, "Название агентства обязательно"),
  agency_inn: z
    .string()
    .min(10, "ИНН должен содержать 10 цифр")
    .max(12, "ИНН должен содержать максимум 12 цифр"),
  agency_kpp: z.string().min(9, "КПП должен содержать 9 цифр"),
});

interface CreateContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (
    data: z.infer<typeof contractSchema> & { status: string }
  ) => Promise<void>;
  channelId: string;
}

export const CreateContractModal = ({
  isOpen,
  onClose,
  onSubmit,
  channelId,
}: CreateContractModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<z.infer<typeof contractSchema>>({
    resolver: zodResolver(contractSchema),
  });

  const handleFormSubmit = async (data: z.infer<typeof contractSchema>) => {
    try {
      setIsLoading(true);
      // Добавляем статус "draft" и id по умолчанию
      await onSubmit({
        ...data,
        status: "draft",
        id: uuidv4(), // Генерируем уникальный id
      });
      reset();
      onClose();
    } catch (error) {
      console.error("Error creating contract:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Создание нового договора</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Input
              {...register("number")}
              placeholder="Номер договора"
              className={errors.number ? "border-red-500" : ""}
            />
            {errors.number && (
              <p className="text-sm text-red-500">{errors.number.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("agency")}
              placeholder="Рекламное агентство"
              className={errors.agency ? "border-red-500" : ""}
            />
            {errors.agency && (
              <p className="text-sm text-red-500">{errors.agency.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("agency_inn")}
              placeholder="ИНН"
              className={errors.agency_inn ? "border-red-500" : ""}
            />
            {errors.agency_inn && (
              <p className="text-sm text-red-500">
                {errors.agency_inn.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              {...register("agency_kpp")}
              placeholder="КПП"
              className={errors.agency_kpp ? "border-red-500" : ""}
            />
            {errors.agency_kpp && (
              <p className="text-sm text-red-500">
                {errors.agency_kpp.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
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
