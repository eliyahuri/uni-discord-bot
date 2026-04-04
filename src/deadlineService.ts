import { readStorageFile, writeStorageFile } from "./storage";

export interface DeadlineRecord {
    id: string;
    guildId: string;
    title: string;
    course: string;
    dueAt: string;
    notes?: string;
    createdBy: string;
    createdAt: string;
}

interface DeadlinesStore {
    deadlines: DeadlineRecord[];
}

const DEADLINES_FILE = "deadlines.json";
const defaultStore: DeadlinesStore = { deadlines: [] };

function normalizeDateString(input: string): string {
    return input.trim().replace(" ", "T");
}

export function parseDeadlineInput(input: string): Date | null {
    const normalized = normalizeDateString(input);
    const parsed = new Date(normalized);
    if (!Number.isNaN(parsed.getTime())) {
        return parsed;
    }

    const match = input.match(
        /^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/,
    );
    if (!match) {
        return null;
    }

    const [, day, month, year, hour = "23", minute = "59"] = match;
    const rebuilt = new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(minute),
    );

    return Number.isNaN(rebuilt.getTime()) ? null : rebuilt;
}

export function formatDeadlineDate(date: Date): string {
    return new Intl.DateTimeFormat("he-IL", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function formatTimeLeft(target: Date): string {
    const diffMs = target.getTime() - Date.now();
    const prefix = diffMs < 0 ? "באיחור של " : "";
    const absoluteMs = Math.abs(diffMs);
    const totalMinutes = Math.floor(absoluteMs / 60000);
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    const parts = [
        days > 0 ? `${days} ימים` : null,
        hours > 0 ? `${hours} שעות` : null,
        minutes > 0 ? `${minutes} דקות` : null,
    ].filter(Boolean);

    return `${prefix}${parts.join(" ") || "פחות מדקה"}`;
}

export async function addDeadline(input: {
    guildId: string;
    title: string;
    course?: string;
    dueAt: Date;
    notes?: string;
    createdBy: string;
}): Promise<DeadlineRecord> {
    const store = await readStorageFile(DEADLINES_FILE, defaultStore);
    const deadline: DeadlineRecord = {
        id: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        guildId: input.guildId,
        title: input.title,
        course: input.course?.trim() || "כללי",
        dueAt: input.dueAt.toISOString(),
        notes: input.notes?.trim(),
        createdBy: input.createdBy,
        createdAt: new Date().toISOString(),
    };

    store.deadlines.push(deadline);
    await writeStorageFile(DEADLINES_FILE, store);

    return deadline;
}

export async function listDeadlines(guildId: string): Promise<DeadlineRecord[]> {
    const store = await readStorageFile(DEADLINES_FILE, defaultStore);
    return store.deadlines
        .filter((deadline) => deadline.guildId === guildId)
        .sort(
            (left, right) =>
                new Date(left.dueAt).getTime() - new Date(right.dueAt).getTime(),
        );
}

export async function getDeadlinePanic(guildId: string) {
    const deadlines = await listDeadlines(guildId);

    return {
        overdue: deadlines.filter(
            (deadline) => new Date(deadline.dueAt).getTime() < Date.now(),
        ),
        upcoming: deadlines.filter(
            (deadline) => new Date(deadline.dueAt).getTime() >= Date.now(),
        ),
    };
}