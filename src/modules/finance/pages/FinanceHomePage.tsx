import { Wallet } from 'lucide-react';
import { Link } from 'react-router';
import { PageShell } from '@/components/PageShell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { spacing } from '@/lib/spacing';

export const FinanceHomePage = () => (
  <PageShell size="narrow">
    <div className={`flex items-center ${spacing.gapInline}`}>
      <Wallet className="h-6 w-6" />
      <h1 className="text-2xl font-bold">Finanças</h1>
    </div>

    <Card className="rounded-3xl">
      <CardHeader>
        <CardTitle className="text-lg">Em breve</CardTitle>
        <CardDescription>
          O módulo de finanças está em desenvolvimento. Em breve você poderá acompanhar despesas,
          receitas e orçamentos compartilhados com seus grupos.
        </CardDescription>
      </CardHeader>
      <CardContent className={spacing.stackForm}>
        <p className="text-sm text-muted-foreground">
          Enquanto isso, organize suas tarefas em grupos para preparar o lançamento das finanças
          compartilhadas.
        </p>
        <Button asChild className="w-full rounded-xl">
          <Link to="/groups">Ir para Grupos</Link>
        </Button>
      </CardContent>
    </Card>
  </PageShell>
);
