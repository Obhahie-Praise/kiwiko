"use client";

import { useParams } from "next/navigation";

/**
 * Custom hook to easily access orgSlug and projectSlug from URL parameters.
 * Use this in client components to avoid redundant useParams() calls and type casting.
 */
export function useProjectSlugs() {
  const params = useParams();

  return {
    orgSlug: params?.orgSlug as string,
    projectSlug: params?.projectSlug as string,
  };
}
