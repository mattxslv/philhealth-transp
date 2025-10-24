import { Calendar, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

const updates = [
  {
    id: 1,
    title: "Updated Guidelines for Z-Benefits Package",
    date: "2024-10-15",
    category: "Policy",
    description: "New comprehensive guidelines for the Z-Benefits package have been released, including expanded coverage for critical illnesses.",
  },
  {
    id: 2,
    title: "2024 Q3 Financial Report Published",
    date: "2024-10-10",
    category: "Financial",
    description: "Third quarter financial statements now available, showing improved collection rates and sustained benefit payouts.",
  },
  {
    id: 3,
    title: "Accreditation of 50 New Healthcare Facilities",
    date: "2024-10-05",
    category: "Facilities",
    description: "PhilHealth expands network with 50 newly accredited hospitals and clinics across Visayas and Mindanao regions.",
  },
  {
    id: 4,
    title: "Enhanced Digital Claims Processing System",
    date: "2024-09-28",
    category: "Technology",
    description: "New digital platform reduces claims processing time by 30%, improving service delivery for members.",
  },
];

export function PolicyUpdates() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Latest Updates
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Recent policy changes, reports, and announcements
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {updates.map((update) => (
            <article
              key={update.id}
              className="rounded-lg border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  {update.category}
                </span>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <time dateTime={update.date}>{formatDate(update.date)}</time>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2 flex items-start gap-2">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                {update.title}
              </h3>
              <p className="text-sm text-muted-foreground">{update.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
