import { authClient } from "~/utils/auth-client";

export async function handleSignOut() {
  await authClient.signOut({
    fetchOptions: {
      onSuccess: async () => {
        await navigateTo("signin", { external: true });
      },
    },
  });
}
