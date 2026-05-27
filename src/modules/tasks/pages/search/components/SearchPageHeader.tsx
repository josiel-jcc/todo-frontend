import { spacing } from '@/lib/spacing';

export const SearchPageHeader = () => {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold">Busca Avançada</h1>
      <p className={`text-muted-foreground ${spacing.pageSubtitle}`}>
        Encontre tarefas usando filtros detalhados
      </p>
    </div>
  );
};
