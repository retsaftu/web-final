import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Building2,
  User2,
  FileText,
  Calculator,
  HandshakeIcon,
} from "lucide-react";
import { AgencyDetailsModal } from "../modal/AgencyDetailsModal";
import { TableFilters } from "./TableFilters";
import useProjectStore from "@/store/projectStore";
import { Agency } from "@/types/projects";
import { Link } from "react-router-dom";
import { BudgetModal } from "../modal/BudgetModal";

export const ProjectsTable: React.FC = () => {
  const [search, setSearch] = useState("");
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [selectedBudgetProject, setSelectedBudgetProject] = useState<
    string | null
  >(null);
  const [filters, setFilters] = useState({
    year: "",
    advertiser: "",
    agency: "",
  });

  const { projects, isLoading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <span>Ошибка: {error}</span>
      </div>
    );

  const filteredProjects = projects.filter((project) => {
    const searchLower = search.toLowerCase();
    const matchesSearch =
      project.name.toLowerCase().includes(searchLower) ||
      project.advertiser?.name.toLowerCase().includes(searchLower) ||
      project.agency?.name.toLowerCase().includes(searchLower);

    const matchesFilters =
      (!filters.year ||
        filters.year === "all" ||
        project.year.toString() === filters.year) &&
      (!filters.advertiser ||
        filters.advertiser === "all" ||
        project.advertiser?.id === filters.advertiser) &&
      (!filters.agency ||
        filters.agency === "all" ||
        project.agency?.id === filters.agency);

    return matchesSearch && matchesFilters;
  });

  const uniqueYears = Array.from(new Set(projects.map((p) => p.year))).sort(
    (a, b) => b - a
  );
  const uniqueAdvertisers = Array.from(
    new Map(
      projects
        .filter((p) => p.advertiser)
        .map((p) => [p.advertiser!.id, p.advertiser!])
    ).values()
  );
  const uniqueAgencies = Array.from(
    new Map(
      projects.filter((p) => p.agency).map((p) => [p.agency!.id, p.agency!])
    ).values()
  );

  return (
    <div className="space-y-6">
      <TableFilters
        search={search}
        onSearchChange={setSearch}
        filters={filters}
        onFiltersChange={(key, value) =>
          setFilters((prev) => ({ ...prev, [key]: value }))
        }
        years={uniqueYears}
        advertisers={uniqueAdvertisers}
        agencies={uniqueAgencies}
      />

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50/50">
              <TableCell className="font-semibold w-[100px]">ID</TableCell>
              <TableCell className="font-semibold">Название проекта</TableCell>
              <TableCell className="font-semibold text-center w-[100px]">
                Год
              </TableCell>
              <TableCell className="font-semibold">Рекламодатель</TableCell>
              <TableCell className="font-semibold">
                Рекламное агентство
              </TableCell>
              <TableCell className="font-semibold text-center">
                Бюджет
              </TableCell>
              <TableCell className="font-semibold text-center">
                Сделка
              </TableCell>
              <TableCell className="font-semibold text-center">
                Договор
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow
                key={`${project.id}-${project.year}-${project.name}`}
                className="hover:bg-gray-50/50 transition-colors"
              >
                <TableCell className="font-mono text-sm text-gray-600">
                  {project.id}
                </TableCell>
                <TableCell>
                  <div className="font-medium max-w-[300px] truncate">
                    {project.name}
                  </div>
                </TableCell>
                <TableCell className="text-center">{project.year}</TableCell>
                <TableCell>
                  {project.advertiser ? (
                    <div className="flex items-center space-x-2 max-w-[250px]">
                      <User2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">
                        {project.advertiser.name}
                      </span>
                    </div>
                  ) : (
                    <span className="text-gray-400">Не указан</span>
                  )}
                </TableCell>
                <TableCell>
                  {project.agency ? (
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-2 hover:bg-gray-100 max-w-[250px]"
                      onClick={() => setSelectedAgency(project.agency)}
                    >
                      <Building2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
                      <span className="truncate">{project.agency.name}</span>
                    </Button>
                  ) : (
                    <span className="text-gray-400">Не указано</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  {/* Кнопка бюджета */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:text-blue-600"
                    onClick={() => setSelectedBudgetProject(project.id)}
                  >
                    <Calculator className="h-4 w-4" />
                  </Button>
                </TableCell>

                <TableCell className="text-center">
                  {project.bitrix_url ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-blue-600"
                      asChild
                    >
                      <a
                        href={project.bitrix_url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <HandshakeIcon className="h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      className="h-8 w-8 text-gray-400"
                    >
                      <HandshakeIcon className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>

                <TableCell className="text-center">
                  {/* Кнопка договора */}
                  {project.contract ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      asChild
                      className="h-8 w-8 hover:text-blue-600"
                    >
                      {project.contract.name}
                      <Link to={`/contracts/${project.contract.id}`}>
                        <FileText className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled
                      className="h-8 w-8 text-gray-400"
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filteredProjects.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-32 text-center text-gray-500"
                >
                  Проекты не найдены
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <AgencyDetailsModal
        agency={selectedAgency}
        onClose={() => setSelectedAgency(null)}
      />

      <BudgetModal
        projectId={selectedBudgetProject} // Теперь передаем только ID
        onClose={() => setSelectedBudgetProject(null)}
      />
    </div>
  );
};
