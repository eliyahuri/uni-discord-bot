import {
    ApplicationCommandOptionType,
    type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

// Add explicit type annotations for Discord application commands
export const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = [
    {
        name: "ping",
        description: "Replies with Pong!",
    },
    {
        name: "representatives",
        description: "מציג את נציגי שנתון",
    },
    {
        name: "help",
        description: "מסביר לך איך לשרוד פה, תיאורטית",
        options: [
            {
                type: ApplicationCommandOptionType.Boolean,
                name: "private",
                description: "האם להציג את העזרה רק לך",
                required: false,
            },
        ],
    },
    {
        name: "pizza",
        description: "legacy פיצה, כי שינוי כואב לכולם",
    },
    {
        name: "food",
        description: "בוחר מה לאכול לפני שתתפרק",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "choose",
                description: "ממליץ על אוכל בהתאם לתקציב ולקרייב",
                options: [
                    {
                        type: ApplicationCommandOptionType.Integer,
                        name: "budget",
                        description: "תקציב בשקלים",
                        required: false,
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "craving",
                        description: "מה בא לך, בערך",
                        required: false,
                    },
                ],
            },
        ],
    },
    {
        name: "budget",
        description: "שורד תקציב סטודנט בלי לקרוס לגמרי",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "survive",
                description: "אומר מה נשאר לך לאכול עם התקציב הזה",
                options: [
                    {
                        type: ApplicationCommandOptionType.Integer,
                        name: "amount",
                        description: "כמה כסף נשאר לך",
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        name: "summary",
        description: "legacy סיכומים. כן, עדיין חי",

        options: [
            {
                type: 3, // STRING type
                name: "option",
                description: "The option to select",
                required: true,
                choices: [
                    { name: "אינפי 1", value: "infi1" },
                    { name: "לוגיקה", value: "booleanAlgebra" },
                    { name: "ליניארית 1", value: "linear1" },
                ],
            },
            {
                type: ApplicationCommandOptionType.String,
                name: "contains",
                description: "סינון קבצים לפי שם",
                required: false,
            },
        ],
    },
    {
        name: "course",
        description: "שואל שאלה על קורס ומקבל תשובה עם attitude",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "ask",
                description: "שואל משהו על קורס ספציפי",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "course",
                        description: "הקורס הרלוונטי",
                        required: true,
                        choices: [
                            { name: "אינפי 1", value: "infi1" },
                            { name: "מערכות ספרתיות", value: "booleanAlgebra" },
                            { name: "ליניארית 1", value: "linear1" },
                        ],
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "question",
                        description: "מה רצית לדעת ולא שאלת עד עכשיו",
                        required: true,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "files",
                description: "מחזיר קבצי סיכום רלוונטיים",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "course",
                        description: "הקורס הרלוונטי",
                        required: true,
                        choices: [
                            { name: "אינפי 1", value: "infi1" },
                            { name: "מערכות ספרתיות", value: "booleanAlgebra" },
                            { name: "ליניארית 1", value: "linear1" },
                        ],
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "contains",
                        description: "סינון לפי שם קובץ",
                        required: false,
                    },
                ],
            },
        ],
    },
    {
        name: "alert",
        description: "מציג התראה",
        options: [
            // the time it will take to send the alert. getting the time as a string that can be either an hour (HH:MM) or 15m for 15 minutes or 1h for 1 hour
            {
                type: 3,
                name: "time",
                description: "זמן של התראה",
                required: true,
            },
            {
                type: 3,
                name: "message",
                description: "הודעה שתוצג בהתראה",
                required: true,
            },
        ],
    },
    {
        name: "ticket",
        description: "פותח צ'אט עם נציגי שנתון",
        options: [
            {
                type: 3,
                name: "message",
                description: "הודעה שתישלח לנציגי שנתון",
                required: true,
            },
        ],
    },
    {
        name: "poll",
        description: "פותח סקר עם יותר מדי מודעות עצמית",
        options: [
            {
                type: 3,
                name: "question",
                description: "שאלה לסקר",
                required: true,
            },
            {
                type: 3,
                name: "answers",
                description: "תשובות לסקר, מופרדות בפסיק",
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Number,
                name: "time",
                description: "זמן של הסקר",
                required: false,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: "multiselect",
                description: "האם ניתן לבחור יותר מתשובה אחת",
                required: false,
            },
        ],
    },
    {
        name: "tal",
        description: "מוציא lore על טל",
    },
    {
        name: "voice",
        description: "נכנס לקול ושופט את שיטות הלמידה שלכם",
    },
    { name: "noam", description: "מוציא lore על נועם" },
    { name: "eliyahu", description: "מוציא lore על אליהו" },
    {
        name: "oracle",
        description: "שואל את האורקל האקדמי הלא יציב",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "question",
                description: "השאלה שאתה מפחד לשאול בן אדם אמיתי",
                required: true,
            },
        ],
    },
    {
        name: "persona",
        description: "שולט ברמת הכאוס שהבוט מפעיל עליך",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "set",
                description: "מגדיר את סגנון הדיבור אליך",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "mode",
                        description: "כמה אמת אתה מסוגל לשמוע",
                        required: true,
                        choices: [
                            { name: "כאוס מלא", value: "chaos" },
                            { name: "מאוזן", value: "balanced" },
                            { name: "עדין יחסית", value: "gentle" },
                            { name: "בלי עקיצות", value: "off" },
                        ],
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "view",
                description: "מראה את ההגדרה הנוכחית שלך",
            },
        ],
    },
    {
        name: "deadline",
        description: "מנהל את חיי האקדמיה המתפוררים שלך",
        options: [
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "add",
                description: "מוסיף דדליין חדש",
                options: [
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "title",
                        description: "שם המטלה או האסון",
                        required: true,
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "due",
                        description: "תאריך בפורמט YYYY-MM-DD HH:MM או DD/MM/YYYY HH:MM",
                        required: true,
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "course",
                        description: "הקורס הרלוונטי",
                        required: false,
                    },
                    {
                        type: ApplicationCommandOptionType.String,
                        name: "notes",
                        description: "עוד פרטים שיגרמו לך להצטער",
                        required: false,
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "list",
                description: "מציג את כל הדדליינים",
            },
            {
                type: ApplicationCommandOptionType.Subcommand,
                name: "panic",
                description: "מודד כמה רע המצב",
            },
        ],
    },
    {
        name: "weather",
        description: "מזג אוויר עם פרשנות סטודנטיאלית מיותרת",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "city",
                description: "שם העיר",
                required: true,
            },
        ],
    },
    {
        name: "monkey",
        description: "מציג תמונה של קוף",
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "count",
                description: "כמה קופים לשלוח (1-4)",
                required: false,
            },
        ],
    },
    {
        name: "roll",
        description: "מטיל קוביה",
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "sides",
                description: "מספר פאות (דיפולטיבי 6)",
                required: false,
            },
            {
                type: ApplicationCommandOptionType.Integer,
                name: "count",
                description: "כמה הטלות לבצע",
                required: false,
            },
        ],
    },
    {
        name: "userinfo",
        description: "מציג מידע על משתמש",
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: "user",
                description: "המשתמש שעליו להציג מידע",
                required: false,
            },
        ],
    },
    {
        name: "serverinfo",
        description: "מציג מידע על השרת",
    },
    {
        name: "avatar",
        description: "מציג אווטאר של משתמש",
        options: [
            {
                type: ApplicationCommandOptionType.User,
                name: "user",
                description: "המשתמש שעבורו יוצג האווטאר",
                required: false,
            },
        ],
    },
    {
        name: "echo",
        description: "מחזיר את הטקסט ששלחת",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "text",
                description: "הטקסט שברצונך שאחזיר",
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Boolean,
                name: "private",
                description: "האם להחזיר רק לך",
                required: false,
            },
        ],
    },
    {
        name: "choose",
        description: "בוחר אופציה אקראית מתוך רשימה",
        options: [
            {
                type: ApplicationCommandOptionType.String,
                name: "options",
                description: "אפשרויות מופרדות בפסיקים",
                required: true,
            },
        ],
    },
    {
        name: "coinflip",
        description: "מטיל מטבע",
    },
    {
        name: "random",
        description: "מגריל מספר בטווח שתבחר",
        options: [
            {
                type: ApplicationCommandOptionType.Integer,
                name: "min",
                description: "המספר המינימלי",
                required: true,
            },
            {
                type: ApplicationCommandOptionType.Integer,
                name: "max",
                description: "המספר המקסימלי",
                required: true,
            },
        ],
    },
    {
        name: "uptime",
        description: "מציג כמה זמן הבוט פעיל",
    },
];
