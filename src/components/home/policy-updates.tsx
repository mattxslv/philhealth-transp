import { Calendar, FileText } from "lucide-react";
import { formatDate } from "@/lib/utils";

const updates = [
  {
    id: 1,
    title: "New Guidelines for Z-Benefits Package",
    date: "2024-10-15",
    category: "Policy",
    description: "Wider coverage for critical illnesses! Check out the new guidelines that are more favorable for members.",
  },
  {
    id: 2,
    title: "Q3 2024 Financial Report Published!",
    date: "2024-10-10",
    category: "Financial",
    description: "Higher collection rates and continuous benefit payouts. See how we spent the funds this quarter.",
  },
  {
    id: 3,
    title: "50 New Hospitals Accredited!",
    date: "2024-10-05",
    category: "Facilities",
    description: "More places for treatment! 50 new hospitals in Visayas and Mindanao are now accredited.",
  },
  {
    id: 4,
    title: "Digital Claims System—30% Faster!",
    date: "2024-09-28",
    category: "Technology",
    description: "No more long processing times! New digital platform means faster approval of your claims.",
  },
];

export function PolicyUpdates() {
  return (
    <section className="py-16 bg-background">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            What's New?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Latest updates, policy changes, and announcements
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
