import { ProFeatureAlert } from "@/components/billing/pro-feature-alert";
import { columns as invitationColumns } from "@/components/data-table/invitation/columns";
import { DataTable as InvitationDataTable } from "@/components/data-table/invitation/data-table";
import { columns as userColumns } from "@/components/data-table/user/columns";
import { DataTable as UserDataTable } from "@/components/data-table/user/data-table";
import { InfoBanner } from "./_components/info-banner";
import { InviteButton } from "./_components/invite-button";
import {
  getCurrentUser,
  getCurrentWorkspaceNumbers,
  getWorkspace,
  getWorkspaceOpenInvitations,
  getWorkspaceUsers,
} from "@/lib/databasecalls";

export default async function TeamPage() {
  const workspace = await getWorkspace();
  const invitations = await getWorkspaceOpenInvitations();
  const users = await getWorkspaceUsers();

  const workspaceUser = await getWorkspaceUsers();
  const currentUser = await getCurrentUser();
  const userRole = workspaceUser.find(
    (user) => user.userId === currentUser?.id
  )?.role;

  const isFreePlan = workspace.plan === "free";
  const { members } = await getCurrentWorkspaceNumbers();
  const membersLimit =
    workspace.limits.members === "Unlimited" ? 420 : workspace.limits.members;
  return (
    <div className="flex flex-col gap-4">
      {isFreePlan ? <ProFeatureAlert feature="Team members" /> : null}
      {!isFreePlan && !workspace.name ? <InfoBanner /> : null}
      {userRole === "owner" || userRole === "admin" ? (
        <div className="flex justify-end">
          <InviteButton
            disabled={isFreePlan}
            joinCode={workspace.joinCode}
            name={workspace.name ?? workspace.slug}
            limitExceeded={members >= membersLimit}
          />
        </div>
      ) : null}
      <UserDataTable
        data={users.map(({ role, user }) => ({ role, ...user }))}
        columns={userColumns}
      />
      {invitations.length > 0 ? (
        <InvitationDataTable data={invitations} columns={invitationColumns} />
      ) : null}
    </div>
  );
}
