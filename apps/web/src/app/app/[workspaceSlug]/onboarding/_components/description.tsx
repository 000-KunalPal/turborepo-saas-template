import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

const steps = ["workspace", "board"] as const;
const onboardingConfig = {
  workspace: {
    icon: "activity",
    name: "Workspace",
    description: [
      {
        title: "What is a workspace?",
        text: "A workspace gives you access to invite members for collabration in your work.",
      },
      {
        title: "How to create workspace?",
        text: "You can create a monitor like you are about to via our dashboard or using workspace selector in header.",
      },
    ],
  },
  board: {
    icon: "table",
    name: "Board",
    description: [
      {
        title: "What is a board?",
        text: "A Board contains columns and tasks.",
      },
      {
        title: "How to create board?",
        text: "You can create a board like you are about to via our dashboard or you can create board later in your dashboard.",
      },
    ],
  },
} as const;

export function Description({
  step,
}: {
  step?: keyof typeof onboardingConfig;
}) {
  const config = step && onboardingConfig[step];
  return (
    <div className="flex h-full flex-col gap-6 border-border border-l pl-6 md:pl-8">
      <div className="flex gap-5">
        {steps.map((item, _i) => {
          const { icon, name } = onboardingConfig[item];
          const StepIcon = Icons[icon];
          const active = step === item;
          return (
            <div key={name} className="flex items-center gap-2">
              <div
                className={cn(
                  "max-w-max rounded-full border border-border p-2",
                  active && "border-accent-foreground"
                )}
              >
                <StepIcon className="h-4 w-4" />
              </div>
              <p
                className={cn(
                  "text-sm",
                  active
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {name}
              </p>
            </div>
          );
        })}
      </div>
      {config?.description.map(({ title, text }) => {
        return (
          <dl key={title} className="grid gap-1">
            <dt className="font-medium">{title}</dt>
            <dd className="text-muted-foreground">{text}</dd>
          </dl>
        );
      })}
    </div>
  );
}
