import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface ModeToggleProps {
  mode: 'edit' | 'template' | 'preview' | 'zen';
  onModeChange: (mode: 'edit' | 'template' | 'preview' | 'zen') => void;
  isMobile?: boolean;
}

export function ModeToggle({
  mode,
  onModeChange,
  isMobile = false
}: ModeToggleProps) {
  const modes = isMobile
    ? [
        { value: 'edit', label: 'Form' },
        { value: 'template', label: 'Template' },
        { value: 'preview', label: 'Preview' }
      ]
    : [
        { value: 'edit', label: 'Edit' },
        { value: 'template', label: 'Template' }
      ];

  return (
    <div className='mb-4 flex space-x-2'>
      {modes.map(({ value, label }) => (
        <Button
          key={value}
          variant={mode === value ? 'default' : 'outline'}
          onClick={() => onModeChange(value as typeof mode)}
          size={isMobile ? 'sm' : 'default'}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
