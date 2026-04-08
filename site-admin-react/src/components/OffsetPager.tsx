import PaginationFooter from "@/components/PaginationFooter";

type OffsetPagerProps = {
  count: number;
  offset: number;
  limit: number;
  hasNext: boolean;
  onNext: () => void;
  onPrev: () => void;
  loading?: boolean;
};

export default function OffsetPager({
  count,
  offset,
  limit,
  hasNext,
  onNext,
  onPrev,
  loading
}: OffsetPagerProps) {
  const page = Math.floor(offset / limit) + 1;
  const pageCount = hasNext ? page + 1 : page;
  const start = count === 0 ? 0 : offset + 1;
  const end = offset + count;

  return (
    <PaginationFooter
      count={count}
      hasNext={hasNext}
      loading={loading}
      page={page}
      pageCount={pageCount}
      from={start}
      to={end}
      onPageChange={(nextPage) => {
        if (nextPage < page) {
          onPrev();
        } else if (nextPage > page) {
          onNext();
        }
      }}
    />
  );
}
