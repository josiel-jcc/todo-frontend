import { Label } from '@/components/ui/label';
import { spacing } from '@/lib/spacing';
import { useTags } from '../../hooks/useTags';
import { TagSelector } from '../TagSelector';
import { TaskFormCreateTag } from './TaskFormCreateTag';

interface TaskFormTagsProps {
  selectedTagIds: number[];
  onSelectionChange: (tagIds: number[]) => void;
  isLoading: boolean;
}

export const TaskFormTags = ({
  selectedTagIds,
  onSelectionChange,
  isLoading,
}: TaskFormTagsProps) => {
  const { tags, isLoadingTags } = useTags();

  const handleTagCreated = (tag: { id: number }) => {
    if (!selectedTagIds.includes(tag.id)) {
      onSelectionChange([...selectedTagIds, tag.id]);
    }
  };

  return (
    <div className={spacing.stackForm}>
      <Label>Tags</Label>

      <TaskFormCreateTag onTagCreated={handleTagCreated} disabled={isLoading} />

      {isLoadingTags ? (
        <div className="text-sm text-muted-foreground">Carregando tags...</div>
      ) : (
        <TagSelector
          tags={tags}
          selectedTagIds={selectedTagIds}
          onSelectionChange={onSelectionChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
};
