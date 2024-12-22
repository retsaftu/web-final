// components/agencies/AgenciesTable.tsx

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronRight,
  Calculator,
  FileText,
  HandshakeIcon,
  Link,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import useProjectStore from "@/store/projectStore";
import { Agency, GroupedAgency } from "@/types/projects";
import { AgencyDetailsModal } from "../modal/AgencyDetailsModal";
import { TableFilters } from "./TableFilters";
import { Button } from "../ui/button";
import { BudgetModal } from "../modal/BudgetModal";

export const AgenciesTable = () => {
  const [search, setSearch] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [filters, setFilters] = useState({
    year: "",
    advertiser: "",
    agency: "",
  });
  const [selectedBudgetProject, setSelectedBudgetProject] = useState<
    string | null
  >(null);

  const { projects, isLoading, error, fetchProjects } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Перемещаем useMemo до условных операторов
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

  const groupedByAgency = React.useMemo(() => {
    return filteredProjects.reduce<Record<string, GroupedAgency>>(
      (acc, project) => {
        if (!project.agency) return acc;

        const key = project.agency.id;
        if (!acc[key]) {
          acc[key] = {
            agency: project.agency,
            projects: [],
            total_budget: 0,
            active_projects: 0,
            advertisers: new Set<string>(),
          };
        }
        acc[key].projects.push(project);
        acc[key].total_budget += project.budget?.total_amount || 0;
        if (project.advertiser) {
          acc[key].advertisers.add(project.advertiser.id);
        }
        if (project.status === "active") acc[key].active_projects++;
        return acc;
      },
      {}
    );
  }, [filteredProjects]);

  const toggleGroup = (agencyId: string) => {
    setExpandedGroups((prev) =>
      prev.includes(agencyId)
        ? prev.filter((a) => a !== agencyId)
        : [...prev, agencyId]
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
              <TableCell className="font-semibold">Агентство</TableCell>
              <TableCell className="font-semibold">Рекламодателей</TableCell>
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
            {Object.values(groupedByAgency).map((group) => (
              <React.Fragment key={group.agency.id}>
                <TableRow
                  className="cursor-pointer hover:bg-gray-50/50 transition-colors"
                  onClick={() => toggleGroup(group.agency.id)}
                >
                  <TableCell className="w-4">
                    {expandedGroups.includes(group.agency.id) ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </TableCell>
                  <TableCell
                    className="font-medium hover:text-blue-600"
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation();
                      setSelectedAgency(group.agency);
                    }}
                  >
                    {group.agency.name}
                  </TableCell>
                  <TableCell>{group.advertisers.size}</TableCell>
                  <TableCell>{group.projects.length}</TableCell>
                  <TableCell>{group.active_projects}</TableCell>
                  <TableCell>{formatCurrency(group.total_budget)}</TableCell>
                </TableRow>
                {expandedGroups.includes(group.agency.id) && (
                  <>
                    {group.projects.map((project) => (
                      <TableRow key={project.id} className="bg-gray-50/50">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          {project.advertiser?.name || "Не указан"}
                        </TableCell>
                        <TableCell>{project.name}</TableCell>
                        <TableCell>{project.status || "Не указан"}</TableCell>
                        <TableCell>
                          {project.budget?.total_amount
                            ? formatCurrency(project.budget.total_amount)
                            : "0"}
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
            {Object.keys(groupedByAgency).length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-32 text-center text-gray-500"
                >
                  Агентства не найдены
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
