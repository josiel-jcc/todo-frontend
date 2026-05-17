import { motion } from 'framer-motion';
import type { components } from '@/api';
import { getVariants, staggerContainer } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { TagBadge } from './TagBadge';

type Tag = components['schemas']['models.Tag'];

interface TagSelectorProps {
  tags: Tag[];
  selectedTagIds: number[];
  onSelectionChange: (tagIds: number[]) => void;
  isLoading?: boolean;
}

export const TagSelector = ({
  tags,
  selectedTagIds,
  onSelectionChange,
  isLoading = false,
}: TagSelectorProps) => {
  const handleTagToggle = (tagId: number) => {
    if (selectedTagIds.includes(tagId)) {
      onSelectionChange(selectedTagIds.filter((id) => id !== tagId));
    } else {
      onSelectionChange([...selectedTagIds, tagId]);
    }
  };

  if (tags.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma tag ainda. Use &quot;Nova tag&quot; acima para criar e selecionar.
      </p>
    );
  }

  return (
    <motion.div
      className="flex flex-wrap gap-2"
      initial="hidden"
      animate="visible"
      variants={getVariants(staggerContainer)}
    >
      {tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        return (
          <motion.button
            key={tag.id}
            type="button"
            onClick={() => handleTagToggle(tag.id)}
            disabled={isLoading}
            className={cn('transition-all', isSelected && 'ring-2 ring-primary ring-offset-2')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial="hidden"
            animate="visible"
            variants={getVariants(staggerContainer)}
            layout
          >
            <TagBadge tag={tag} variant={isSelected ? 'default' : 'outline'} size="sm" />
          </motion.button>
        );
      })}
    </motion.div>
  );
};
