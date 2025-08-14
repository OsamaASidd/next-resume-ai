export interface ResumeChange {
  section:
    | 'personal_details'
    | 'jobs'
    | 'educations'
    | 'skills'
    | 'tools'
    | 'languages';
  action: 'update' | 'add' | 'remove';
  index?: number;
  data?: any;
  explanation?: string;
}

export function validateResumeChange(change: any): change is ResumeChange {
  if (!change || typeof change !== 'object') {
    return false;
  }

  const validSections = [
    'personal_details',
    'jobs',
    'educations',
    'skills',
    'tools',
    'languages'
  ];
  const validActions = ['update', 'add', 'remove'];

  // Check required fields
  if (
    !validSections.includes(change.section) ||
    !validActions.includes(change.action)
  ) {
    return false;
  }

  // Validate section-specific rules
  if (change.section === 'personal_details') {
    // Personal details only supports update action
    if (change.action !== 'update') {
      console.warn('Personal details section only supports update action');
      return false;
    }
    // Should not have index for personal_details
    if (typeof change.index === 'number') {
      console.warn('Personal details updates should not have index');
      return false;
    }
  } else {
    // Array sections (jobs, educations, skills, tools, languages)
    if (change.action === 'update' || change.action === 'remove') {
      // Update and remove actions need index for arrays
      if (typeof change.index !== 'number') {
        console.warn(
          `${change.action} action requires index for section ${change.section}`
        );
        return false;
      }
    }
  }

  // Remove action doesn't need data
  if (change.action === 'remove' && change.data !== undefined) {
    console.warn('Remove action should not have data field');
  }

  // Add and update actions should have data (except remove)
  if (
    (change.action === 'add' || change.action === 'update') &&
    change.data === undefined
  ) {
    console.warn(`${change.action} action requires data field`);
    return false;
  }

  return true;
}

export function validateResumeChanges(changes: any[]): ResumeChange[] {
  if (!Array.isArray(changes)) {
    return [];
  }

  return changes.filter(validateResumeChange);
}

export function summarizeChanges(changes: ResumeChange[]): string {
  if (changes.length === 0) {
    return 'No changes to apply.';
  }

  const summary = changes.map((change) => {
    const sectionName = change.section.replace('_', ' ').toUpperCase();
    const action = change.action.toUpperCase();
    const explanation = change.explanation || 'No explanation provided';

    if (change.action === 'remove') {
      return `• REMOVE from ${sectionName}: ${explanation}`;
    } else if (change.action === 'add') {
      return `• ADD to ${sectionName}: ${explanation}`;
    } else {
      return `• UPDATE ${sectionName}: ${explanation}`;
    }
  });

  return `Applied ${changes.length} change(s):\n${summary.join('\n')}`;
}

export function getChangeDescription(change: ResumeChange): string {
  const sectionName = change.section.replace('_', ' ');

  switch (change.action) {
    case 'add':
      return `Add new item to ${sectionName}`;
    case 'remove':
      return `Remove item from ${sectionName}`;
    case 'update':
      return change.section === 'personal_details'
        ? `Update ${sectionName}`
        : `Update item in ${sectionName}`;
    default:
      return `Modify ${sectionName}`;
  }
}
