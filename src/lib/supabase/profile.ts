type SupabaseProfileClient = {
  from: (table: "profiles") => {
    upsert: (
      values: {
        id: string;
        email: string;
        full_name: string | null;
        avatar_url: string | null;
      },
      options?: { onConflict?: string }
    ) => unknown;
  };
};

type AuthUser = {
  id: string;
  email?: string | null;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
};

export async function ensureUserProfile(supabase: SupabaseProfileClient, user: AuthUser) {
  const fullName = user.user_metadata?.full_name || user.user_metadata?.name || null;
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || null;

  const { error } = (await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      { onConflict: "id" }
    )) as { error: { message: string } | null };

  if (error) {
    return { success: false as const, error: error.message };
  }

  return { success: true as const };
}
