import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/modules/auth/hooks/useAuth';
import { LegalFooterLinks } from '@/modules/legal/components/LegalFooterLinks';
import { PrivacySettingsCard } from '../components/PrivacySettingsCard';
import { useSettings } from '../hooks/useSettings';

export const SettingsPage = () => {
  const { user } = useAuth();
  const {
    updateNotifications,
    updateTelegramChatId,
    isUpdatingNotifications,
    isUpdatingTelegram,
    isLoadingProfile,
  } = useSettings();

  const [telegramChatId, setTelegramChatId] = useState(user?.telegram_chat_id || '');

  const notificationsEnabled = user?.notifications_enabled ?? false;

  useEffect(() => {
    if (user?.telegram_chat_id !== undefined) {
      setTelegramChatId(user.telegram_chat_id || '');
    }
  }, [user?.telegram_chat_id]);

  const handleNotificationsToggle = () => {
    const newValue = !notificationsEnabled;
    updateNotifications({ notifications_enabled: newValue });
  };

  const handleTelegramSave = () => {
    updateTelegramChatId({ telegram_chat_id: telegramChatId });
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências e configurações de conta</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>Informações da sua conta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input id="username" value={user?.username || ''} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notificações</CardTitle>
          <CardDescription>
            As notificações são opcionais (opt-in). Ao ativar, podemos enviar lembretes por e-mail
            (via provedor SMTP) e/ou Telegram (operador externo). Veja a{' '}
            <a href="/privacidade" className="text-primary underline">
              Política de Privacidade
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="notifications">Notificações Habilitadas</Label>
              <p className="text-sm text-muted-foreground">
                Receber lembretes sobre tarefas com data de vencimento
              </p>
            </div>
            <button
              type="button"
              onClick={handleNotificationsToggle}
              disabled={isUpdatingNotifications || isLoadingProfile}
              className={`
                relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                ${notificationsEnabled ? 'bg-primary' : 'bg-muted'}
                ${isLoadingProfile ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              role="switch"
              aria-checked={notificationsEnabled}
            >
              <span
                className={`
                  pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out
                  ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Telegram</CardTitle>
          <CardDescription>
            Configure o ID do chat do Telegram para receber notificações. Os dados são processados
            pela API do Telegram (possível transferência internacional).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram Chat ID</Label>
            <Input
              id="telegram"
              type="text"
              placeholder="123456789"
              value={telegramChatId}
              onChange={(e) => setTelegramChatId(e.target.value)}
              disabled={isLoadingProfile}
            />
            <p className="text-sm text-muted-foreground">
              Envie uma mensagem para o bot do Telegram primeiro para obter seu chat ID
            </p>
          </div>
          <Button onClick={handleTelegramSave} disabled={isUpdatingTelegram || isLoadingProfile}>
            {isUpdatingTelegram ? 'Salvando...' : 'Salvar'}
          </Button>
        </CardContent>
      </Card>

      <PrivacySettingsCard />
      <LegalFooterLinks />
    </div>
  );
};
