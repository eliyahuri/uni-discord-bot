import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";

// Add explicit type annotations for Discord application commands
export const commands: RESTPostAPIApplicationCommandsJSONBody[] = [
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
                type: 10,
                name: "time",
                description: "זמן של הסקר",
                required: false,
            },
            {
                type: 5,
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
                type: 3,
                name: "city",
                description: "שם העיר",
                required: true,
            },
        ],
    },
    {
        name: "monkey",
        description: "מציג תמונה של קוף",
    },
    {
        name: "roll",
        description: "מטיל קוביה",
        options: [
            {
                type: 4,
                name: "sides",
                description: "מספר פאות (דיפולטיבי 6)",
                required: false,
            },
        ],
    },
];
