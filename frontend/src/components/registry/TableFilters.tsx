import React from "react";
import { Search, Building2, Calendar, User2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FilterOption {
  id: string;
  name: string;
}

interface TableFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  filters: {
    year: string;
    advertiser: string;
    agency: string;
  };
  onFiltersChange: (key: string, value: string) => void;
  years: number[];
  advertisers: FilterOption[];
  agencies: FilterOption[];
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  search,
  onSearchChange,
  filters,
  onFiltersChange,
  years,
  advertisers,
  agencies,
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Поиск..."
          className="pl-8"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

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
          {years.map((year) => (
            <SelectItem key={`year-${year}`} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.advertiser}
        onValueChange={(value) => onFiltersChange("advertiser", value)}
      >
        <SelectTrigger className="w-full">
          <User2 className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Выберите рекламодателя" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Все рекламодатели</SelectItem>
          {advertisers.map((advertiser) => (
            <SelectItem
              key={`advertiser-${advertiser.id}`}
              value={advertiser.id}
            >
              <div className="truncate max-w-[300px]">{advertiser.name}</div>
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
          {agencies.map((agency) => (
            <SelectItem key={`agency-${agency.id}`} value={agency.id}>
              <div className="truncate max-w-[300px]">{agency.name}</div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
