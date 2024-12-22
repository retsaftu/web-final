// components/modals/ContractModal.tsx
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { IContract } from "@/types/contracts";

interface ContractModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<IContract>;
  mode: "create" | "edit";
}

export const ContractModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode,
}: ContractModalProps) => {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: initialData || {},
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Создать договор" : "Редактировать договор"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Input {...register("number")} placeholder="Номер договора" />
          </div>
          <div>
            <Input {...register("agency")} placeholder="Рекламное агентство" />
          </div>
          <div>
            <Input {...register("agency_inn")} placeholder="ИНН" />
          </div>
          <div>
            <Input {...register("agency_kpp")} placeholder="КПП" />
          </div>
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit">
              {mode === "create" ? "Создать" : "Сохранить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
