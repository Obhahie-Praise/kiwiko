import NewOrgForm from '@/components/organization/NewOrgForm';
import Navbar from '@/components/common/Navbar';
import { redirect } from "next/navigation";
import { getFullUserContext } from "@/lib/dal";

const NewOrganisationPage = async () => {
    const userContext = await getFullUserContext();
  
    if (!userContext) {
       redirect("/sign-in?callbackUrl=/new-organisation");
    }
  
    const organizations = userContext.memberships.map((m: any) => m.organization) || [];

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      {/* Pass a dummy currentOrg if needed or relying on first one? 
          For new organization page, maybe "current" is none or the first?
          If we pass none, Navbar will use organizations[0] or default placeholder.
          The user is creating a NEW one, so maybe show "Create Organization" or "Select Org"?
          Let's pass organizations only. Navbar handles default. 
      */}
      <Navbar showNewOrgButton={false} organizations={organizations} user={userContext as any} />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-y-auto">
        <NewOrgForm />
      </div>
    </div>
  );
};

export default NewOrganisationPage;
