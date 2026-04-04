import { readStorageFile, writeStorageFile } from "./storage";

export type PersonaMode = "chaos" | "balanced" | "gentle" | "off";

interface PersonaStore {
    users: Record<string, PersonaMode>;
}

interface ResponseVariants {
    normal: string;
    funny?: string;
    spicy?: string;
}

const PERSONA_FILE = "persona-preferences.json";
const defaultStore: PersonaStore = { users: {} };

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

export async function getUserPersonaMode(userId: string): Promise<PersonaMode> {
    const store = await readStorageFile(PERSONA_FILE, defaultStore);
    return store.users[userId] ?? "balanced";
}

export async function setUserPersonaMode(
    userId: string,
    mode: PersonaMode,
): Promise<void> {
    const store = await readStorageFile(PERSONA_FILE, defaultStore);
    store.users[userId] = mode;
    await writeStorageFile(PERSONA_FILE, store);
}

export async function formatResponse(
    userId: string,
    variants: ResponseVariants,
): Promise<string> {
    const mode = await getUserPersonaMode(userId);

    if (mode === "off") {
        return variants.normal;
    }

    if (mode === "gentle") {
        return pickRandom([variants.normal, variants.funny ?? variants.normal]);
    }

    if (mode === "balanced") {
        return pickRandom([variants.normal, variants.funny ?? variants.normal]);
    }

    return pickRandom([
        variants.normal,
        variants.funny ?? variants.normal,
        variants.spicy ?? variants.funny ?? variants.normal,
    ]);
}

export async function formatErrorResponse(userId: string): Promise<string> {
    return formatResponse(userId, {
        normal: "זה לא עבד. תנסה שוב בעוד רגע.",
        funny: "זה לא עבד. גם הסמסטר הזה לא עובד חלק, אז יש עקביות.",
        spicy: "זה לא עובד. בדיוק כמו המוטיבציה שלך בסמסטר.",
    });
}

export function getPersonaModeLabel(mode: PersonaMode): string {
    switch (mode) {
        case "chaos":
            return "כאוס מלא";
        case "balanced":
            return "מאוזן";
        case "gentle":
            return "עדין יחסית";
        case "off":
            return "בלי עקיצות";
    }
}