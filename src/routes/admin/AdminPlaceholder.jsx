import Badge from "../../components/ui/Badge";
import Card from "../../components/ui/Card";

export default function AdminPlaceholder({ title, description }) {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl font-medium text-ink">{title}</h1>
      {description ? <p className="mt-2 text-sm text-muted">{description}</p> : null}

      <Card className="mt-8 flex flex-col items-center gap-3 p-10 text-center">
        <Badge tone="ink">Coming soon</Badge>
        <p className="text-sm text-muted">This section hasn't been built yet.</p>
      </Card>
    </div>
  );
}
