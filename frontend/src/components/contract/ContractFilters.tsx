import { Search, Building2, Calendar, User2, Tv2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ContractFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: {
    channel: string;
    agency: string;
    year: string;
    status: string;
  };
  onFiltersChange: (key: string, value: string) => void;
  uniqueChannels: string[];
  uniqueAgencies: string[];
  uniqueYears: string[];
}

export const ContractFilters: React.FC<ContractFiltersProps> = ({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  uniqueChannels = [],
  uniqueAgencies = [],
  uniqueYears = [],
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Поиск по реестру..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <Select
        value={filters.channel}
        onValueChange={(value) => onFiltersChange("channel", value)}
      >
        <SelectTrigger className="w-full">
          <Tv2 className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Выберите канал" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все каналы</SelectItem>
          {uniqueChannels.map((channel) => (
            <SelectItem key={`channel-${channel}`} value={channel}>
              <div className="truncate max-w-[300px]">{channel}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.agency}
        onValueChange={(value) => onFiltersChange("agency", value)}
      >
        <SelectTrigger className="w-full">
          <Building2 className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Выберите агентство" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все агентства</SelectItem>
          {uniqueAgencies.map((agency) => (
            <SelectItem key={`agency-${agency}`} value={agency}>
              <div className="truncate max-w-[300px]">{agency}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.year}
        onValueChange={(value) => onFiltersChange("year", value)}
      >
        <SelectTrigger className="w-full">
          <Calendar className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Выберите год" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все годы</SelectItem>
          {uniqueYears.map((year) => (
            <SelectItem key={`year-${year}`} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.status}
        onValueChange={(value) => onFiltersChange("status", value)}
      >
        <SelectTrigger className="w-full">
          <User2 className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Выберите статус" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все статусы</SelectItem>
          <SelectItem value="active">Активные</SelectItem>
          <SelectItem value="completed">Завершенные</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
