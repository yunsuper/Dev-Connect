// src/lib/fileUtils.ts
export const getFileType = (url: string) => {
    if (!url) return "text";
    const ext = url.split(".").pop()?.split(/[#?]/)[0]?.toLowerCase() || "";

    if (["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"].includes(ext))
        return "image";
    if (["zip", "7z", "tar", "gz", "tgz"].includes(ext)) return "archive";
    if (["md", "txt", "pdf", "json", "ppt", "pptx"].includes(ext))
        return "document";
    return "text";
};
