import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';

interface ModeToggleProps {
  mode: 'edit' | 'template';
  onModeChange: (mode: 'edit' | 'template') => void;
}

export function ModeToggle({ mode, onModeChange }: ModeToggleProps) {
  return (
    <div className='mb-4 flex items-center gap-2'>
      <Button
        variant={mode === 'edit' ? 'default' : 'outline'}
        size='sm'
        onClick={() => onModeChange('edit')}
      >
        <Icons.page className='mr-2 h-4 w-4' />
        Edit Mode
      </Button>
      <Button
        variant={mode === 'template' ? 'default' : 'outline'}
        size='sm'
        onClick={() => onModeChange('template')}
      >
        <Icons.laptop className='mr-2 h-4 w-4' />
        Template Mode
      </Button>
    </div>
  );
}
