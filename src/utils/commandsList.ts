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
        description: "מציג את רשימת הפקודות",
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
        description: "מזכיר לכולם לבוא לפיצה",
    },
    {
        name: "summary",
        description: "מציג סיכום של השיעור",

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
        description: "פותח סקר",
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
        description: "מספים את טל",
    },
    {
        name: "voice",
        description: "מצטרף לחדר קולי",
    },
    { name: "noam", description: "מספים את נועם" },
    { name: "eliyahu", description: "מספים את אליהו" },
    {
        name: "weather",
        description: "מציג את מזג האוויר במקום מסוים",
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
