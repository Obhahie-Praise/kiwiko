import React from 'react';
import NewOrgForm from '@/components/organization/NewOrgForm';
import Navbar from '@/components/common/Navbar';

const NewOrganisationPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar showNewOrgButton={false} />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-y-auto">
        <NewOrgForm />
      </div>
    </div>
  );
};

export default NewOrganisationPage;
