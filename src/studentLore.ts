const lore: Record<string, string[]> = {
    tal: [
        "טל: supposedly לומד. לא הוכח מדעית.",
        "טל: תמיד נשמע כאילו הוא יודע מה קורה. זו אשליה שימושית.",
        "טל: מופיע בדיוק כשצריך תשובה, ונעלם כשצריך להגיש משהו.",
    ],
    noam: [
        "נועם: מדבר בביטחון גם כשכולנו אבודים. מנהיגות או הזיה, טרם הוכרע.",
        "נועם: כנראה מבין את החומר, אבל נהנה לראות אותך מגלה את זה מאוחר.",
        "נועם: מסוגל לענות מהר מדי. חשוד.",
    ],
    eliyahu: [
        "אליהו: supposedly לומד. לא הוכח מדעית.",
        "אליהו: בנה בוט במקום לנוח. זה מסביר די הרבה.",
        "אליהו: חי על קפה, קוד, והחלטות מפוקפקות בשתיים בלילה.",
    ],
};

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

export function getLore(person: keyof typeof lore) {
    return pickRandom(lore[person]);
}