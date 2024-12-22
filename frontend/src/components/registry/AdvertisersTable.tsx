// components/projects/AdvertisersTable.tsx
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
  FileText,
  Calculator,
  HandshakeIcon,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { AgencyDetailsModal } from "../modal/AgencyDetailsModal";
import { BudgetModal } from "../modal/BudgetModal";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import useProjectStore from "@/store/projectStore";
import { TableFilters } from "./TableFilters";
import { Agency, Project } from "@/types/projects";

interface GroupedData {
  advertiser: {
    id: string;
    name: string;
  };
  projects: Project[];
  totalBudget: number;
  activeProjects: number;
  agencies: Set<string>;
}

interface GroupedByAdvertiser {
  [key: string]: GroupedData;
}

export const AdvertisersTable = () => {
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
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
  }, [fetchProjects]);

  // Мемоизированные данные для фильтров
  const uniqueYears = React.useMemo(() => {
    const years = new Set(projects.map((p) => p.year));
    return Array.from(years).sort((a, b) => b - a);
  }, [projects]);

  const uniqueAdvertisers = React.useMemo(() => {
    const advertisers = new Map();
    projects.forEach((p) => {
      if (p.advertiser) {
        advertisers.set(p.advertiser.id, p.advertiser);
      }
    });
    return Array.from(advertisers.values());
  }, [projects]);

  const uniqueAgencies = React.useMemo(() => {
    const agencies = new Map();
    projects.forEach((p) => {
      if (p.agency) {
        agencies.set(p.agency.id, p.agency);
      }
    });
    return Array.from(agencies.values());
  }, [projects]);

  // Фильтрация проектов
  const filteredProjects = React.useMemo(() => {
    return projects.filter((project) => {
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
  }, [projects, search, filters]);

  // Группировка по рекламодателям
  const groupedByAdvertiser = React.useMemo<GroupedByAdvertiser>(() => {
    return filteredProjects.reduce<GroupedByAdvertiser>((acc, project) => {
      if (!project.advertiser) return acc;

      const key = project.advertiser.id;
      if (!acc[key]) {
        acc[key] = {
          advertiser: project.advertiser,
          projects: [],
          totalBudget: 0,
          activeProjects: 0,
          agencies: new Set<string>(),
        };
      }
      acc[key].projects.push(project);
      acc[key].totalBudget += project.budget?.total_amount || 0;
      if (project.agency) {
        acc[key].agencies.add(project.agency.id);
      }
      if (project.status === "active") acc[key].activeProjects++;
      return acc;
    }, {});
  }, [filteredProjects]);

  const toggleGroup = (advertiserId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(advertiserId)
        ? prev.filter((a) => a !== advertiserId)
        : [...prev, advertiserId]
    );
  };

  if (isLoading) {
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

  return (
    <div className="space-y-4">
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
              <TableCell></TableCell>
              <TableCell className="font-semibold">Рекламодатель</TableCell>
              <TableCell className="font-semibold">Агентств</TableCell>
              <TableCell className="font-semibold">Проектов</TableCell>
              <TableCell className="font-semibold">Активных</TableCell>
              <TableCell className="font-semibold">Общий бюджет</TableCell>
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
            {Object.values(groupedByAdvertiser).map((group) => (
              <React.Fragment key={group.advertiser.id}>
                <TableRow
                  className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleGroup(group.advertiser.id)}
                >
                  <TableCell className="w-4">
                    {expandedGroups.includes(group.advertiser.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {group.advertiser.name}
                  </TableCell>
                  <TableCell>{group.agencies.size}</TableCell>
                  <TableCell>{group.projects.length}</TableCell>
                  <TableCell>{group.activeProjects}</TableCell>
                  <TableCell>{formatCurrency(group.totalBudget)}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
                {expandedGroups.includes(group.advertiser.id) && (
                  <>
                    {group.projects.map((project) => (
                      <TableRow key={project.id} className="bg-gray-50/50">
                        <TableCell></TableCell>
                        <TableCell className="pl-8">{project.name}</TableCell>
                        <TableCell>
                          {project.agency ? (
                            <Button
                              variant="ghost"
                              className="flex items-center space-x-2 hover:bg-gray-100"
                              onClick={() => setSelectedAgency(project.agency)}
                            >
                              <Building2 className="h-4 w-4 text-gray-500" />
                              <span>{project.agency.name}</span>
                            </Button>
                          ) : (
                            "Не указано"
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`
                              px-2 py-1 rounded-full text-sm font-medium
                              ${
                                project.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : ""
                              }
                              ${
                                project.status === "completed"
                                  ? "bg-gray-100 text-gray-800"
                                  : ""
                              }
                              ${
                                project.status === "draft"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : ""
                              }
                            `}
                          >
                            {project.status === "active"
                              ? "Активный"
                              : project.status === "completed"
                              ? "Завершен"
                              : "Черновик"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {formatCurrency(project.budget?.total_amount || 0)}
                        </TableCell>
                        <TableCell className="text-center">
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
                          {project.contract ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              asChild
                              className="h-8 w-8 hover:text-blue-600"
                            >
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
                  </>
                )}
              </React.Fragment>
            ))}
            {Object.keys(groupedByAdvertiser).length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="h-32 text-center text-gray-500"
                >
                  Рекламодатели не найдены
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
        projectId={selectedBudgetProject}
        onClose={() => setSelectedBudgetProject(null)}
      />
    </div>
  );
};
