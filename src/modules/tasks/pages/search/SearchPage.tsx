import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';
import { useTasks } from '../../hooks/useTasks';
import {
  AdvancedFilters,
  QuickFilters,
  SearchInput,
  SearchPageHeader,
  SearchPagination,
  SearchResults,
} from './components';
import { useSearchFilters } from './hooks/useSearchFilters';

export const SearchPage = () => {
  const {
    filters,
    showAdvancedFilters,
    hasActiveFilters,
    setShowAdvancedFilters,
    handleFilterChange,
    handleResetFilters,
    handlePageChange,
  } = useSearchFilters();

  const {
    tasks,
    pagination,
    isLoadingTasks,
    toggleTaskCompletion,
    deleteTask,
    isTogglingCompletion,
  } = useTasks({
    ...filters,
    limit: 20,
  });

  const isLoading = isLoadingTasks || isTogglingCompletion;

  return (
    <PageShell size="wide">
      <SearchPageHeader />

      {/* Search Input */}
      <Card className="rounded-3xl">
        <CardContent className="p-6">
          <div className={spacing.stackForm}>
            <SearchInput
              value={filters.search ?? ''}
              onChange={(value) => handleFilterChange('search', value)}
            />

            <QuickFilters filters={filters} onFilterChange={handleFilterChange} />

            {/* Advanced Filters Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full rounded-xl"
            >
              {showAdvancedFilters ? 'Ocultar' : 'Mostrar'} Filtros Avançados
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {showAdvancedFilters && (
        <AdvancedFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
        />
      )}

      {/* Results */}
      <SearchResults
        tasks={tasks}
        isLoading={isLoading}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={handleResetFilters}
        pagination={pagination}
        onToggleComplete={toggleTaskCompletion}
        onDelete={deleteTask}
      />

      {/* Pagination */}
      {pagination && (
        <SearchPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          isLoading={isLoading}
          onPageChange={handlePageChange}
        />
      )}
    </PageShell>
  );
};
