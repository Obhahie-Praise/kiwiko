import Sidebar from '@/components/Sidebar'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import React from 'react'

const HomePage = async () => {
  const session = await auth.api.getSession({headers: await headers()})
  const userId = session?.user.id
  const onboardingCheck = await prisma.onboardingSetup.count({
    where: {userId}
  })

  if (onboardingCheck === 0) {
    redirect("/onboarding/setup?page=1")
  }
  return (
    <div>
      <Sidebar />
    </div>
  )
}

export default HomePage