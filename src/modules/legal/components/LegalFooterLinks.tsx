import { Link } from 'react-router';

export const LegalFooterLinks = () => (
  <p className="text-center text-sm text-muted-foreground mt-6">
    <Link to="/privacidade" className="underline hover:text-foreground">
      Privacidade
    </Link>
    {' · '}
    <Link to="/termos" className="underline hover:text-foreground">
      Termos de Uso
    </Link>
  </p>
);
