import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Plus, Trash, FileText, Calendar } from "lucide-react";
import { useContractStore } from "@/store/contractStore";
import { useEffect, useState } from "react";
import { ContractFilters } from "./ContractFilters";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { contractsApi } from "@/api/contracts";
import { ICreateContract } from "@/types/contracts";
import { CreateContractModal } from "../modals/CreateContractModal";
import { toast } from "sonner";
import { CreateAttachmentModal } from "../modals/CreateAttachmentModal";

type ModalType = "contract" | "attachment" | "payment" | null;
type ModalMode = "create" | "edit";

interface DeleteConfirmState {
  isOpen: boolean;
  type: "contract" | "attachment" | "payment" | null;
  id: number | null;
  name: string;
}

export const ContractsTable = () => {
  const { channels, loading, error, fetchContracts } = useContractStore();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    channel: "all",
    agency: "all",
    year: "all",
    status: "all",
  });

  // Состояние для модальных окон
  const [modalState, setModalState] = useState({
    type: null as ModalType,
    mode: "create" as ModalMode,
    isOpen: false,
    data: null as any,
  });

  // Состояние для диалога подтверждения удаления
  const [deleteConfirm, setDeleteConfirm] = useState<DeleteConfirmState>({
    isOpen: false,
    type: null,
    id: null,
    name: "",
  });

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // Обработчики модальных окон
  const handleModal = (type: ModalType, mode: ModalMode, data: any = null) => {
    setModalState({
      type,
      mode,
      isOpen: true,
      data,
    });
  };

  // Обработчики удаления
  const handleDeleteConfirm = (
    type: "contract" | "attachment" | "payment",
    id: number,
    name: string
  ) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id,
      name,
    });
  };

  const handleDelete = async () => {
    if (!deleteConfirm.id || !deleteConfirm.type) return;

    try {
      switch (deleteConfirm.type) {
        case "contract":
          // await deleteContract(deleteConfirm.id);
          break;
        case "attachment":
          // await deleteAttachment(deleteConfirm.id);
          break;
        case "payment":
          // await deletePaymentSchedule(deleteConfirm.id);
          break;
      }
      await fetchContracts();
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setDeleteConfirm({ isOpen: false, type: null, id: null, name: "" });
    }
  };

  // В ContractsTable добавим:
  const handleCreateContract = async (data: ICreateContract) => {
    try {
      // Создаем договор
      const newContract = await contractsApi.createContract(data);

      // Получаем список всех каналов
      const channels = await contractsApi.getChannels();
      console.log("🚀 ~ handleCreateContract ~ channels:", channels);

      // Находим нужный канал
      const targetChannel = channels.data.find(
        (channel) => channel.id === modalState.data.channelId
      );

      if (!targetChannel) {
        throw new Error("Канал не найден");
      }

      // Создаем обновленный массив договоров для канала
      const updatedContracts = [...targetChannel.contracts, newContract.id];

      // Обновляем канал с новым списком договоров
      await contractsApi.updateChannel({
        id: targetChannel.id,
        name: targetChannel.name,
        contracts: updatedContracts,
      });

      // Обновляем список договоров
      await fetchContracts();

      toast.success("Договор успешно создан");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ошибка при создании договора");
    }
  };

  // В ContractsTable добавим:
  const handleCreateAttachment = async (data: any) => {
    try {
      // Создаем приложение
      await contractsApi.createAttachment(data);

      // Обновляем список договоров
      await fetchContracts();

      toast.success("Приложение успешно создано");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ошибка при создании приложения");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <span>Ошибка: {error}</span>
      </div>
    );
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("ru-RU", {
      style: "currency",
      currency: "KZT",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "dd.MM.yyyy", { locale: ru });
  };

  // Фильтрация данных (оставляем как есть)
  const filteredChannels = channels
    .filter((channel) => {
      if (filters.channel !== "all" && channel.name !== filters.channel)
        return false;

      const searchLower = search.toLowerCase();
      const channelMatches = channel.name.toLowerCase().includes(searchLower);
      const contractMatches = channel.contracts.some(
        (contract) =>
          contract.number.toLowerCase().includes(searchLower) ||
          contract.agency.toLowerCase().includes(searchLower) ||
          contract.attachments.some(
            (att) =>
              att.advertiser_name.toLowerCase().includes(searchLower) ||
              att.brand_name.toLowerCase().includes(searchLower)
          )
      );

      return channelMatches || contractMatches;
    })
    .map((channel) => ({
      ...channel,
      contracts: channel.contracts.filter((contract) => {
        if (filters.agency !== "all" && contract.agency !== filters.agency)
          return false;

        if (filters.year !== "all") {
          return contract.attachments.some(
            (att) =>
              new Date(att.date_start).getFullYear().toString() === filters.year
          );
        }

        if (filters.status !== "all" && contract.status !== filters.status)
          return false;

        return true;
      }),
    }))
    .filter((channel) => channel.contracts.length > 0);

  // Получение уникальных значений для фильтров (оставляем как есть)
  const uniqueChannels = [...new Set(channels.map((c) => c.name))];
  const uniqueAgencies = [
    ...new Set(
      channels.flatMap((c) => c.contracts.map((contract) => contract.agency))
    ),
  ];
  const uniqueYears = [
    ...new Set(
      channels.flatMap((c) =>
        c.contracts.flatMap((contract) =>
          contract.attachments.map((att) =>
            new Date(att.date_start).getFullYear().toString()
          )
        )
      )
    ),
  ].sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-4">
      <ContractFilters
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        uniqueChannels={uniqueChannels}
        uniqueAgencies={uniqueAgencies}
        uniqueYears={uniqueYears}
      />

      <div className="rounded-md border bg-white shadow-sm">
        {filteredChannels.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            Договоры не найдены
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-[#ccc0da] hover:bg-[#ccc0da]">
                <TableCell className="font-semibold">Канал</TableCell>
                <TableCell className="font-semibold">
                  Рекламное агентство
                </TableCell>
                <TableCell className="font-semibold">№ Договора</TableCell>
                <TableCell className="font-semibold">ИНН/КПП</TableCell>
                <TableCell className="font-semibold">
                  Клиент рекламного агентства
                </TableCell>
                <TableCell className="font-semibold">
                  Наименование бренда
                </TableCell>
                <TableCell className="font-semibold">Приложение</TableCell>
                <TableCell className="font-semibold">Бюджет</TableCell>
                <TableCell className="font-semibold">Срок действия</TableCell>
                <TableCell className="font-semibold">Ответственный</TableCell>
                <TableCell className="font-semibold">Статус</TableCell>
                <TableCell className="font-semibold">Действия</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredChannels.map((channel) => (
                <>
                  <TableRow
                    key={`channel-${channel.id}`}
                    className="bg-[#ccc0da] hover:bg-[#ccc0da]"
                  >
                    <TableCell colSpan={11} className="text-center font-medium">
                      {channel.name}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleModal("contract", "create", {
                            channelId: channel.id,
                          })
                        }
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Новый договор
                      </Button>
                    </TableCell>
                  </TableRow>

                  {channel.contracts.map((contract) => (
                    <>
                      <TableRow
                        key={`contract-${contract.id}`}
                        className="bg-[#ccc0da] hover:bg-[#ccc0da]"
                      >
                        <TableCell>{channel.name}</TableCell>
                        <TableCell>{contract.agency}</TableCell>
                        <TableCell>{contract.number}</TableCell>
                        <TableCell>
                          {contract.agency_inn}/{contract.agency_kpp}
                        </TableCell>
                        <TableCell colSpan={6}></TableCell>
                        <TableCell>{contract.status}</TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleModal("contract", "edit", contract)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDeleteConfirm(
                                  "contract",
                                  contract.id,
                                  contract.number
                                )
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleModal("attachment", "create", {
                                  contractId: contract.id,
                                })
                              }
                              className="h-8 w-8 p-0"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>

                      {contract.attachments.map((attachment, index) => (
                        <TableRow
                          key={`attachment-${attachment.id}`}
                          className={
                            index % 2 === 0
                              ? "bg-gray-50/50 hover:bg-gray-100/80"
                              : "bg-white hover:bg-gray-50/80"
                          }
                        >
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell></TableCell>
                          <TableCell>{attachment.advertiser_name}</TableCell>
                          <TableCell>{attachment.brand_name}</TableCell>
                          <TableCell>{attachment.name}</TableCell>
                          <TableCell>
                            {formatMoney(attachment.budget)}
                          </TableCell>
                          <TableCell>
                            {formatDate(attachment.date_start)} -{" "}
                            {formatDate(attachment.date_end)}
                          </TableCell>
                          <TableCell>
                            {attachment.responsible_user_name}
                          </TableCell>
                          <TableCell>{attachment.status}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleModal("attachment", "edit", attachment)
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleDeleteConfirm(
                                    "attachment",
                                    attachment.id,
                                    attachment.name
                                  )
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  handleModal("payment", "create", {
                                    attachmentId: attachment.id,
                                  })
                                }
                                className="h-8 w-8 p-0"
                              >
                                <Calendar className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  ))}
                </>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Диалог подтверждения удаления */}
      <AlertDialog
        open={deleteConfirm.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen && setDeleteConfirm((prev) => ({ ...prev, isOpen: false }))
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтверждение удаления</AlertDialogTitle>
            <AlertDialogDescription>
              Вы действительно хотите удалить{" "}
              {deleteConfirm.type === "contract"
                ? "договор"
                : deleteConfirm.type === "attachment"
                ? "приложение"
                : "график платежей"}{" "}
              "{deleteConfirm.name}"? Это действие необратимо.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Модальное окно создания договора */}
      <CreateContractModal
        isOpen={modalState.type === "contract" && modalState.mode === "create"}
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleCreateContract}
        channelId={modalState.data?.channelId}
      />
      {/* В конец компонента ContractsTable добавим: */}
      <CreateAttachmentModal
        isOpen={
          modalState.type === "attachment" && modalState.mode === "create"
        }
        onClose={() => setModalState((prev) => ({ ...prev, isOpen: false }))}
        onSubmit={handleCreateAttachment}
        contractId={modalState.data?.contractId}
      />
    </div>
  );
};
