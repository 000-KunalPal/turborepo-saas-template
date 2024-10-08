"use server";

import { and, db, eq, gte, isNull, schema, sql } from "@dashboardbuddy/db";
import { auth } from "../auth";
import { cookies } from "next/headers";
import {
  invitation,
  selectWorkspaceSchema,
  user,
  usersToWorkspaces,
  workspace,
  workspacePlanSchema,
} from "@dashboardbuddy/db/src/schema";
import { z } from "zod";
import * as randomWordSlugs from "random-word-slugs";
import { Limits } from "@dashboardbuddy/db/src/schema/plan/schema";

export async function AuthUserWithWorkpace() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }

  const userAndWorkspace = await db.query.user.findFirst({
    where: eq(schema.user.id, Number(session.user.id)),
    with: {
      usersToWorkspaces: {
        with: {
          workspace: true,
        },
      },
    },
  });

  const { usersToWorkspaces, ...userProps } = userAndWorkspace || {};

  const workspaceSlug = cookies().get("workspace-slug")?.value;

  const activeWorkspace = usersToWorkspaces?.find(({ workspace }) => {
    // If there is a workspace slug in the cookie, use it to find the workspace
    if (workspaceSlug) return workspace.slug === workspaceSlug;
    return true;
  })?.workspace;

  if (!activeWorkspace) throw new Error("Workspace not found");
  if (!userProps) throw new Error("User not found");

  const user = schema.selectUserSchema.parse(userProps);
  const workspace = schema.selectWorkspaceSchema.parse(activeWorkspace);

  return {
    USER: user,
    WORKSPACE: workspace,
  };
}

// user

export async function getCurrentUser() {
  const { USER } = await AuthUserWithWorkpace();
  const currentUser = await db
    .select()
    .from(user)
    .where(eq(user.id, USER.id))
    .get();

  return currentUser;
}

// workspace

export async function createWorkspace() {
  const { USER } = await AuthUserWithWorkpace();
  // guarantee the slug is unique accross our workspace entries
  let slug: string | undefined = undefined;

  while (!slug) {
    slug = randomWordSlugs.generateSlug(2);
    const slugAlreadyExists = await db
      .select()
      .from(workspace)
      .where(eq(workspace.slug, slug))
      .get();
    if (slugAlreadyExists) {
      console.log(`slug already exists: '${slug}'`);
      slug = undefined;
    }
  }

  const _workspace = await db
    .insert(workspace)
    .values({ slug, name: "" })
    .returning({ id: workspace.id })
    .get();

  await db
    .insert(usersToWorkspaces)
    .values({
      userId: USER.id,
      workspaceId: _workspace.id,
      role: "owner",
    })
    .returning()
    .get();
}

export async function getUserWithWorkspace() {
  const { USER } = await AuthUserWithWorkpace();
  return await db.query.user.findMany({
    with: {
      usersToWorkspaces: {
        with: {
          workspace: true,
        },
      },
    },
    where: eq(user.id, USER.id),
  });
}

export async function getWorkspace() {
  const { WORKSPACE } = await AuthUserWithWorkpace();
  const result = await db.query.workspace.findFirst({
    where: eq(workspace.id, WORKSPACE.id),
  });

  return selectWorkspaceSchema.parse(result);
}

export async function getUserWorkspaces() {
  const { USER } = await AuthUserWithWorkpace();
  const result = await db.query.usersToWorkspaces.findMany({
    where: eq(usersToWorkspaces.userId, USER.id),
    with: {
      workspace: true,
    },
  });

  return selectWorkspaceSchema
    .array()
    .parse(result.map(({ workspace }) => workspace));
}

export async function updateWorkspace({ name }: { name: string }) {
  const { WORKSPACE } = await AuthUserWithWorkpace();
  return await db
    .update(workspace)
    .set({
      name,
    })
    .where(eq(workspace.id, WORKSPACE.id))
    .returning();
}

export async function getWorkspaceUsers() {
  const { WORKSPACE } = await AuthUserWithWorkpace();
  const result = await db.query.usersToWorkspaces.findMany({
    with: {
      user: true,
    },
    where: eq(usersToWorkspaces.workspaceId, WORKSPACE.id),
  });
  return result;
}

export async function removeWorkspaceUser({ id }: { id: number }) {
  const { USER, WORKSPACE } = await AuthUserWithWorkpace();
  const _userToWorkspace = await db.query.usersToWorkspaces.findFirst({
    where: and(
      eq(usersToWorkspaces.userId, USER.id),
      eq(usersToWorkspaces.workspaceId, WORKSPACE.id)
    ),
  });

  if (!_userToWorkspace) throw new Error("No user to workspace found");

  if (!["owner"].includes(_userToWorkspace.role))
    throw new Error("Not authorized to remove user from workspace");

  if (id === USER.id) throw new Error("Cannot remove yourself from workspace");

  await db
    .delete(usersToWorkspaces)
    .where(
      and(
        eq(usersToWorkspaces.userId, id),
        eq(usersToWorkspaces.workspaceId, WORKSPACE.id)
      )
    )
    .run();
}

