import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">Page not found</h2>
      <p className="text-sm text-slate-500 mt-2">
        The page you are looking for does not exist.
      </p>
      <div className="mt-4">
        <Link
          to="/"
          className="inline-flex items-center rounded-md bg-brand-600 px-3 py-2 text-sm font-medium text-white hover:bg-brand-700"
        >
          Go home
        </Link>
      </div>
    </div>
  );
}

