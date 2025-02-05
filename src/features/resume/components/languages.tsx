import { Control } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { type TResumeEditFormValues } from '../utils/form-schema';
import { useFieldArray } from 'react-hook-form';
import { PlusCircle, Trash2 } from 'lucide-react';

interface LanguagesProps {
  control: Control<TResumeEditFormValues>;
}

export const Languages = ({ control }: LanguagesProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'languages'
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Languages</h2>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() =>
            append({
              lang_name: '',
              proficiency_level: 'beginner'
            })
          }
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Add Language
        </Button>
      </div>

      <div className='grid gap-4'>
        {fields.map((field, index) => (
          <div key={field.id} className='flex items-end gap-4'>
            <FormField
              control={control}
              name={`languages.${index}.lang_name`}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Language</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. English' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`languages.${index}.proficiency_level`}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Proficiency Level</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select level' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='beginner'>Basic</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                      <SelectItem value='native'>Native</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type='button'
              variant='ghost'
              size='icon'
              onClick={() => remove(index)}
            >
              <Trash2 className='h-4 w-4' />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
