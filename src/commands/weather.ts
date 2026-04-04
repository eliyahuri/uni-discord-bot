import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";
import { format } from "../utils/format";
import logger from "../utils/logger";
import messages from "../utils/messages";
import { formatErrorResponse } from "../responseFormatter";

function getStudentInterpretation(temperature: number) {
    if (temperature >= 32) {
        return "חם מדי ללמוד, קר מדי לא להרגיש אשם.";
    }

    if (temperature >= 26) {
        return "מזג אוויר קלאסי לדחות למידה ולקרוא לזה self care.";
    }

    if (temperature >= 18) {
        return "סביר. אין לך תירוץ טוב לא לפתוח את המחברת, וזה חבל מאוד.";
    }

    return "קר מספיק כדי להרגיש אינטלקטואלי, ועדיין לא מספיק כדי לשפר ציון.";
}

export default async function weather(
    interaction: ChatInputCommandInteraction,
) {
    try {
        const city = interaction.options.getString("city", true);

        const geoResponse = await axios.get(
            "https://geocoding-api.open-meteo.com/v1/search",
            {
                params: {
                    name: city,
                    count: 1,
                    country: "IL",
                    format: "json",
                },
            },
        );

        const result = geoResponse.data.results?.[0];
        if (!result) {
            await interaction.reply({
                content: format(messages.commands.cityNotFound, { city }),
                ephemeral: true,
            });
            return;
        }

        const weatherResponse = await axios.get(
            "https://api.open-meteo.com/v1/forecast",
            {
                params: {
                    latitude: result.latitude,
                    longitude: result.longitude,
                    current: "temperature_2m,weather_code",
                },
            },
        );

        const temperature = weatherResponse.data.current?.temperature_2m;
        const weatherCode = weatherResponse.data.current?.weather_code;
        const descriptions = messages.weatherDescriptions as Record<number, string>;
        const condition =
            descriptions[weatherCode] ?? messages.commands.unknownWeather;

        await interaction.reply(
            `${format(messages.commands.weatherReport, {
                city: result.name,
                temperature,
                condition,
            })}\nפרשנות סטודנט: ${getStudentInterpretation(temperature)}`,
        );
    } catch (error) {
        logger.error(error, "Error in weather command");
        await interaction.reply(await formatErrorResponse(interaction.user.id));
    }
}
