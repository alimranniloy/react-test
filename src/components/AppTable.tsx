import * as React from "react";
import { Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type AppTableProps = React.HTMLAttributes<HTMLTableElement>;

export default function AppTable({ className, ...props }: AppTableProps) {
  return <Table className={cn("data-table", className)} {...props} />;
}
