import { ChatInputCommandInteraction } from "discord.js";
import axios from "axios";
import { format } from "../utils/format";
import logger from "../utils/logger";
import messages from "../utils/messages";

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
            format(messages.commands.weatherReport, {
                city: result.name,
                temperature,
                condition,
            }),
        );
    } catch (error) {
        logger.error(error, "Error in weather command");
        await interaction.reply(messages.commands.weatherError);
    }
}
