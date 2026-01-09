const adjectives = [
    "밤샘하는",
    "버그잡는",
    "졸고있는",
    "열코하는",
    "커피수혈",
    "리팩토링",
    "배포중인",
    "샷추가한",
    "월급루팡",
    "풀스택인",
    "머리뜯는",
    "멘붕온",
    "각성한",
    "코딩노예",
    "포스있는",
    "세미콜론",
    "괄호찾는",
    "푸시하는",
    "머지중인",
    "인생무상",
    "고인물",
    "기계식키보드",
    "듀얼모니터",
    "맥북유저",
    "윈도우빠",
    "리눅스장인",
    "다크모드",
    "Vim유저",
    "VSCode빌런",
    "깃허브",
    "스택오버플로우",
    "GPT의존",
    "구글링왕",
];

const nouns = [
    "리액트",
    "자바스크립트",
    "파이썬",
    "타입스크립트",
    "넥스트",
    "노드",
    "자바",
    "주니어",
    "시니어",
    "풀스택",
    "백엔드",
    "프론트",
    "데이터",
    "퍼블리셔",
    "기획자",
    "다람쥐",
    "거북이",
    "너구리",
    "코딩문어",
    "러버덕",
    "커피머신",
    "터미널",
    "세미콜론",
    "콘솔로그",
    "널포인터",
    "언디파인드",
    "정규식",
    "알고리즘",
    "로컬호스트",
];

export const getRandomNickname = () => {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const noun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomId = Math.floor(Math.random() * 9000) + 1000;
    return `${adj} ${noun}#${randomId}`;
};

/**
 * URL이 이미지인지 더 정확하게 판별합니다.
 */
export const isImageUrl = (url: string) => {
    if (!url) return false;
    const u = url.trim().toLowerCase();

    // 1. Data URI (Base64 이미지) 체크
    if (u.startsWith("data:image/")) return true;

    // 2. URL 파라미터(?v=123 등) 제거 후 순수 확장자만 추출하여 체크
    const pureUrl = u.split("?")[0];
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i;

    const isImg = imageExtensions.test(pureUrl);

    // 개발 중에만 확인하고, 배포 시에는 아래 로그를 지우는 것이 깔끔합니다.
    // console.log("Checking URL:", u, "-> Result:", isImg);

    return isImg;
};
