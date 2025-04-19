import { ProjectInvitations } from "@/components/dashboard/project-invitations"

export default function InvitationsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">Taklifnomalar</h1>
      <ProjectInvitations />
    </div>
  )
}
