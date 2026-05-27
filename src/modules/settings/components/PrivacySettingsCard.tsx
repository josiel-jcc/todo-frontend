import { useState } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { useSettings } from '../hooks/useSettings';

export const PrivacySettingsCard = () => {
  const { logout } = useAuth();
  const { exportData, isExportingData, deleteAccount, isDeletingAccount } = useSettings();
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [showDeleteForm, setShowDeleteForm] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'EXCLUIR') return;
    await deleteAccount(password);
    logout();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacidade e dados</CardTitle>
        <CardDescription>
          Exercite seus direitos previstos na LGPD. Consulte a{' '}
          <Link to="/privacidade" className="text-primary underline">
            Política de Privacidade
          </Link>
          .
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button variant="outline" onClick={() => exportData()} disabled={isExportingData}>
          {isExportingData ? 'Exportando...' : 'Exportar meus dados (JSON)'}
        </Button>

        {!showDeleteForm ? (
          <Button variant="destructive" onClick={() => setShowDeleteForm(true)}>
            Excluir minha conta
          </Button>
        ) : (
          <div className="space-y-4 rounded-lg border border-destructive/30 p-4">
            <p className="text-sm text-muted-foreground">
              Esta ação é irreversível. Digite <strong>EXCLUIR</strong> e sua senha para confirmar.
            </p>
            <div className="space-y-2">
              <Label htmlFor="confirm-delete">Confirmação</Label>
              <Input
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="EXCLUIR"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-password">Senha</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="destructive"
                disabled={isDeletingAccount || confirmText !== 'EXCLUIR' || !password}
                onClick={handleDelete}
              >
                {isDeletingAccount ? 'Excluindo...' : 'Confirmar exclusão'}
              </Button>
              <Button variant="ghost" onClick={() => setShowDeleteForm(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
