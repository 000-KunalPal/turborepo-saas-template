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
import { toastAction } from "@/lib/toast";
import { createInvitation } from "@/lib/databasecalls";

const schema = insertInvitationSchema.pick({ email: true });
type Schema = z.infer<typeof schema>;

export function InviteButton({
  defaultValues,
  disabled,
}: {
  defaultValues?: Schema;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [inviteLink, setInviteLink] = useState("");
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen((v) => !v)} disabled={disabled}>
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
              <p>Generate a shareable invite link for your team members.</p>
              {inviteLink ? (
                <div className="flex items-center space-x-2">
                  <Input value={inviteLink} readOnly />
                  <Button
                    onClick={() => navigator.clipboard.writeText(inviteLink)}
                  >
                    Copy
                  </Button>
                </div>
              ) : (
                <Button onClick={() => {}}>
                  {!isPending ? "Generate Link" : <LoadingAnimation />}
                </Button>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
