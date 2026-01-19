/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// @ts-expect-error: Deno runtime imports are not recognized by Node-based TS
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const bucketName = "chat-images";

        const { data: list, error: listError } = await supabaseAdmin.storage
            .from(bucketName)
            .list();

        if (listError) throw listError;

        if (list && list.length > 0) {
            const filesToRemove = list.map((f: { name: string }) => f.name);

            const { error: removeError } = await supabaseAdmin.storage
                .from(bucketName)
                .remove(filesToRemove);

            if (removeError) throw removeError;

            return new Response(
                JSON.stringify({
                    message: `Success: ${filesToRemove.length} files removed.`,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 200,
                }
            );
        }

        return new Response(
            JSON.stringify({ message: "No files to delete." }),
            {
                headers: { "Content-Type": "application/json" },
                status: 200,
            }
        );
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);

        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});
