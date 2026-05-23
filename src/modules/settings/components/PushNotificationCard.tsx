import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  getActivePushSubscription,
  getPushPermission,
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
} from '@/lib/pushNotifications';
import { isIosDevice, isStandaloneApp } from '@/lib/pwaInstall';

interface PushNotificationCardProps {
  disabled?: boolean;
}

export const PushNotificationCard = ({ disabled }: PushNotificationCardProps) => {
  const [supported] = useState(isPushSupported);
  const [permission, setPermission] = useState(getPushPermission());
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const refreshStatus = useCallback(async () => {
    setChecking(true);
    setPermission(getPushPermission());
    if (!isPushSupported()) {
      setSubscribed(false);
      setChecking(false);
      return;
    }
    try {
      const sub = await getActivePushSubscription();
      setSubscribed(Boolean(sub));
    } catch {
      setSubscribed(false);
    } finally {
      setChecking(false);
    }
  }, []);

  useEffect(() => {
    void refreshStatus();
  }, [refreshStatus]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const sub = await subscribeToPush();
      if (!sub) {
        toast.error('Permissão de notificação negada ou indisponível');
        await refreshStatus();
        return;
      }
      toast.success('Notificações push ativadas neste dispositivo');
      await refreshStatus();
    } catch {
      toast.error('Não foi possível ativar as notificações push');
      await refreshStatus();
    } finally {
      setLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    setLoading(true);
    try {
      await unsubscribeFromPush();
      toast.success('Notificações push desativadas neste dispositivo');
      await refreshStatus();
    } catch {
      toast.error('Não foi possível desativar as notificações push');
      await refreshStatus();
    } finally {
      setLoading(false);
    }
  };

  const permissionLabel = () => {
    if (!supported) return 'Não suportado neste navegador';
    if (permission === 'granted') return 'Permitido';
    if (permission === 'denied') return 'Bloqueado';
    return 'Não solicitado';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificações neste dispositivo</CardTitle>
        <CardDescription>
          Receba lembretes nativos no celular ou computador quando o app estiver instalado como PWA.
          {isIosDevice() && !isStandaloneApp() ? (
            <span className="mt-2 block text-amber-600 dark:text-amber-400">
              No iPhone/iPad, adicione o app à Tela de Início para ativar notificações push (iOS 16.4+).
            </span>
          ) : null}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!supported ? (
          <p className="text-sm text-muted-foreground">
            Seu navegador não suporta notificações push. Use Chrome, Edge ou Firefox em HTTPS, ou
            instale o app na tela inicial.
          </p>
        ) : (
          <>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Permissão do navegador</span>
              <span className="font-medium">{permissionLabel()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Inscrição neste dispositivo</span>
              <span className="font-medium">
                {checking ? 'Verificando…' : subscribed ? 'Ativa' : 'Inativa'}
              </span>
            </div>
            <div className="flex gap-2">
              {subscribed ? (
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-xl"
                  onClick={handleUnsubscribe}
                  disabled={disabled || loading || checking}
                >
                  {loading ? 'Desativando…' : 'Desativar push'}
                </Button>
              ) : (
                <Button
                  type="button"
                  className="rounded-xl"
                  onClick={handleSubscribe}
                  disabled={disabled || loading || checking || permission === 'denied'}
                >
                  {loading ? 'Ativando…' : 'Ativar push neste dispositivo'}
                </Button>
              )}
            </div>
            {permission === 'denied' ? (
              <p className="text-sm text-muted-foreground">
                As notificações estão bloqueadas. Altere a permissão nas configurações do navegador
                e tente novamente.
              </p>
            ) : null}
          </>
        )}
      </CardContent>
    </Card>
  );
};
