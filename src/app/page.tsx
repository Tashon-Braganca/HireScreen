import { createClient } from "@/lib/supabase/server";
import DesignBPage from "@/components/landing/DesignBPage";

export default async function Home() {
    const supabase = createClient();
    const { data: { user } } = await (await supabase).auth.getUser();

    return (
        <DesignBPage user={user} />
    );
}
