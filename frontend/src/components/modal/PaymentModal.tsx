import { IPayment } from "@/types/contracts";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

export const PaymentModal = ({
  isOpen,
  onClose,
  onSubmit,
  attachmentId,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IPayment>) => void;
  attachmentId: string;
  initialData?: IPayment;
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      date: new Date().toISOString(),
      amount: 0,
      status: "planned",
      attachment_id: attachmentId,
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Редактировать платеж" : "Создать платеж"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Поля для платежа */}
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
