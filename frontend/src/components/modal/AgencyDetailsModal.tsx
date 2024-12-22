import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Agency, LegalEntity } from "@/types/projects";
import { Button } from "../ui/button";
import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface AgencyDetailsModalProps {
  agency: Agency | null;
  onClose: () => void;
}

export const AgencyDetailsModal: React.FC<AgencyDetailsModalProps> = ({
  agency,
  onClose,
}) => {
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");
  const [showConfirm, setShowConfirm] = useState(false);

  // Устанавливаем selectedEntityId при изменении agency
  useEffect(() => {
    if (!agency) return;
    if (agency?.legal_entities?.length > 0) {
      setSelectedEntityId(agency.legal_entities[0].id);
    }
  }, [agency]);

  if (!agency) return null;

  const handleSetActive = () => {
    setShowConfirm(true);
  };

  const confirmSetActive = () => {
    // TODO: API call to update active entity
    setShowConfirm(false);
  };

  return (
    <>
      <Dialog open={!!agency} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{agency.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {agency.legal_entities?.length > 0 ? (
              agency.legal_entities.map((entity: LegalEntity) => (
                <div
                  key={entity.id}
                  className={`border p-6 rounded-lg ${
                    entity.id === selectedEntityId
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg">{entity.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEntityId(entity.id)}
                      >
                        Просмотреть
                      </Button>
                      {entity.id === selectedEntityId && (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={handleSetActive}
                        >
                          Сделать активным
                        </Button>
                      )}
                    </div>
                  </div>

                  {entity.id === selectedEntityId && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-500">БИН</div>
                        <div className="font-medium">{entity.bin}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">ИНН</div>
                        <div className="font-medium">{entity.inn}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Банк</div>
                        <div className="font-medium">{entity.bank_name}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">БИК</div>
                        <div className="font-medium">{entity.bik}</div>
                      </div>
                      <div className="col-span-2">
                        <div className="text-sm text-gray-500">Номер счета</div>
                        <div className="font-medium break-all">
                          {entity.account_number}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-4">
                Нет доступных юридических лиц
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение смены реквизитов</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите сменить текущие реквизиты? Это действие
              повлияет на все новые транзакции.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSetActive}>
              Подтвердить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