export async function changePlan({
  plan,
}: {
  plan: z.infer<typeof workspacePlanSchema>;
}) {
  const validatedPlan = workspacePlanSchema.parse(plan);
  const { USER, WORKSPACE } = await AuthUserWithWorkpace();

  const _userToWorkspace = await db.query.usersToWorkspaces.findFirst({
    where: and(
      eq(usersToWorkspaces.userId, USER.id),
      eq(usersToWorkspaces.workspaceId, WORKSPACE.id)
    ),
  });

  if (!_userToWorkspace) throw new Error("No user to workspace found");

  if (!["owner"].includes(_userToWorkspace.role))
    throw new Error("Not authorized to change plan");

  if (!WORKSPACE.stripeId) {
    throw new Error("No Stripe ID found for workspace");
  }

  // TODO: Create subscription
  switch (validatedPlan) {
    case "free": {
      break;
    }
    case "starter": {
      break;
    }
    case "team": {
      break;
    }
    case "pro": {
      break;
    }
    default: {
    }
  }

  await db
    .update(workspace)
    .set({ plan: validatedPlan })
    .where(eq(workspace.id, WORKSPACE.id));
}

export async function getCurrentWorkspaceNumbers() {
  const { WORKSPACE } = await AuthUserWithWorkpace();
  const currentNumbers = await db.transaction(async (tx) => {
    const members = await tx
      .select({ count: sql<number>`count(*)` })
      .from(usersToWorkspaces)
      .where(eq(usersToWorkspaces.workspaceId, WORKSPACE.id));
    return {
      members: members?.[0]?.count || 0,
    } satisfies Partial<Limits>;
  });
  return currentNumbers;
}

// invitation

export async function getWorkspaceOpenInvitations() {
  const { WORKSPACE } = await AuthUserWithWorkpace();
  const _invitations = await db.query.invitation.findMany({
    where: and(
      eq(invitation.workspaceId, WORKSPACE.id),
      gte(invitation.expiresAt, new Date()),
      isNull(invitation.acceptedAt)
    ),
  });
  return _invitations;
}

export async function createInvitation({ email }: { email: string }) {
  const { WORKSPACE, USER } = await AuthUserWithWorkpace();

  const _members = WORKSPACE.limits.members;
  const membersLimit = _members === "Unlimited" ? 420 : _members;

  const usersToWorkspacesNumbers = (
    await db.query.usersToWorkspaces.findMany({
      where: eq(usersToWorkspaces.workspaceId, WORKSPACE.id),
    })
  ).length;

  const openInvitationsNumbers = (
    await db.query.invitation.findMany({
      where: and(
        eq(invitation.workspaceId, WORKSPACE.id),
        gte(invitation.expiresAt, new Date()),
        isNull(invitation.acceptedAt)
      ),
    })
  ).length;

  // the user has reached the limits
  if (usersToWorkspacesNumbers + openInvitationsNumbers >= membersLimit) {
    throw new Error("You reached your member limits.");
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const token = crypto.randomUUID();

  const _invitation = await db
    .insert(invitation)
    .values({ email, expiresAt, token, workspaceId: WORKSPACE.id })
    .returning()
    .get();

  if (process.env.NODE_ENV === "development") {
    console.log(
      `>>>> Invitation token: http://localhost:3000/app/invite?token=${_invitation.token} <<<< `
    );
  } else {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        to: email,
        from: "OpenStatus <ping@openstatus.dev>",
        subject: "You have been invited to join OpenStatus.dev",
        html: `<p>You have been invited by ${USER.email} ${
          WORKSPACE.name
            ? `to join the workspace '${WORKSPACE.name}'.`
            : "to join a workspace."
        }</p>
          <br>
          <p>Click here to access the workspace: <a href='http://localhost:3000/app/invite?token=${
            _invitation.token
          }'>accept invitation</a>.</p>
          <p>If you don't have an account yet, it will require you to create one.</p>
          `,
      }),
    });
  }

  return _invitation;
}

export async function acceptInvitation({ token }: { token: string }) {
  const session = await auth();
  const _invitation = await db.query.invitation.findFirst({
    where: and(eq(invitation.token, token), isNull(invitation.acceptedAt)),
    with: {
      workspace: true,
    },
  });

  if (!session?.user?.id) return { message: "Missing user." };

  const _user = await db.query.user.findFirst({
    where: eq(user.id, Number(session.user.id)),
  });

  if (!_user) return { message: "Invalid user." };

  if (!_invitation) return { message: "Invalid invitation token." };

  if (_invitation.email !== _user.email)
    return { message: "You are not invited to this workspace." };

  if (_invitation.expiresAt.getTime() < new Date().getTime()) {
    return { message: "Invitation expired." };
  }

  await db
    .update(invitation)
    .set({ acceptedAt: new Date() })
    .where(eq(invitation.id, _invitation.id))
    .run();

  await db
    .insert(usersToWorkspaces)
    .values({
      userId: _user.id,
      workspaceId: _invitation.workspaceId,
      role: _invitation.role,
    })
    .run();

  return {
    message: "Invitation accepted.",
    data: _invitation.workspace,
  };
}

export async function deleteInviation({ id }: { id: number }) {
  const { WORKSPACE } = await AuthUserWithWorkpace();
  await db
    .delete(invitation)
    .where(and(eq(invitation.id, id), eq(invitation.workspaceId, WORKSPACE.id)))
    .run();
}

export async function getInvitationByToken({ token }: { token: string }) {
  const _invitation = await db.query.invitation.findFirst({
    where: and(eq(invitation.token, token)),
    with: {
      workspace: true,
    },
  });
  return _invitation;
}
