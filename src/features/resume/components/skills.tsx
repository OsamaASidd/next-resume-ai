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

interface SkillsProps {
  control: Control<TResumeEditFormValues>;
}

export const Skills = ({ control }: SkillsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'skills'
  });

  return (
    <div className='space-y-6'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold'>Skills</h2>
        <Button
          type='button'
          variant='outline'
          size='sm'
          onClick={() =>
            append({
              skill_name: '',
              proficiency_level: 'beginner'
            })
          }
        >
          <PlusCircle className='mr-2 h-4 w-4' />
          Add Skill
        </Button>
      </div>

      <div className='grid gap-4'>
        {fields.map((field, index) => (
          <div key={field.id} className='flex items-end gap-4'>
            <FormField
              control={control}
              name={`skills.${index}.skill_name`}
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Skill Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='e.g. React.js' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name={`skills.${index}.proficiency_level`}
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
                      <SelectItem value='beginner'>Beginner</SelectItem>
                      <SelectItem value='intermediate'>Intermediate</SelectItem>
                      <SelectItem value='advanced'>Advanced</SelectItem>
                      <SelectItem value='expert'>Expert</SelectItem>
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
