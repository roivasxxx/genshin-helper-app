import { GenshinAccount } from "./payload-types";

export type GenshinAcountWishInfo = {
    character: GenshinAccount["wishInfo"]["character"];
    weapon: GenshinAccount["wishInfo"]["weapon"];
    standard: GenshinAccount["wishInfo"]["standard"];
};
