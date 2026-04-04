import fs from "fs/promises";
import path from "path";
import logger from "./utils/logger";

const storageRoot = path.resolve(process.cwd(), ".bot-data");

async function ensureStorageRoot() {
    await fs.mkdir(storageRoot, { recursive: true });
}

export async function readStorageFile<T>(
    fileName: string,
    fallback: T,
): Promise<T> {
    try {
        await ensureStorageRoot();
        const filePath = path.join(storageRoot, fileName);
        const raw = await fs.readFile(filePath, "utf8");
        return JSON.parse(raw) as T;
    } catch (error: any) {
        if (error?.code !== "ENOENT") {
            logger.warn(error, `Failed reading storage file ${fileName}`);
        }
        await writeStorageFile(fileName, fallback);
        return fallback;
    }
}

export async function writeStorageFile<T>(
    fileName: string,
    data: T,
): Promise<void> {
    await ensureStorageRoot();
    const filePath = path.join(storageRoot, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}