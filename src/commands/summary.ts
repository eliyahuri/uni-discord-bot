import { ChatInputCommandInteraction } from "discord.js";
import { getAssetFiles } from "../utils/assets";
import { format } from "../utils/format";
import messages from "../utils/messages";
import logger from "../utils/logger";
import subjectTranslations from "../utils/translations";

export default async function summary(
    interaction: ChatInputCommandInteraction,
) {
    try {
        await interaction.deferReply();

        const option = interaction.options.getString("option", true);
        const query = interaction.options.getString("contains")?.trim();
        const translatedName = subjectTranslations[option] ?? option;
        const allFiles = await getAssetFiles(option);

        if (allFiles.length === 0) {
            await interaction.editReply(
                format(messages.commands.noFiles, {
                    folderName: translatedName,
                }),
            );
            return;
        }

        const matchingFiles = query
            ? allFiles.filter((file) =>
                  file.name.toLowerCase().includes(query.toLowerCase()),
              )
            : allFiles;

        if (matchingFiles.length === 0) {
            await interaction.editReply(
                format(messages.commands.summaryNoMatches, {
                    folderName: translatedName,
                    query,
                }),
            );
            return;
        }

        if (matchingFiles.length > 10) {
            await interaction.editReply(
                format(messages.commands.summaryTooManyFiles, {
                    folderName: translatedName,
                }),
            );
            return;
        }

        await interaction.editReply({
            content: format(messages.commands.summaryHeader, {
                folderName: translatedName,
            }),
            files: matchingFiles.map((file) => file.path),
        });
    } catch (error: any) {
        logger.error(error, "Error in summary command");

        if (error?.code === "ENOENT") {
            const option = interaction.options.getString("option", true);
            await interaction.editReply(
                format(messages.commands.unknownFolder, {
                    folderName: subjectTranslations[option] ?? option,
                }),
            );
            return;
        }

        await interaction.editReply(messages.errors.errorOccurred);
    }
}
