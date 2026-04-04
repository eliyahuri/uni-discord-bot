import { getAssetFiles, type AssetFile } from "./utils/assets";
import subjectTranslations from "./utils/translations";

export interface CourseAnswer {
    courseName: string;
    shortAnswer: string;
    references: AssetFile[];
    examTip: string;
}

const keywordHints: Record<string, Array<{ keywords: string[]; answer: string }>> = {
    infi1: [
        {
            keywords: ["גבול", "רציפות", "סדרה", "נגזרת", "אינטגרל"],
            answer:
                "זה נשמע כמו נושא קלאסי של אינפי: תזהה קודם הגדרות, אחר כך תעשה מעבר מסודר בין משפטים, ורק אז אלגברה. אחרת אתה פשוט מצייר טרגדיה עם סימנים.",
        },
    ],
    booleanAlgebra: [
        {
            keywords: ["שער", "לוגיקה", "בוליאני", "מפה", "קרנו", "נור"],
            answer:
                "במערכות ספרתיות רוב הסיכוי שאתה צריך או פישוט ביטוי, או להבין ייצוג של מעגל. אם קפצת ישר לתשובה בלי טבלת אמת, אתה שוב חי מסוכן.",
        },
    ],
    linear1: [
        {
            keywords: ["מטריצה", "דרגה", "וקטור", "בסיס", "ליניארית", "דטרמיננטה"],
            answer:
                "בליניארית בדרך כלל נופלים על לבדוק תלות, בסיס או פעולות שורה. אם אתה לא כותב מה המרחב ומה המטרה, אתה בעיקר מאלתר באלגנטיות.",
        },
    ],
};

const examTips: Record<string, string[]> = {
    infi1: [
        "אם זה נראה קצר מדי, כנראה שכחת להצדיק משהו. אינפי אוהב כאב עם הוכחה.",
        "אם מופיע גבול, תבדוק קודם מה קורה כשאתה מפסיק להילחץ לשתי שניות.",
    ],
    booleanAlgebra: [
        "תכתוב טבלת אמת לפני שאתה ממציא מעגל מהלב. הלב שלך לא מהדר חומרה.",
        "אם יש מפות קרנו, תסמן קבוצות גדולות קודם. כן, גם אם זה מכוער.",
    ],
    linear1: [
        "במבחן זה בדרך כלל שאלה 4 או 5 שמתחזה לידידותית ואז גובה ממך שכר לימוד רגשי.",
        "תפעיל פעולות שורה כמו בן אדם, לא כמו מי שלחץ submit מתוך ייאוש.",
    ],
    default: [
        "אם אתה לא יודע מאיפה להתחיל, תתחיל מהגדרות. זה משעמם, ולכן זה בדרך כלל נכון.",
        "תפתור מסודר. לפאניקה יש handwriting נוראי.",
    ],
};

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

function tokenize(input: string): string[] {
    return input
        .toLowerCase()
        .split(/[^a-zA-Zא-ת0-9]+/)
        .map((token) => token.trim())
        .filter((token) => token.length >= 2);
}

function scoreFile(file: AssetFile, tokens: string[]): number {
    const name = file.name.toLowerCase();
    return tokens.reduce((score, token) => {
        if (name.includes(token)) {
            return score + 3;
        }

        const tokenNumber = Number(token);
        if (!Number.isNaN(tokenNumber) && name.includes(String(tokenNumber))) {
            return score + 2;
        }

        return score;
    }, 0);
}

function getHeuristicAnswer(course: string, question: string): string {
    const hints = keywordHints[course] ?? [];
    const loweredQuestion = question.toLowerCase();
    const matchedHint = hints.find((hint) =>
        hint.keywords.some((keyword) => loweredQuestion.includes(keyword.toLowerCase())),
    );

    if (matchedHint) {
        return matchedHint.answer;
    }

    return "מהשאלה שלך זה נראה כמו משהו שכדאי למקם לפי הרצאה או תרגול, ואז לפתוח את הסיכום הכי קרוב לנושא. כן, זה אומר לקרוא. טרגדיה אמיתית.";
}

export async function getCourseFiles(course: string, query?: string) {
    const files = await getAssetFiles(course);
    const normalizedQuery = query?.trim().toLowerCase();

    if (!normalizedQuery) {
        return files;
    }

    return files.filter((file) => file.name.toLowerCase().includes(normalizedQuery));
}

export async function answerCourseQuestion(
    course: string,
    question: string,
): Promise<CourseAnswer> {
    const courseName = subjectTranslations[course] ?? course;
    const files = await getAssetFiles(course);
    const tokens = tokenize(question);
    const references = [...files]
        .sort((left, right) => scoreFile(right, tokens) - scoreFile(left, tokens))
        .slice(0, 3);

    const referenceLead = references[0]?.name;
    const shortAnswer = referenceLead
        ? `לפי החומר המקומי של ${courseName}, הייתי מתחיל מ-${referenceLead}. ${getHeuristicAnswer(course, question)}`
        : `אין לי כרגע קבצים זמינים ל-${courseName}, אז התשובה הכנה היא שכרגע גם אני לומד על החיים בדרך הקשה.`;

    return {
        courseName,
        shortAnswer,
        references,
        examTip: pickRandom(examTips[course] ?? examTips.default),
    };
}