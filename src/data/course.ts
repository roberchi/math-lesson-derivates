export interface CourseSection {
  id: string;
  title: string;
  shortTitle: string;
  path: string;
  lesson: 1 | 2;
  duration: string;
}

export const lessonSections: CourseSection[] = [
  { id: 'velocita', title: 'Il problema: velocità istantanea', shortTitle: 'Velocità istantanea', path: '/lezione-1/velocita', lesson: 1, duration: '10 min' },
  { id: 'geometria', title: 'Geometria della derivata', shortTitle: 'Geometria', path: '/lezione-1/geometria', lesson: 1, duration: '20 min' },
  { id: 'definizione', title: 'Definizione formale', shortTitle: 'Definizione formale', path: '/lezione-1/definizione', lesson: 1, duration: '25 min' },
  { id: 'derivabilita', title: 'Derivabilità e punti singolari', shortTitle: 'Derivabilità', path: '/lezione-1/derivabilita', lesson: 1, duration: '25 min' },
  { id: 'interpretazioni', title: 'Interpretazione fisica', shortTitle: 'Interpretazione fisica', path: '/lezione-1/interpretazioni', lesson: 1, duration: '25 min' },
  { id: 'warmup', title: 'Ripasso e warm-up', shortTitle: 'Warm-up', path: '/lezione-2/warmup', lesson: 2, duration: '10 min' },
  { id: 'fondamentali', title: 'Derivate fondamentali', shortTitle: 'Derivate fondamentali', path: '/lezione-2/fondamentali', lesson: 2, duration: '30 min' },
  { id: 'regole', title: 'Regole di derivazione', shortTitle: 'Regole di derivazione', path: '/lezione-2/regole', lesson: 2, duration: '30 min' },
  { id: 'derivata-seconda', title: 'Derivata seconda', shortTitle: 'Derivata seconda', path: '/lezione-2/derivata-seconda', lesson: 2, duration: '20 min' },
  { id: 'taylor', title: 'Serie di Taylor', shortTitle: 'Taylor · opzionale', path: '/lezione-2/taylor', lesson: 2, duration: '15 min' },
  { id: 'teoremi', title: 'Appendice: teoremi della derivata', shortTitle: 'Teoremi · appendice', path: '/lezione-2/teoremi', lesson: 2, duration: '45 min' },
];

export const lessonOneSections = lessonSections.filter((section) => section.lesson === 1);
export const lessonTwoSections = lessonSections.filter((section) => section.lesson === 2);

export function adjacentSection(id: string, direction: -1 | 1) {
  const index = lessonSections.findIndex((section) => section.id === id);
  return lessonSections[index + direction];
}
