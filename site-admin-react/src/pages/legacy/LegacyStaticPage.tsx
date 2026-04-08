import Placeholder from "@/pages/Placeholder";

type LegacyStaticPageProps = {
  title: string;
};

export default function LegacyStaticPage({ title }: LegacyStaticPageProps) {
  return <Placeholder title={title} />;
}
