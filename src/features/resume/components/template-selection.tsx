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
    <div className='space-y-3 md:space-y-6'>
      <div className='flex flex-col gap-2 md:flex-row md:items-center md:justify-between md:gap-3'>
        <div>
          <h2 className='text-lg font-bold md:text-2xl'>Choose Template</h2>
          <p className='mt-0.5 text-xs text-muted-foreground md:mt-1 md:text-base'>
            Preview different templates before applying
          </p>
        </div>
        {selectedTemplate !== currentTemplate && (
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              className='h-8 text-xs md:h-10 md:text-sm'
              onClick={() => onTemplateSelect(currentTemplate)}
            >
              Cancel
            </Button>
            <Button
              size='sm'
              className='h-8 text-xs md:h-10 md:text-sm'
              onClick={() => onApplyTemplate(selectedTemplate)}
            >
              Apply Template
            </Button>
          </div>
        )}
      </div>

      <div className='grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-6'>
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
            <CardContent className='p-2 md:p-6'>
              <div className='relative mb-2 aspect-[210/297] overflow-hidden rounded-lg border md:mb-4'>
                <Image
                  src={template.thumbnail ?? ''}
                  alt={template.name}
                  fill
                  className='object-cover'
                />
              </div>
              <div className='space-y-0.5 md:space-y-2'>
                <h3 className='line-clamp-1 text-sm font-semibold md:text-lg'>
                  {template.name}
                </h3>
                <p className='line-clamp-2 text-[10px] text-muted-foreground md:text-sm'>
                  {template.description}
                </p>
                {currentTemplate === template.id && (
                  <p className='text-[10px] font-medium text-primary md:text-sm'>
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
