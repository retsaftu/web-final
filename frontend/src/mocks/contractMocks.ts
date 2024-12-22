import { IChannel } from "@/types/contracts";

export const mockAgencies = [
  { id: "white-swan", name: 'ТОО "Белый лебедь"' },
  { id: "hooves", name: 'ТОО "Рога и копыта"' },
  { id: "ad-lama", name: 'ТОО "Реклама лама"' },
  { id: "ooo", name: 'ТОО "ООО"' },
  { id: "bondi", name: 'ТОО "Бонди"' },
  { id: "media-group", name: 'ТОО "Медиа Групп"' },
  { id: "star-media", name: 'ТОО "Стар Медиа"' },
  { id: "prime-time", name: 'ТОО "Прайм Тайм"' },
  { id: "ad-masters", name: 'ТОО "Мастера рекламы"' },
  { id: "creative-mind", name: 'ТОО "Креативный разум"' },
];

const clients = [
  { name: 'ТОО "ОЭлИкс Групп (OLX GROUP)"', brand: "OLX" },
  {
    name: 'АО "Останкинский мясоперерабатывающий комбинат"',
    brand: "Останкино",
  },
  { name: 'ТОО "Coca-Cola Казахстан"', brand: "Coca-Cola" },
  { name: 'ТОО "Пепси-Кола Казахстан"', brand: "Pepsi" },
  { name: 'АО "Банк ЦентрКредит"', brand: "BCC" },
  { name: 'АО "Kaspi Bank"', brand: "Kaspi" },
  { name: 'ТОО "Технодом Оператор"', brand: "Технодом" },
  { name: 'ТОО "Мечта Маркет"', brand: "Мечта" },
  { name: 'АО "Евразийский банк"', brand: "Eurasian Bank" },
  { name: 'ТОО "Магнум Кэш энд Керри"', brand: "Magnum" },
];

const managers = [
  "Наталья",
  "Александр",
  "Елена",
  "Дмитрий",
  "Ольга",
  "Марина",
  "Сергей",
  "Анна",
  "Виктор",
  "Ирина",
];

const generateAttachment = (id: string, year: number, quarter: number) => {
  const client = clients[Math.floor(Math.random() * clients.length)];
  const manager = managers[Math.floor(Math.random() * managers.length)];
  const amount = Math.floor(Math.random() * 900000000) + 100000000;
  const startDate = `${String(quarter * 3 - 2).padStart(2, "0")}.${String(
    quarter * 3
  ).padStart(2, "0")}.${year}`;
  const endDate = `${String(quarter * 3).padStart(2, "0")}.${String(
    quarter * 3
  ).padStart(2, "0")}.${year}`;

  return {
    id: `att-${id}`,
    clientName: client.name,
    brandName: client.brand,
    attachmentNumber: `${Math.floor(Math.random() * 10)}/${Math.floor(
      Math.random() * 10
    )}`,
    attachmentDate: `${String(Math.floor(Math.random() * 28) + 1).padStart(
      2,
      "0"
    )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.${year}`,
    amount,
    startDate,
    endDate,
    manager,
    status: Math.random() > 0.3 ? "active" : "completed",
  };
};

export const mockChannels: IChannel[] = [
  {
    id: "eurasia",
    name: 'Первый канал "Евразия"',
    contracts: Array.from({ length: 5 }, (_, i) => ({
      id: `eurasia-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 4 }, (_, j) =>
        generateAttachment(`eurasia-${i}-${j}`, 2024, j + 1)
      ),
    })),
  },
  {
    id: "ktk",
    name: "КТК",
    contracts: Array.from({ length: 4 }, (_, i) => ({
      id: `ktk-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 3 }, (_, j) =>
        generateAttachment(`ktk-${i}-${j}`, 2024, j + 1)
      ),
    })),
  },
  {
    id: "31channel",
    name: "31 канал",
    contracts: Array.from({ length: 6 }, (_, i) => ({
      id: `31-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 5 }, (_, j) =>
        generateAttachment(
          `31-${i}-${j}`,
          2024,
          Math.floor(Math.random() * 4) + 1
        )
      ),
    })),
  },
  {
    id: "astana",
    name: "Астана",
    contracts: Array.from({ length: 3 }, (_, i) => ({
      id: `astana-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 6 }, (_, j) =>
        generateAttachment(
          `astana-${i}-${j}`,
          2024,
          Math.floor(Math.random() * 4) + 1
        )
      ),
    })),
  },
  {
    id: "seven",
    name: "7 канал",
    contracts: Array.from({ length: 4 }, (_, i) => ({
      id: `seven-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 4 }, (_, j) =>
        generateAttachment(
          `seven-${i}-${j}`,
          2024,
          Math.floor(Math.random() * 4) + 1
        )
      ),
    })),
  },
  {
    id: "ntn",
    name: "НТК",
    contracts: Array.from({ length: 5 }, (_, i) => ({
      id: `ntn-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 3 }, (_, j) =>
        generateAttachment(
          `ntn-${i}-${j}`,
          2024,
          Math.floor(Math.random() * 4) + 1
        )
      ),
    })),
  },
  {
    id: "mir",
    name: "МИР",
    contracts: Array.from({ length: 4 }, (_, i) => ({
      id: `mir-contract-${i + 1}`,
      number: `№${Math.floor(Math.random() * 90000000) + 10000000}`,
      date: `${String(Math.floor(Math.random() * 28) + 1).padStart(
        2,
        "0"
      )}.${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}.2024`,
      agency: mockAgencies[Math.floor(Math.random() * mockAgencies.length)],
      attachments: Array.from({ length: 5 }, (_, j) =>
        generateAttachment(
          `mir-${i}-${j}`,
          2024,
          Math.floor(Math.random() * 4) + 1
        )
      ),
    })),
  },
];
