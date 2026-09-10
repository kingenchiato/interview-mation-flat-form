import { seedJobs } from "@/lib/seed";

/** Ensures seed job routes are available for static hosts if export is enabled later. */
export function generateStaticParams() {
  return seedJobs.map((job) => ({ id: job.id }));
}

export default function JobIdLayout({ children }: { children: React.ReactNode }) {
  return children;
}
