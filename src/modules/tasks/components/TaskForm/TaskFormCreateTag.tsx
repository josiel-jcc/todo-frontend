import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import type { components } from '@/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useErrorHandler } from '@/hooks/useErrorHandler';
import { cn } from '@/lib/utils';
import { useTags } from '../../hooks/useTags';

type Tag = components['schemas']['models.Tag'];

const PRESET_COLORS = [
  '#3B82F6',
  '#EF4444',
  '#10B981',
  '#F59E0B',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#64748B',
] as const;

interface TaskFormCreateTagProps {
  onTagCreated: (tag: Tag) => void;
  disabled?: boolean;
}

function TagColorPicker({
  color,
  disabled,
  onColorChange,
}: {
  color: string;
  disabled?: boolean;
  onColorChange: (color: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="text-xs text-muted-foreground">Cor</span>
      <div className="flex flex-wrap items-center gap-2">
        {PRESET_COLORS.map((preset) => (
          <button
            key={preset}
            type="button"
            disabled={disabled}
            onClick={() => onColorChange(preset)}
            className={cn(
              'h-8 w-8 rounded-full border-2 transition-transform hover:scale-110',
              color === preset
                ? 'border-foreground ring-2 ring-primary ring-offset-2'
                : 'border-transparent'
            )}
            style={{ backgroundColor: preset }}
            aria-label={`Cor ${preset}`}
          />
        ))}
        <label className="relative flex h-8 w-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 border-input">
          <input
            type="color"
            value={color}
            onChange={(e) => onColorChange(e.target.value)}
            disabled={disabled}
            className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            aria-label="Escolher cor personalizada"
          />
          <span className="h-full w-full rounded-full" style={{ backgroundColor: color }} />
        </label>
      </div>
    </div>
  );
}

function CreateTagPanel({
  name,
  color,
  disabled,
  isCreating,
  onNameChange,
  onColorChange,
  onCreate,
  onCancel,
}: {
  name: string;
  color: string;
  disabled?: boolean;
  isCreating: boolean;
  onNameChange: (name: string) => void;
  onColorChange: (color: string) => void;
  onCreate: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-dashed bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">Criar tag personalizada</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 rounded-xl"
          onClick={onCancel}
          disabled={isCreating}
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Input
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        placeholder="Nome da tag"
        maxLength={50}
        disabled={disabled || isCreating}
        className="rounded-xl border-2"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onCreate();
          }
        }}
      />

      <TagColorPicker
        color={color}
        disabled={disabled || isCreating}
        onColorChange={onColorChange}
      />

      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          className="flex-1 rounded-xl"
          onClick={onCreate}
          disabled={disabled || isCreating}
        >
          {isCreating ? 'Criando…' : 'Criar tag'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="rounded-xl"
          onClick={onCancel}
          disabled={isCreating}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
}

export const TaskFormCreateTag = ({ onTagCreated, disabled }: TaskFormCreateTagProps) => {
  const { createTagAsync, isCreatingTag } = useTags();
  const { handleError } = useErrorHandler();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [color, setColor] = useState<string>(PRESET_COLORS[0]);

  const resetForm = () => {
    setName('');
    setColor(PRESET_COLORS[0]);
    setIsOpen(false);
  };

  const handleCreate = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast.error('Informe o nome da tag');
      return;
    }

    try {
      const tag = await createTagAsync({ name: trimmedName, color });
      toast.success('Tag criada');
      onTagCreated(tag);
      resetForm();
    } catch (error) {
      handleError(error, 'Não foi possível criar a tag');
    }
  };

  if (!isOpen) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={disabled || isCreatingTag}
        onClick={() => setIsOpen(true)}
        className="rounded-xl border-dashed"
      >
        <Plus className="h-4 w-4" />
        Nova tag
      </Button>
    );
  }

  return (
    <CreateTagPanel
      name={name}
      color={color}
      disabled={disabled}
      isCreating={isCreatingTag}
      onNameChange={setName}
      onColorChange={setColor}
      onCreate={() => void handleCreate()}
      onCancel={resetForm}
    />
  );
};
