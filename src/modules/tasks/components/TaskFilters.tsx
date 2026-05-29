import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formSelectClassName } from '@/lib/formSelect';
import type { TaskFilters as TaskFiltersType } from '../schemas/taskSchemas';

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onFiltersChange: (filters: TaskFiltersType) => void;
  onReset: () => void;
}

export const TaskFilters = ({ filters, onFiltersChange, onReset }: TaskFiltersProps) => {
  const handleFilterChange = (key: keyof TaskFiltersType, value: unknown) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Buscar</Label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Buscar por título ou descrição..."
                value={filters.search ?? ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className={formSelectClassName}
                value={filters.type ?? ''}
                onChange={(e) =>
                  handleFilterChange(
                    'type',
                    e.target.value ? (e.target.value as TaskFiltersType['type']) : undefined
                  )
                }
              >
                <option value="">Todos</option>
                <option value="casa">Casa</option>
                <option value="trabalho">Trabalho</option>
                <option value="lazer">Lazer</option>
                <option value="saude">Saúde</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="completed">Status</Label>
              <select
                id="completed"
                className={formSelectClassName}
                value={filters.completed === undefined ? '' : filters.completed ? 'true' : 'false'}
                onChange={(e) =>
                  handleFilterChange(
                    'completed',
                    e.target.value === '' ? undefined : e.target.value === 'true'
                  )
                }
              >
                <option value="">Todas</option>
                <option value="false">Pendentes</option>
                <option value="true">Concluídas</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="period">Período</Label>
              <select
                id="period"
                className={formSelectClassName}
                value={filters.period ?? ''}
                onChange={(e) =>
                  handleFilterChange(
                    'period',
                    e.target.value ? (e.target.value as TaskFiltersType['period']) : undefined
                  )
                }
              >
                <option value="">Todos</option>
                <option value="overdue">Atrasadas</option>
                <option value="today">Hoje</option>
                <option value="this_week">Esta Semana</option>
                <option value="this_month">Este Mês</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sort_by">Ordenar por</Label>
              <select
                id="sort_by"
                className={formSelectClassName}
                value={filters.sort_by ?? ''}
                onChange={(e) =>
                  handleFilterChange(
                    'sort_by',
                    e.target.value ? (e.target.value as TaskFiltersType['sort_by']) : undefined
                  )
                }
              >
                <option value="">Padrão</option>
                <option value="created_at">Data de Criação</option>
                <option value="due_date">Data de Vencimento</option>
                <option value="title">Título</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onReset} className="flex-1">
              Limpar Filtros
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
