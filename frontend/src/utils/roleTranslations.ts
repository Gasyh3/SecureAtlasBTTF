export const translateRole = (role: 'student' | 'instructor' | 'admin'): string => {
  const roleTranslations = {
    student: 'Étudiant',
    instructor: 'Instructeur',
    admin: 'Administrateur'
  };
  
  return roleTranslations[role] || role;
}; 