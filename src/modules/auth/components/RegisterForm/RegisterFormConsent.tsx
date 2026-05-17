import { Link } from 'react-router';
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import type { RegisterFormData } from '../../schemas/authSchemas';

type RegisterFormConsentProps = {
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
};

export const RegisterFormConsent = ({ register, errors }: RegisterFormConsentProps) => (
  <div className="space-y-1">
    <div className="flex items-start gap-2">
      <input
        type="checkbox"
        id="acceptPrivacyPolicy"
        className="mt-1 h-4 w-4 rounded border-border"
        {...register('acceptPrivacyPolicy')}
      />
      <Label htmlFor="acceptPrivacyPolicy" className="text-sm font-normal leading-snug cursor-pointer">
        Li e aceito a{' '}
        <Link to="/privacidade" className="text-primary underline" target="_blank">
          Política de Privacidade
        </Link>{' '}
        e os{' '}
        <Link to="/termos" className="text-primary underline" target="_blank">
          Termos de Uso
        </Link>
      </Label>
    </div>
    {errors.acceptPrivacyPolicy && (
      <p className="text-sm text-destructive">{errors.acceptPrivacyPolicy.message}</p>
    )}
  </div>
);
