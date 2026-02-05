import { useUserDetails } from "./useUserDetails.ts";

interface UserDetailsWithWhitelists {
  whitelists?: string[];
  [key: string]: any;
}

/**
 * Get trustedlist from user details.
 * The trustedlist is embedded in the user details response as the "whitelists" field.
 */
export function useTrustedlist() {
  const { data: userDetails, ...rest } = useUserDetails();
  const details = userDetails as UserDetailsWithWhitelists | undefined;

  return {
    ...rest,
    data: details?.whitelists || [],
  };
}
