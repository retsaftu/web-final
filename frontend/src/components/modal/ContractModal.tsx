import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { IContract, IAttachment, IPayment, ContractStatus } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Модалка создания/редактирования договора
export const ContractModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IContract>) => void;
  initialData?: IContract;
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      number: "",
      agency: "",
      agency_inn: "",
      agency_kpp: "",
      status: ContractStatus.ACTIVE,
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Редактировать договор" : "Создать договор"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Номер договора</Label>
            <Input
              value={formData.number}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, number: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Агентство</Label>
            <Input
              value={formData.agency}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, agency: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>ИНН</Label>
            <Input
              value={formData.agency_inn}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, agency_inn: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>КПП</Label>
            <Input
              value={formData.agency_kpp}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, agency_kpp: e.target.value }))
              }
            />
          </div>
          <div>
            <Label>Статус</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  status: value as ContractStatus,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(ContractStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button onClick={() => onSubmit(formData)}>Сохранить</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
