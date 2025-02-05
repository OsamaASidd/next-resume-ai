import { ComponentType } from 'react';
import { TResumeEditFormValues } from '../utils/form-schema';
import dynamic from 'next/dynamic';

export type ResumeTemplateProps = {
  formData: TResumeEditFormValues;
};

export type TemplateConfig = {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  component: ComponentType<ResumeTemplateProps>;
};

const templateRegistry: Record<string, TemplateConfig> = {
  'template-one': {
    id: 'template-one',
    name: 'Professional Split',
    thumbnail: '/templates/template-one.png',
    description: 'Classic two-column layout with a professional look',
    component: dynamic(() => import('./templateOne'))
  },
  'template-two': {
    id: 'template-two',
    name: 'Modern Clean',
    thumbnail: '/templates/template-two.png',
    description: 'Modern single-column design with clean typography',
    component: dynamic(() => import('./templateTwo'))
  }
};

export const getTemplate = (templateId: string): TemplateConfig => {
  return templateRegistry[templateId];
};

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(templateRegistry);
};
