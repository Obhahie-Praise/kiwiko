import React from 'react';
import NewProjectForm from '@/components/projects/project components/NewProjectForm';
import Navbar from '@/components/common/Navbar';

const NewProjectPage = () => {
  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar showNewOrgButton={false} />
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8 flex justify-center overflow-y-auto">
        <NewProjectForm />
      </div>
    </div>
  );
};

export default NewProjectPage;
