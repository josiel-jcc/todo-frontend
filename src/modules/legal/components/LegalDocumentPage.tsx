import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type LegalDocumentPageProps = {
  title: string;
  markdown: string;
};

const renderInline = (text: string): ReactNode[] => {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts
    .filter((part) => part.length > 0)
    .map((part) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={`strong-${part}`}>{part.slice(2, -2)}</strong>;
      }
      return <span key={`text-${part}`}>{part}</span>;
    });
};

const renderMarkdown = (markdown: string): ReactNode[] => {
  const lines = markdown.split('\n');
  const elements: ReactNode[] = [];
  let listItems: string[] = [];
  let tableRows: string[][] = [];

  const flushList = () => {
    if (listItems.length === 0) return;
    elements.push(
      <ul key={`list-${elements.length}`} className="list-disc pl-6 space-y-1 my-3">
        {listItems.map((item) => (
          <li key={item}>{renderInline(item)}</li>
        ))}
      </ul>
    );
    listItems = [];
  };

  const flushTable = () => {
    if (tableRows.length < 2) {
      tableRows = [];
      return;
    }
    elements.push(
      <div key={`table-${elements.length}`} className="my-4 overflow-x-auto">
        <table className="w-full text-sm border border-border">
          <thead>
            <tr>
              {tableRows[0].map((cell) => (
                <th
                  key={cell}
                  className="border border-border px-2 py-1 text-left bg-muted font-medium"
                >
                  {renderInline(cell)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(2).map((row) => (
              <tr key={row.join('|')}>
                {row.map((cell) => (
                  <td key={`${row.join('-')}-${cell}`} className="border border-border px-2 py-1">
                    {renderInline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    tableRows = [];
  };

  for (const line of lines) {
    if (line.startsWith('|')) {
      flushList();
      const cells = line
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);
      tableRows.push(cells);
      continue;
    }
    if (tableRows.length > 0) {
      flushTable();
    }

    if (line.startsWith('- ')) {
      listItems.push(line.slice(2));
      continue;
    }
    flushList();

    if (line.startsWith('## ')) {
      elements.push(
        <h2 key={`h2-${elements.length}`} className="text-xl font-semibold mt-6 mb-2">
          {line.slice(3)}
        </h2>
      );
      continue;
    }
    if (line.startsWith('### ')) {
      elements.push(
        <h3 key={`h3-${elements.length}`} className="text-lg font-medium mt-4 mb-2">
          {line.slice(4)}
        </h3>
      );
      continue;
    }
    if (line.startsWith('# ') || line.trim() === '' || line.startsWith('---')) {
      continue;
    }
    elements.push(
      <p key={`p-${elements.length}`} className="my-2 text-muted-foreground leading-relaxed">
        {renderInline(line)}
      </p>
    );
  }
  flushList();
  flushTable();
  return elements;
};

export const LegalDocumentPage = ({ title, markdown }: LegalDocumentPageProps) => (
  <div className="min-h-dvh bg-background p-4">
    <div className="container mx-auto max-w-3xl py-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link to="/login">← Voltar</Link>
      </Button>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>{renderMarkdown(markdown)}</CardContent>
      </Card>
    </div>
  </div>
);
