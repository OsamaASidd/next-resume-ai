import { ComponentType } from 'react';
import { TResumeEditFormValues } from '../utils/form-schema';
import TemplateOne from './templateOne';
import TemplateTwo from './templateTwo';

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
    thumbnail: '/templates/templateone.png',
    description: 'Classic two-column layout with a professional look',
    component: TemplateOne
  },
  'template-two': {
    id: 'template-two',
    name: 'Modern Clean',
    thumbnail: '/templates/templatetwo.png',
    description: 'Modern single-column design with clean typography',
    component: TemplateTwo
  }
};

export const getTemplate = (templateId: string): TemplateConfig => {
  return templateRegistry[templateId];
};

export const getAllTemplates = (): TemplateConfig[] => {
  return Object.values(templateRegistry);
};
