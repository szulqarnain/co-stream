import { NhostClient } from "@nhost/react";

// Import environment variables from enums
import { NHOST } from "../config/enums";
// Configure nhost client
export const nhost = new NhostClient({
  subdomain: NHOST.SUB_DOMAIN,
  region: NHOST.REGIION,
});
