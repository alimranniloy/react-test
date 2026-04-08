import * as Heroicons from "@heroicons/react/24/outline";

export default function Icon({
  name,
  className = "h-4 w-4",
}: {
  name: string;
  className?: string;
}) {
  const AnyIcon = (Heroicons as any)[name] as
    | React.ComponentType<{ className?: string }>
    | undefined;
  if (!AnyIcon) return null;
  return <AnyIcon className={className} />;
}

