import { Label } from '@/components/ui/label';
import { formSelectClassName } from '@/lib/formSelect';
import { useTags } from '../../../hooks/useTags';
import type { TasksQueryParams } from '../../../hooks/useTasks';

type Priority = NonNullable<TasksQueryParams['priority']>;

interface PriorityTagFiltersProps {
  filters: TasksQueryParams;
  onFilterChange: (key: keyof TasksQueryParams, value: unknown) => void;
}

export const PriorityTagFilters = ({ filters, onFilterChange }: PriorityTagFiltersProps) => {
  const { tags, isLoadingTags } = useTags();

  const selectedTagIds = filters.tag_ids ?? [];

  const toggleTag = (tagId: number) => {
    const next = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter((id) => id !== tagId)
      : [...selectedTagIds, tagId];
    onFilterChange('tag_ids', next.length > 0 ? next : undefined);
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="priority">Prioridade</Label>
        <select
          id="priority"
          className={formSelectClassName}
          value={filters.priority ?? ''}
          onChange={(e) =>
            onFilterChange('priority', e.target.value ? (e.target.value as Priority) : undefined)
          }
        >
          <option value="">Todas</option>
          <option value="baixa">Baixa</option>
          <option value="media">Média</option>
          <option value="alta">Alta</option>
          <option value="urgente">Urgente</option>
        </select>
      </div>

      <div className="space-y-2 md:col-span-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2 rounded-2xl border-2 border-input bg-background p-3 min-h-[2.75rem]">
          {isLoadingTags && <span className="text-sm text-muted-foreground">Carregando tags…</span>}
          {!isLoadingTags && tags.length === 0 && (
            <span className="text-sm text-muted-foreground">Nenhuma tag criada ainda.</span>
          )}
          {!isLoadingTags &&
            tags.map((tag) => {
              const checked = selectedTagIds.includes(tag.id);
              return (
                <label
                  key={tag.id}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                  style={{ borderColor: checked ? tag.color : undefined }}
                >
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={() => toggleTag(tag.id)}
                  />
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: tag.color }}
                    aria-hidden
                  />
                  <span>{tag.name}</span>
                </label>
              );
            })}
        </div>
      </div>
    </>
  );
};
