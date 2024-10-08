import { cn } from "@/lib/utils";
import { LoginButton } from "./login-button";

interface Props {
  className?: string;
}

export function MarketingHeader({ className }: Props) {
  return (
    <header
      className={cn(
        "sticky top-3 z-10 flex w-full items-center justify-between gap-8 rounded-full border border-border px-2.5 py-1.5 backdrop-blur-lg md:top-6",
        className
      )}
    >
      <LoginButton />
    </header>
  );
}
