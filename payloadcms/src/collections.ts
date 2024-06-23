import { CollectionConfig } from "payload/types";
// users, media, misc.
import Users from "./collections/Users";
import PublicUsers from "./collections/PublicUsers";
import { Media } from "./collections/Media";
import Releases from "./collections/Release";
import Jobs from "./collections/genshin/Jobs";

//genshin related collections
import GenshinAccounts from "./collections/genshin/GenshinAccounts";
import GenshinElements from "./collections/genshin/GenshinElements";
import GenshinWeapons from "./collections/genshin/GenshinWeapon";
import GenshinCharacters from "./collections/genshin/GenshinCharacters";
import Events from "./collections/genshin/Events";
import GenshinWishes from "./collections/genshin/GenshinWishes";
import GenshinItems from "./collections/genshin/GenshinItem";
import GenshinMob from "./collections/genshin/GenshinMob";
import GenshinDomain from "./collections/genshin/GenshinDomain";
import GenshinArtifact from "./collections/genshin/GenshinArtifact";
import GenshinArticles from "./collections/genshin/GenshinArticles";

export const collections: CollectionConfig[] = [
    Users,
    PublicUsers,
    GenshinAccounts,
    Media,
    GenshinCharacters,
    GenshinElements,
    GenshinDomain,
    GenshinMob,
    GenshinArtifact,
    Events,
    GenshinWeapons,
    GenshinItems,
    GenshinWishes,
    GenshinArticles,
    Jobs,
    Releases,
];
