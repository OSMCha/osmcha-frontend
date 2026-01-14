import { useUserDetails } from "./useUserDetails";

/**
 * Get trustedlist from user details.
 * The trustedlist is embedded in the user details response as the "whitelists" field.
 */
export function useTrustedlist(token: string | null) {
  const { data: userDetails, ...rest } = useUserDetails(token);

  return {
    ...rest,
    data: userDetails?.whitelists || [],
  };
}
