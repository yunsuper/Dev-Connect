// src/lib/github.ts
import { supabase } from "./supabase";

export const getGithubToken = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error || !data.session) return null;
    return data.session.provider_token;
};

export const fetchGithubEvents = async (username: string) => {
    const token = await getGithubToken();
    if (!token) return null;
    const response = await fetch(
        `https://api.github.com/users/${username}/events`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.ok ? await response.json() : null;
};

export const fetchGithubRepos = async () => {
    const token = await getGithubToken();
    if (!token) return null;
    const response = await fetch(
        "https://api.github.com/user/repos?sort=updated&per_page=5",
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.ok ? await response.json() : null;
};
