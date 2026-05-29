import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formSelectClassName } from '@/lib/formSelect';
import type { TasksQueryParams } from '../../../hooks/useTasks';
import { useUsers } from '../../../hooks/useUsers';
import { PriorityTagFilters } from './PriorityTagFilters';

interface AdvancedFiltersFieldsProps {
  filters: TasksQueryParams;
  onFilterChange: (key: keyof TasksQueryParams, value: unknown) => void;
}

export const AdvancedFiltersFields = ({ filters, onFilterChange }: AdvancedFiltersFieldsProps) => {
  const { users } = useUsers({ limit: 100 });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Type */}
      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <select
          id="type"
          className={formSelectClassName}
          value={filters.type ?? ''}
          onChange={(e) =>
            onFilterChange(
              'type',
              e.target.value ? (e.target.value as TasksQueryParams['type']) : undefined
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

      {/* Period */}
      <div className="space-y-2">
        <Label htmlFor="period">Período</Label>
        <select
          id="period"
          className={formSelectClassName}
          value={filters.period ?? ''}
          onChange={(e) =>
            onFilterChange(
              'period',
              e.target.value ? (e.target.value as TasksQueryParams['period']) : undefined
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

      {/* Date Range */}
      <div className="space-y-2">
        <Label htmlFor="due_date_from">Data de Vencimento (De)</Label>
        <Input
          id="due_date_from"
          type="date"
          value={filters.due_date_from ?? ''}
          onChange={(e) => onFilterChange('due_date_from', e.target.value)}
          className="rounded-2xl"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="due_date_to">Data de Vencimento (Até)</Label>
        <Input
          id="due_date_to"
          type="date"
          value={filters.due_date_to ?? ''}
          onChange={(e) => onFilterChange('due_date_to', e.target.value)}
          className="rounded-2xl"
        />
      </div>

      <PriorityTagFilters filters={filters} onFilterChange={onFilterChange} />

      {/* Assigned By */}
      <div className="space-y-2">
        <Label htmlFor="assigned_by">Criado por</Label>
        <select
          id="assigned_by"
          className={formSelectClassName}
          value={filters.assigned_by ?? ''}
          onChange={(e) =>
            onFilterChange(
              'assigned_by',
              e.target.value ? Number.parseInt(e.target.value, 10) : undefined
            )
          }
        >
          <option value="">Todos</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
      </div>

      {/* Sort By */}
      <div className="space-y-2">
        <Label htmlFor="sort_by">Ordenar por</Label>
        <select
          id="sort_by"
          className={formSelectClassName}
          value={filters.sort_by ?? ''}
          onChange={(e) =>
            onFilterChange(
              'sort_by',
              e.target.value ? (e.target.value as TasksQueryParams['sort_by']) : undefined
            )
          }
        >
          <option value="">Padrão</option>
          <option value="created_at">Data de Criação</option>
          <option value="due_date">Data de Vencimento</option>
          <option value="title">Título</option>
          <option value="priority">Prioridade</option>
        </select>
      </div>

      {/* Order */}
      <div className="space-y-2">
        <Label htmlFor="order">Ordem</Label>
        <select
          id="order"
          className={formSelectClassName}
          value={filters.order ?? 'desc'}
          onChange={(e) => onFilterChange('order', e.target.value as TasksQueryParams['order'])}
        >
          <option value="desc">Decrescente</option>
          <option value="asc">Crescente</option>
        </select>
      </div>
    </div>
  );
};
