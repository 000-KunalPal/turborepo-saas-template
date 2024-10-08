import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function MarketingFooter({ className }: Props) {
  return <footer className={cn("w-full", className)}>footer</footer>;
}
