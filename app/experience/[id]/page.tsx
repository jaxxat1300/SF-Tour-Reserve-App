import { mockExperiences } from '@/lib/mockData';
import ExperienceDetail from './ExperienceDetail';

// Generate static params for all experiences (required for static export)
export async function generateStaticParams() {
  return mockExperiences.map((experience) => ({
    id: experience.id,
  }));
}

export default function ExperienceDetailPage() {
  return <ExperienceDetail />;
}
