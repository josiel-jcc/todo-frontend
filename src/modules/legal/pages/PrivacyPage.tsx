import privacyMarkdown from '@docs/compliance/PRIVACY.md';
import { LegalDocumentPage } from '../components/LegalDocumentPage';

export const PrivacyPage = () => (
  <LegalDocumentPage title="Política de Privacidade" markdown={privacyMarkdown} />
);
