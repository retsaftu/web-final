// components/reports/InvoiceReportsTable.tsx
import React from "react";
import {
  IInvoiceReport,
  PaymentType,
  PaymentSchedule,
} from "../../types/reports";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface InvoiceReportsTableProps {
  reports: IInvoiceReport[];
  onSendTo1C: (id: string) => void;
}

const getPaymentTypeLabel = (type: PaymentType): string => {
  const labels = {
    [PaymentType.FIFTY_FIFTY]: "50/50",
    [PaymentType.FORTY_SIXTY]: "40/60",
    [PaymentType.THIRTY_SEVENTY]: "30/70",
    [PaymentType.HUNDRED]: "100%",
  };
  return labels[type];
};

const getPaymentScheduleLabel = (schedule: PaymentSchedule): string => {
  const labels = {
    [PaymentSchedule.IMMEDIATE]: "Сразу",
    [PaymentSchedule.THREE_DAYS]: "Через 3 дня",
    [PaymentSchedule.TWENTY_DAYS]: "Через 20 дней",
  };
  return labels[schedule];
};

export const InvoiceReportsTable: React.FC<InvoiceReportsTableProps> = ({
  reports,
  onSendTo1C,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Дата
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Тип оплаты
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              График оплаты
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Скачать счет
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Загруженный файл
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Действия
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {reports.map((report) => (
            <tr key={report.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(report.date), "dd MMMM yyyy", { locale: ru })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800">
                  {getPaymentTypeLabel(report.paymentType)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                  {getPaymentScheduleLabel(report.paymentSchedule)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {report.excelFileUrl && (
                  <a
                    href={report.excelFileUrl}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    download
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Скачать Excel
                  </a>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {report.uploadedFileUrl ? (
                  <a
                    href={report.uploadedFileUrl}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                    download
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Скачать загруженный файл
                  </a>
                ) : (
                  <button className="text-green-600 hover:text-green-800 flex items-center">
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                    Загрузить файл
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className={`inline-flex items-center px-4 py-2 rounded-md ${
                    report.sentTo1C
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => !report.sentTo1C && onSendTo1C(report.id)}
                  disabled={report.sentTo1C}
                >
                  {report.sentTo1C ? (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Отправлено в 1С
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      Отправить в 1С
                    </>
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
