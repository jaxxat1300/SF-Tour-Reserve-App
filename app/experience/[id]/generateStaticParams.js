import { mockExperiences } from '@/lib/mockData';

export async function generateStaticParams() {
  return mockExperiences.map((experience) => ({
    id: experience.id,
  }));
}

