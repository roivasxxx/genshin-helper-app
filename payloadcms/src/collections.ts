import GenshinArtifact from "./collections/genshin/GenshinArtifact";
import GenshinCharacters from "./collections/genshin/GenshinCharacters";
import GenshinCollectableItem from "./collections/genshin/GenshinCollectableItem";
import GenshinDomain from "./collections/genshin/GenshinDomain";
import GenshinDomainDrop from "./collections/genshin/GenshinDomainDrop";
import GenshinElements from "./collections/genshin/GenshinElements";
import GenshinMob from "./collections/genshin/GenshinMob";
import GenshinNPC from "./collections/genshin/GenshinNpc";
import GenshinWeaponTypes from "./collections/genshin/GenshinWeaponTypes";
import { Media } from "./collections/Media";
import PublicUsers from "./collections/PublicUsers";
import Users from "./collections/Users";

export const collections = [
    Users,
    PublicUsers,
    Media,
    GenshinCharacters,
    GenshinElements,
    GenshinWeaponTypes,
    GenshinDomain,
    GenshinDomainDrop,
    GenshinMob,
    GenshinCollectableItem,
    GenshinNPC,
    GenshinArtifact,
];
