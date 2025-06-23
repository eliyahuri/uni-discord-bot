import "./addCommands.service";
import "./events";
import { client } from "./config/client";
import config from "./config/config";
import { format } from "./utils/format";
import logger from "./utils/logger";
import messages from "./utils/messages";

process.on("unhandledRejection", (reason) => {
    logger.error(format(messages.errors.unhandledRejection, { reason }));
});

process.on("uncaughtException", (error) => {
    logger.error(format(messages.errors.uncaughtException, { error }));
});

(async () => {
    try {
        await client.login(config.TOKEN);
    } catch (error) {
        logger.error(format(messages.errors.loginFailed, { error }));
    }
})();
