import { supabase } from "./supabase";

export const uploadFileToStorage = async (file: File) => {
    try {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from("chat-images")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
            .from("chat-images")
            .getPublicUrl(filePath);

        return data.publicUrl;
    } catch (error) {
        console.error("❌ 파일 업로드 에러:", error);
        alert(
            "파일 업로드에 실패했습니다. (50MB 제한 및 파일 형식을 확인하세요)"
        );
        return null;
    }
};
