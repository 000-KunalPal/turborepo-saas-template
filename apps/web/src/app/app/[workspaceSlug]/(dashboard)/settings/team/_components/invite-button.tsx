"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { insertInvitationSchema } from "@dashboardbuddy/db/src/schema";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@dashboardbuddy/ui/components/form";
import { Button } from "@dashboardbuddy/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@dashboardbuddy/ui/components/dialog";
import { Input } from "@dashboardbuddy/ui/components/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@dashboardbuddy/ui/components/tabs";
import { LoadingAnimation } from "@/components/loading-animation";
import { toast, toastAction } from "@/lib/toast";
import { createInvitation } from "@/lib/databasecalls";
import { Copy, RefreshCcw, AlertTriangle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@dashboardbuddy/ui/components/alert";

const schema = insertInvitationSchema.pick({ email: true });
type Schema = z.infer<typeof schema>;

export function InviteButton({
  defaultValues,
  disabled,
  name,
  joinCode,
  limitExceeded,
}: {
  defaultValues?: Schema;
  disabled?: boolean;
  name: string;
  joinCode: string;
  limitExceeded: boolean;
}) {
  const [open, setOpen] = useState(false);
  const inviteLink = `${window.origin}/app/invite-via-link?joinCode=${joinCode}`;

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues,
  });
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function onSubmitEmail(data: Schema) {
    startTransition(async () => {
      try {
        await createInvitation(data);
        toastAction("saved");
        router.refresh();
      } catch {
        toastAction("error");
      } finally {
        setOpen(false);
      }
    });
  }

  const handleCopy = () => {
    if (!limitExceeded) {
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => toast.success("Invite link copied to clipboard"));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen((v) => !v)}
          disabled={disabled || limitExceeded}
        >
          Invite Member
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite your team members!</DialogTitle>
          <DialogDescription>
            Choose how you'd like to invite team members.
          </DialogDescription>
        </DialogHeader>
        {limitExceeded ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Workspace Membership Full</AlertTitle>
            <AlertDescription>
              Your workspace has reached its member limit. Please upgrade your
              plan to invite more members.
            </AlertDescription>
          </Alert>
        ) : (
          <Tabs defaultValue="email">
            <TabsList>
              <TabsTrigger value="email">Invite via Email</TabsTrigger>
              <TabsTrigger value="link">Invite via Link</TabsTrigger>
            </TabsList>
            <TabsContent value="email">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmitEmail)}
                  className="grid w-full grid-cols-1 items-center gap-6 sm:grid-cols-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="sm:col-span-5">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormDescription>
                          We will send an invite to this email address.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="sm:col-span-full">
                    <Button className="w-full sm:w-auto" size="lg">
                      {!isPending ? "Send Invite" : <LoadingAnimation />}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            <TabsContent value="link">
              <div className="space-y-4">
                <p>Invite your team members via shareable link.</p>
                <div className="flex items-center mt-2 gap-x-2">
                  <Input
                    value={
                      limitExceeded
                        ? "Upgrade to invite more members"
                        : inviteLink
                    }
                    readOnly
                  />
                  <Button
                    onClick={handleCopy}
                    size="icon"
                    variant="ghost"
                    disabled={limitExceeded}
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
                <Button onClick={() => {}} disabled={limitExceeded}>
                  <RefreshCcw className="size-4 mr-2" />
                  Regenerate Link
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
