import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BudgetModalProps {
  projectId: string | null;
  onClose: () => void;
}

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

// Моковые данные на основе скриншотов
const mockBudgetData = {
  approved: {
    channels: [
      {
        name: "ПЕРВЫЙ КАНАЛ ЕВРАЗИЯ",
        prime: 50,
        types: [
          {
            name: "GRP fixed",
            values: [
              0, 0, 196480.65, 856808.18, 156481.26, 716453.53, 272.779,
              334800.38, 860352.24, 368248.69, 186417.32, 91245.43,
            ],
          },
          {
            name: "Automatic",
            values: [
              0, 0, 223797.82, 796651.82, 187753.52, 214184.26, 527534.9,
              420820.46, 966858.69, 681895.68, 167705.79, 128492.52,
            ],
          },
        ],
      },
      {
        name: "телесеть QAZAQSTAN",
        prime: 50,
        types: [
          {
            name: "GRP fixed",
            values: Array(12).fill(0),
          },
          {
            name: "Automatic",
            values: Array(12).fill(0),
          },
        ],
      },
      {
        name: "ALMATY TV",
        prime: 50,
        types: [
          {
            name: "GRP fixed",
            values: Array(12).fill(0),
          },
          {
            name: "Automatic",
            values: Array(12).fill(0),
          },
        ],
      },
    ],
  },
  current: {
    channels: [
      {
        name: "ПЕРВЫЙ КАНАЛ ЕВРАЗИЯ",
        prime: 50,
        types: [
          {
            name: "GRP fixed",
            values: [
              0, 0, 187316.97, 717753.17, 193863.31, 179961.44, 226676.54,
              360846.8, 351900.68, 788747.45, 331993.42, 91245.43,
            ],
            completion: Array(12).fill(100.0),
          },
          {
            name: "Automatic",
            values: [
              0, 0, 217299.73, 510807.48, 202458.81, 211854.47, 299972.6,
              368073.43, 510266.05, 957486.71, 717524.93, 120492.52,
            ],
            completion: Array(12).fill(95.0),
          },
        ],
      },
      {
        name: "телесеть QAZAQSTAN",
        prime: 50,
        types: [
          {
            name: "GRP fixed",
            values: Array(12).fill(0),
            completion: Array(12).fill(0),
          },
          {
            name: "Automatic",
            values: Array(12).fill(0),
            completion: Array(12).fill(0),
          },
        ],
      },
    ],
  },
};

export const BudgetModal: React.FC<BudgetModalProps> = ({
  projectId,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState("approved");

  if (!projectId) return null;

  const renderBudgetTable = (
    data: typeof mockBudgetData.approved | typeof mockBudgetData.current
  ) => {
    return (
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50/50">
            <TableCell className="font-semibold">Канал</TableCell>
            <TableCell className="font-semibold">% Прайм</TableCell>
            <TableCell className="font-semibold">Тип</TableCell>
            {months.map((month) => (
              <TableCell key={month} className="font-semibold text-right">
                {month}
              </TableCell>
            ))}
            <TableCell className="font-semibold text-right">Всего</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.channels.map((channel) => (
            <React.Fragment key={channel.name}>
              {channel.types.map((type, typeIndex) => (
                <TableRow key={`${channel.name}-${type.name}`}>
                  {typeIndex === 0 && (
                    <>
                      <TableCell
                        rowSpan={channel.types.length}
                        className="font-medium"
                      >
                        {channel.name}
                      </TableCell>
                      <TableCell rowSpan={channel.types.length}>
                        {channel.prime}
                      </TableCell>
                    </>
                  )}
                  <TableCell>{type.name}</TableCell>
                  {type.values.map((value, idx) => (
                    <TableCell key={idx} className="text-right">
                      <div>{formatCurrency(value)}</div>
                      {"completion" in type && (
                        <div className="text-xs text-gray-500">
                          {type.completion[idx].toFixed(2)}%
                        </div>
                      )}
                    </TableCell>
                  ))}
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(type.values.reduce((a, b) => a + b, 0))}
                  </TableCell>
                </TableRow>
              ))}
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <Dialog open={!!projectId} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Бюджет проекта #{projectId}</DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue="approved"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="approved">Утвержденный КП</TabsTrigger>
            <TabsTrigger value="current">Текущий КП</TabsTrigger>
          </TabsList>
          <TabsContent value="approved">
            {renderBudgetTable(mockBudgetData.approved)}
          </TabsContent>
          <TabsContent value="current">
            {renderBudgetTable(mockBudgetData.current)}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
