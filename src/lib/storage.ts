import { supabase } from "./supabase";

/**
 * Supabase Storage에 파일을 업로드하고 Public URL을 반환합니다.
 */
export const uploadFileToStorage = async (file: File) => {
    try {
        // 1. 고유한 파일명 생성 (중복 방지 및 특수문자 문제 예방)
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}-${Math.random()
            .toString(36)
            .substring(2, 7)}.${fileExt}`;
        const filePath = `${fileName}`;

        // 2. 'chat-images' 버킷에 업로드
        const { error: uploadError } = await supabase.storage
            .from("chat-images")
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        // 3. 업로드된 파일의 Public URL 생성
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
