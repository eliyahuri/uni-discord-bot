interface MealOption {
    name: string;
    price: number;
    vibe: string[];
    campusSpot: string;
}

const mealOptions: MealOption[] = [
    {
        name: "טוסט דרמטי",
        price: 18,
        vibe: ["מלוח", "מהיר", "קפה"],
        campusSpot: "הקפיטריה שאיכשהו תמיד יש בה תור",
    },
    {
        name: "בורקס הישרדות",
        price: 12,
        vibe: ["זול", "מהיר", "מלוח"],
        campusSpot: "הקיוסק ליד הבניין שאתה תמיד נשבע לא לחזור אליו",
    },
    {
        name: "מנה עסקית חשודה",
        price: 28,
        vibe: ["משביע", "חם", "אורז"],
        campusSpot: "המקום עם האורז היבש אבל התקווה הלחה",
    },
    {
        name: "פיצה דיקן קלאסית",
        price: 22,
        vibe: ["פיצה", "חברים", "פחמימות"],
        campusSpot: "איפה שיש הכי הרבה סטודנטים שמדחיקים מטלה",
    },
];

const survivalPlans = [
    "טוסט + קפה שחור + חרטא שאתה תלמד היום",
    "בורקס + מים מהברז + תקווה שנשארה לך עוד נוכחות",
    "פיצה קרה + אייס קפה + שקר קטן לעצמך ש'מחר אתחיל מסודר'",
    "חטיף חלבון + קפה + קשר עין קצר עם התהום האקדמית",
];

function pickRandom<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
}

export function chooseMeal(budget?: number, craving?: string) {
    const loweredCraving = craving?.toLowerCase().trim();

    const relevant = mealOptions.filter((meal) => {
        const budgetMatch = budget === undefined || meal.price <= budget;
        const cravingMatch =
            !loweredCraving ||
            meal.name.toLowerCase().includes(loweredCraving) ||
            meal.vibe.some((tag) => tag.toLowerCase().includes(loweredCraving));

        return budgetMatch && cravingMatch;
    });

    const pool = relevant.length > 0 ? relevant : mealOptions;
    const cheapest = [...pool].sort((left, right) => left.price - right.price)[0];
    const chosen = pickRandom(pool);

    return {
        chosen,
        cheapest,
        mealPlan: pickRandom(survivalPlans),
    };
}

export function surviveBudget(amount: number) {
    const affordable = mealOptions.filter((meal) => meal.price <= amount);
    const cheapest = [...mealOptions].sort((left, right) => left.price - right.price)[0];
    const fallback = cheapest ?? mealOptions[0];

    return {
        amount,
        affordable,
        fallback,
        mealPlan: pickRandom(survivalPlans),
    };
}