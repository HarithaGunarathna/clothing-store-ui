import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-display text-8xl font-medium text-clay-500">404</p>
      <h1 className="mt-4 font-display text-3xl font-medium text-ink">
        This page went missing
      </h1>
      <p className="mt-3 max-w-sm text-muted">
        The page you're looking for doesn't exist — or it sold out and moved on.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/" size="lg">
          Back to Luna
        </Button>
        <Button to="/new" variant="secondary" size="lg">
          Shop new in
        </Button>
      </div>
    </div>
  );
}
