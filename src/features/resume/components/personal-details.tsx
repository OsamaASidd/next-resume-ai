import { Control } from 'react-hook-form';
import { useState } from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { type TResumeEditFormValues } from '@/features/resume/utils/form-schema';
import { Upload, X, User } from 'lucide-react';

interface PersonalDetailsProps {
  control: Control<TResumeEditFormValues>;
}

export function PersonalDetails({ control }: PersonalDetailsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const removeImage = () => {
    setSelectedImage(null);
  };

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-semibold'>Personal Details</h2>

      {/* Profile Picture Upload Section */}
      <div className='space-y-4'>
        <FormLabel>Profile Picture</FormLabel>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:items-start'>
          {/* Profile Picture Preview */}
          <div className='relative'>
            <div className='h-32 w-32 overflow-hidden rounded-full border-2 border-gray-200 bg-gray-50'>
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt='Profile preview'
                  className='h-full w-full object-cover'
                />
              ) : (
                <div className='flex h-full w-full items-center justify-center'>
                  <User className='h-12 w-12 text-gray-400' />
                </div>
              )}
            </div>
            {selectedImage && (
              <button
                type='button'
                onClick={removeImage}
                className='absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow-md hover:bg-red-600'
              >
                <X className='h-4 w-4' />
              </button>
            )}
          </div>

          {/* Upload Area */}
          <div className='flex-1'>
            <label className='block cursor-pointer'>
              <div
                className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                }`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <Upload className='mx-auto mb-2 h-8 w-8 text-gray-400' />
                <p className='mb-2 text-sm text-gray-600'>
                  Drop your profile picture here, or click to browse
                </p>
                <p className='text-xs text-gray-500'>
                  Recommended: Square image, at least 400x400px
                </p>
              </div>
              <input
                type='file'
                className='hidden'
                accept='image/*'
                onChange={handleFileInputChange}
              />
            </label>
          </div>
        </div>
        {/* Note for future integration */}
        <p className='text-xs italic text-gray-500'>
          Note: Profile picture upload is not yet connected to the database
        </p>
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <FormField
          control={control}
          name='personal_details.fname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='personal_details.lname'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='personal_details.email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type='email' {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='personal_details.phone'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input type='tel' {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='personal_details.country'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Country</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={control}
          name='personal_details.city'
          render={({ field }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...field} value={field.value ?? ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name='personal_details.summary'
        render={({ field }) => (
          <FormItem>
            <FormLabel>Professional Summary</FormLabel>
            <FormControl>
              <Textarea
                className='min-h-[100px]'
                {...field}
                value={field.value ?? ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
