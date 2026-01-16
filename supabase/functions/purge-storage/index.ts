/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

// @ts-expect-error: Deno runtime imports are not recognized by Node-based TS
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// _req를 아예 제거하여 unused-vars 에러를 원천 차단합니다.
serve(async () => {
    try {
        const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
        const serviceRoleKey = Deno.env.get("SERVICE_ROLE_KEY") ?? "";

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

        const bucketName = "chat-images";

        // 1. 버킷 내 모든 파일 목록 조회
        const { data: list, error: listError } = await supabaseAdmin.storage
            .from(bucketName)
            .list();

        if (listError) throw listError;

        // 2. 파일이 있으면 전체 삭제
        if (list && list.length > 0) {
            // f: any 에러 방지를 위해 명시적 타입 지정
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
