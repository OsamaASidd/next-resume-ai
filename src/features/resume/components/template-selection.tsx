import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { getAllTemplates } from '../templates/registry';
import type { TemplateConfig } from '../templates/registry';

interface TemplateSelectionProps {
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
  onApplyTemplate: (templateId: string) => void;
  currentTemplate: string;
}

export function TemplateSelection({
  selectedTemplate,
  onTemplateSelect,
  onApplyTemplate,
  currentTemplate
}: TemplateSelectionProps) {
  const templates = getAllTemplates();

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <div>
          <h2 className='text-2xl font-bold'>Choose Template</h2>
          <p className='mt-1 text-muted-foreground'>
            Preview different templates before applying
          </p>
        </div>
        {selectedTemplate !== currentTemplate && (
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={() => onTemplateSelect(currentTemplate)}
            >
              Cancel
            </Button>
            <Button onClick={() => onApplyTemplate(selectedTemplate)}>
              Apply Template
            </Button>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 gap-6'>
        {templates.map((template) => (
          <Card
            key={template.id}
            className={cn(
              'cursor-pointer transition-all hover:border-primary',
              selectedTemplate === template.id && 'border-2 border-primary',
              currentTemplate === template.id && 'bg-muted/10'
            )}
            onClick={() => onTemplateSelect(template.id)}
          >
            <CardContent className='p-6'>
              <div className='relative mb-4 aspect-[210/297] overflow-hidden rounded-lg border'>
                <Image
                  src={template.thumbnail ?? ''}
                  alt={template.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold'>{template.name}</h3>
                <p className='text-sm text-muted-foreground'>
                  {template.description}
                </p>
                {currentTemplate === template.id && (
                  <p className='text-sm font-medium text-primary'>
                    Currently Applied
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
