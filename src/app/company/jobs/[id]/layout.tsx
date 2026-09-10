import { seedJobs } from "@/lib/seed";

export function generateStaticParams() {
  return seedJobs.map((job) => ({ id: job.id }));
}

export default function CompanyJobIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
