/**
 * 닉네임을 기반으로 고유한 Tailwind 텍스트 색상 클래스를 반환합니다.
 */
export const getUserColorClass = (nickname: string) => {
    const colors = [
        "text-blue-400",
        "text-purple-400",
        "text-pink-400",
        "text-amber-400",
        "text-cyan-400",
        "text-indigo-400",
        "text-rose-400",
        "text-orange-400",
        "text-teal-400",
        "text-lime-400",
        "text-fuchsia-400",
        "text-sky-400",
        "text-violet-400",
    ];

    // 2. 문자열 해싱 로직 (비트 연산을 활용해 고르게 분산)
    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
        // bitwise 연산으로 더 고른 인덱스 분포를 유도합니다.
        hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash; // Convert to 32bit integer
    }

    // 3. 인덱스 결정
    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
