export const commands = [
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
                    {
                        name: "אינפי 1",
                        value: "option1",
                    },
                    {
                        name: "לוגיקה",
                        value: "option2",
                    },
                    {
                        name: "ליניארית 1",
                        value: "option3",
                    },
                    {
                        name: "חישוב",
                        value: "option4",
                    },
                    {
                        name: "ספרתיות",
                        value: "option5",
                    },
                    {
                        name: "מדעי הנתונים",
                        value: "option6",
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
];
