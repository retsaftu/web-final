// components/reports/AvrReportsTable.tsx
import React from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { IAvrReport } from "@/types/reports";

interface AvrReportsTableProps {
  reports: IAvrReport[];
  onSendTo1C: (id: string) => void;
}

export const AvrReportsTable: React.FC<AvrReportsTableProps> = ({
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
              Скачать отчет
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
            <tr key={report.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(report.date), "dd MMMM yyyy", { locale: ru })}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {report.excelFileUrl && (
                  <a
                    href={report.excelFileUrl}
                    className="text-blue-600 hover:text-blue-800"
                    download
                  >
                    Скачать Excel
                  </a>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {report.uploadedFileUrl ? (
                  <a
                    href={report.uploadedFileUrl}
                    className="text-blue-600 hover:text-blue-800"
                    download
                  >
                    Скачать загруженный файл
                  </a>
                ) : (
                  <button className="text-green-600 hover:text-green-800">
                    Загрузить файл
                  </button>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  className={`px-4 py-2 rounded ${
                    report.sentTo1C
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-700 text-white"
                  }`}
                  onClick={() => !report.sentTo1C && onSendTo1C(report.id)}
                  disabled={report.sentTo1C}
                >
                  {report.sentTo1C ? "Отправлено в 1С" : "Отправить в 1С"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
