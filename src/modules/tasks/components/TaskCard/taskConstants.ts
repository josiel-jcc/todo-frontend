export const priorityColors = {
  baixa: 'bg-blue-100 text-blue-800 border-blue-200',
  media: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  alta: 'bg-orange-100 text-orange-800 border-orange-200',
  urgente: 'bg-red-100 text-red-800 border-red-200',
};

export const typeColorMap = {
  casa: 'bg-pink-500',
  trabalho: 'bg-blue-500',
  lazer: 'bg-orange-500',
  saude: 'bg-purple-500',
};

export const typeLabels = {
  casa: 'Casa',
  trabalho: 'Trabalho',
  lazer: 'Lazer',
  saude: 'Saúde',
};

export const priorityLabels = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
  urgente: 'Urgente',
};

export const typeBadgeColors = {
  casa: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400 border-pink-200 dark:border-pink-800',
  trabalho:
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800',
  lazer:
    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 border-orange-200 dark:border-orange-800',
  saude:
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800',
};

export const formatTaskDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};
