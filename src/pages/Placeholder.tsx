type PlaceholderProps = {
  title: string;
};

export default function Placeholder({ title }: PlaceholderProps) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-sm text-slate-500 mt-2">Port in progress.</p>
    </div>
  );
}
