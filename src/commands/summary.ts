import { ChatInputCommandInteraction } from "discord.js";

export default async function summary(
    interaction: ChatInputCommandInteraction,
) {
    const option = interaction.options.getString("option", true);
    let reply = "";
    switch (option) {
        case "infi1":
            reply = "סיכום אינפי 1: [קבצים זמינים בתיקיית assets/infi1]";
            break;
        case "booleanAlgebra":
            reply =
                "סיכום לוגיקה: [קבצים זמינים בתיקיית assets/booleanAlgebra]";
            break;
        case "linear1":
            reply = "סיכום ליניארית 1: [קבצים זמינים בתיקיית assets/linear1]";
            break;
        default:
            reply = "לא נמצא סיכום עבור הבחירה שלך.";
    }
    await interaction.reply(reply);
}
