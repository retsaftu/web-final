// mocks/reportMocks.ts
import {
  IAvrReport,
  IInvoiceReport,
  ReportStatus,
  PaymentType,
  PaymentSchedule,
} from "../types/reports";

export const mockAvrReports: IAvrReport[] = [
  {
    id: "1",
    date: "2024-01-05",
    excelFileUrl: "http://example.com/avr_january_2024.xlsx",
    uploadedFileUrl: null,
    status: ReportStatus.GENERATED,
    sentTo1C: false,
  },
  {
    id: "2",
    date: "2024-02-05",
    excelFileUrl: "http://example.com/avr_february_2024.xlsx",
    uploadedFileUrl: "http://example.com/avr_february_2024_updated.xlsx",
    status: ReportStatus.UPLOADED,
    sentTo1C: true,
  },
];

export const mockInvoiceReports: IInvoiceReport[] = [
  {
    id: "1",
    date: "2024-01-06",
    excelFileUrl: "http://example.com/invoice_january_2024_1.xlsx",
    uploadedFileUrl: null,
    status: ReportStatus.GENERATED,
    sentTo1C: false,
    paymentType: PaymentType.FIFTY_FIFTY,
    paymentSchedule: PaymentSchedule.THREE_DAYS,
  },
  {
    id: "2",
    date: "2024-01-06",
    excelFileUrl: "http://example.com/invoice_january_2024_2.xlsx",
    uploadedFileUrl: "http://example.com/invoice_january_2024_2_updated.xlsx",
    status: ReportStatus.UPLOADED,
    sentTo1C: true,
    paymentType: PaymentType.FORTY_SIXTY,
    paymentSchedule: PaymentSchedule.TWENTY_DAYS,
  },
];
