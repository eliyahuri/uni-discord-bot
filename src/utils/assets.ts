import fs from "fs/promises";
import path from "path";

export interface AssetFile {
    name: string;
    path: string;
}

const assetsRoot = path.resolve(__dirname, "..", "assets");

export async function getAssetFiles(folderName: string): Promise<AssetFile[]> {
    const directoryPath = path.join(assetsRoot, folderName);
    const entries = await fs.readdir(directoryPath, { withFileTypes: true });

    return entries
        .filter((entry) => entry.isFile())
        .map((entry) => ({
            name: entry.name,
            path: path.join(directoryPath, entry.name),
        }));
}