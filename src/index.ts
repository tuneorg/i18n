import Collection from "@discordjs/collection";
import { readdir } from "fs/promises";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import enUS from "./localization/en-US.js";

export type DefaultLang = typeof enUS;
export type LangID = ReturnType<DefaultLang["META_ID"]>;
export class Localization extends Collection<LangID, DefaultLang> {
    public readonly default = enUS;
    public constructor(public langID: LangID) { super(); }

    public async load(): Promise<any> {
        const langsFolderPath = resolve(dirname(fileURLToPath(import.meta.url)), "..", "langs");
        const langsFile = await readdir(langsFolderPath);
        for (const langFile of langsFile) {
            const lang: DefaultLang = await import(resolve(langsFolderPath, langFile));
            this.set(lang.META_ID(), lang);
        }
    }

    public loc(language = this.langID): DefaultLang {
        return this.get(language) ?? this.default;
    }
}
