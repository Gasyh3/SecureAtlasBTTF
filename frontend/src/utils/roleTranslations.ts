export const translateRole = (role: 'student' | 'instructor'): string => {
  const roleTranslations = {
    student: 'Étudiant',
    instructor: 'Instructeur'
  };
  
  return roleTranslations[role] || role;
}; 