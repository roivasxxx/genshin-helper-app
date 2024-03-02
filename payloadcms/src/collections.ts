import Events from "./collections/genshin/Events";
import GenshinArtifact from "./collections/genshin/GenshinArtifact";
import GenshinCharacters from "./collections/genshin/GenshinCharacters";
import GenshinCollectableItem from "./collections/genshin/GenshinCollectableItem";
import GenshinDomain from "./collections/genshin/GenshinDomain";
import GenshinDomainDrop from "./collections/genshin/GenshinDomainDrop";
import GenshinElements from "./collections/genshin/GenshinElements";
import GenshinItems from "./collections/genshin/GenshinItem";
import GenshinMob from "./collections/genshin/GenshinMob";
import GenshinMobDrop from "./collections/genshin/GenshinMobDrop";
import GenshinNPC from "./collections/genshin/GenshinNpc";
import GenshinWeaponTypes from "./collections/genshin/GenshinWeaponTypes";
import GenshinWeapons from "./collections/GenshinWeapon";
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
    GenshinMobDrop,
    GenshinCollectableItem,
    GenshinNPC,
    GenshinArtifact,
    Events,
    GenshinWeapons,
    GenshinItems,
];
