import Collection from "@discordjs/collection";
import { readdir } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import enUS from "./localization/en-US.js";

export type LangObject = typeof enUS;
export type LangIdentifier = ReturnType<LangObject["META_IDENTIFIER"]>;
export class Localization extends Collection<LangIdentifier, LangObject> {
    public readonly default = enUS;
    public constructor(public langIdentifier: LangIdentifier) { super(); }

    public async load(): Promise<any> {
        const langsFolderPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "langs");
        const langsFile = await readdir(langsFolderPath);
        for (const langFile of langsFile) {
            const lang: LangObject = await import(resolve(langsFolderPath, langFile));
            this.set(lang.META_IDENTIFIER(), lang);
        }
    }

    public loc(language = this.langIdentifier): LangObject {
        return this.get(language) ?? this.default;
    }
}
