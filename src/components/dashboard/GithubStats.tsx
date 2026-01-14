"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { fetchGithubEvents, fetchGithubRepos } from "@/lib/github";
import { Star, Activity, Github } from "lucide-react";

// ✅ any 에러 해결을 위한 타입 정의
interface GithubEvent {
    type: string;
    repo: { name: string };
}

interface GithubRepo {
    name: string;
    stargazers_count: number;
    language: string;
}

export default function GithubStats() {
    const [events, setEvents] = useState<GithubEvent[]>([]);
    const [repos, setRepos] = useState<GithubRepo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadGithubData = async () => {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            const username =
                user?.user_metadata?.user_name ||
                user?.user_metadata?.full_name;

            if (username) {
                const [eventData, repoData] = await Promise.all([
                    fetchGithubEvents(username),
                    fetchGithubRepos(),
                ]);

                if (eventData) setEvents(eventData.slice(0, 5));
                if (repoData) setRepos(repoData.slice(0, 3));
            }
            setLoading(false);
        };

        loadGithubData();
    }, []);

    if (loading)
        return (
            <div className="flex items-center justify-center h-full text-zinc-600 font-mono text-[10px] animate-pulse">
                CONNECTING_GITHUB_API...
            </div>
        );

    return (
        <div className="grid grid-cols-2 gap-4 h-full p-2">
            <div className="flex flex-col space-y-2 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                    <Activity size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Recent_Events
                    </span>
                </div>
                <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar pr-1">
                    {events.length > 0 ? (
                        events.map((event, i) => (
                            <div
                                key={i}
                                className="text-[10px] font-mono p-2 bg-zinc-900/30 border border-zinc-800/30 rounded-lg"
                            >
                                <span className="text-emerald-500/70">
                                    {event.type.replace("Event", "")}
                                </span>
                                <p className="text-zinc-500 truncate">
                                    {event.repo.name.split("/")[1]}
                                </p>
                            </div>
                        ))
                    ) : (
                        <div className="text-[10px] text-zinc-700">
                            NO_EVENTS_FOUND
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col space-y-2 overflow-hidden">
                <div className="flex items-center gap-2 mb-1">
                    <Star size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        Active_Repos
                    </span>
                </div>
                <div className="flex-1 space-y-1">
                    {repos.length > 0 ? (
                        repos.map((repo, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-2 bg-black/20 border border-zinc-800/30 rounded-lg group"
                            >
                                <div className="flex flex-col gap-0.5 overflow-hidden">
                                    <span className="text-[10px] font-mono text-zinc-300 truncate">
                                        {repo.name}
                                    </span>
                                    <div className="flex items-center gap-2 text-[8px] text-zinc-600">
                                        <span className="flex items-center gap-1">
                                            <Star size={8} />{" "}
                                            {repo.stargazers_count}
                                        </span>
                                        <span className="w-1 h-1 bg-emerald-500/40 rounded-full" />
                                        <span>{repo.language || "Code"}</span>
                                    </div>
                                </div>
                                <Github
                                    size={14}
                                    className="text-zinc-800 group-hover:text-emerald-500/50 transition-colors"
                                />
                            </div>
                        ))
                    ) : (
                        <div className="text-[10px] text-zinc-700">
                            NO_REPOS_FOUND
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
