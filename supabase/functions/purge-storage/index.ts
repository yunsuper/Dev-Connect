/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async () => {
    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
        const bucketName = "chat-images";

        // 1. 파일 목록 가져오기 (시스템 파일 제외 옵션)
        const { data: list, error: listError } = await supabaseAdmin.storage
            .from(bucketName)
            .list("", {
                limit: 100,
                offset: 0,
                sortBy: { column: "name", order: "asc" },
            });

        if (listError) throw listError;

        // 2. 실제 삭제할 파일만 필터링 (.emptyKeep 등 시스템 파일 제외)
        // f.id가 없거나 이름이 시스템 파일인 경우 제외
        const filesToRemove = list
            .filter((f) => f.name !== ".emptyKeep" && f.id !== null)
            .map((f) => f.name);

        if (filesToRemove.length > 0) {
            console.log(
                `Attempting to remove files: ${filesToRemove.join(", ")}`,
            );

            const { data: removeData, error: removeError } =
                await supabaseAdmin.storage
                    .from(bucketName)
                    .remove(filesToRemove);

            if (removeError) throw removeError;

            return new Response(
                JSON.stringify({
                    message: `Success: ${filesToRemove.length} files removed.`,
                    details: removeData,
                }),
                {
                    headers: { "Content-Type": "application/json" },
                    status: 200,
                },
            );
        }

        return new Response(
            JSON.stringify({ message: "No target files to delete." }),
            { headers: { "Content-Type": "application/json" }, status: 200 },
        );
    } catch (error: unknown) {
        const errorMessage =
            error instanceof Error ? error.message : String(error);
        console.error(`Error in Cron Job: ${errorMessage}`);

        return new Response(JSON.stringify({ error: errorMessage }), {
            headers: { "Content-Type": "application/json" },
            status: 500,
        });
    }
});
