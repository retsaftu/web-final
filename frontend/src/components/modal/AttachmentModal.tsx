import { IAttachment } from "@/types/contracts";
import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";

export const AttachmentModal = ({
  isOpen,
  onClose,
  onSubmit,
  contractId,
  initialData,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<IAttachment>) => void;
  contractId: string;
  initialData?: IAttachment;
}) => {
  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      date_start: "",
      date_end: "",
      budget: 0,
      advertiser_name: "",
      advertiser_inn: "",
      advertiser_kpp: "",
      brand_name: "",
      responsible_user_name: "",
      status: "active",
      contract_id: contractId,
    }
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Редактировать приложение" : "Создать приложение"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Аналогичные поля для приложения */}
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
