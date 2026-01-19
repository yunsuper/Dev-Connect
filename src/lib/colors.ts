
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

    let hash = 0;
    for (let i = 0; i < nickname.length; i++) {
        hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
        hash = hash & hash;
    }

    const index = Math.abs(hash) % colors.length;
    return colors[index];
};
