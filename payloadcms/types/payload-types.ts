/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

export interface Config {
  collections: {
    users: User;
    'public-users': PublicUser;
    'genshin-accounts': GenshinAccount;
    media: Media;
    'genshin-characters': GenshinCharacter;
    'genshin-elements': GenshinElement;
    'genshin-domains': GenshinDomain;
    'genshin-mobs': GenshinMob;
    'genshin-artifacts': GenshinArtifact;
    'genshin-events': GenshinEvent;
    'genshin-weapons': GenshinWeapon;
    'genshin-items': GenshinItem;
    'genshin-wishes': GenshinWish;
    'genshin-articles': GenshinArticle;
    'genshin-patches': GenshinPatch;
    jobs: Job;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
export interface User {
  id: string;
  role?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
export interface PublicUser {
  id: string;
  genshinAccounts?: (string | GenshinAccount)[] | null;
  expoPushToken?: string | null;
  tracking?: {
    items?: (string | GenshinItem)[] | null;
    events?: boolean | null;
    banners?: boolean | null;
  };
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password?: string | null;
}
export interface GenshinAccount {
  id: string;
  region: 'os_euro' | 'os_asia' | 'os_usa' | 'os_cht';
  hoyoId?: string | null;
  wishInfo: {
    standard: {
      pullCount: number;
      last4Star?:
        | ({
            relationTo: 'genshin-weapons';
            value: string | GenshinWeapon;
          } | null)
        | ({
            relationTo: 'genshin-characters';
            value: string | GenshinCharacter;
          } | null);
      last5Star?:
        | ({
            relationTo: 'genshin-weapons';
            value: string | GenshinWeapon;
          } | null)
        | ({
            relationTo: 'genshin-characters';
            value: string | GenshinCharacter;
          } | null);
      pity4Star: number;
      pity5Star: number;
      lastId?: string | null;
    };
    weapon: {
      pullCount: number;
      last4Star?:
        | ({
            relationTo: 'genshin-weapons';
            value: string | GenshinWeapon;
          } | null)
        | ({
            relationTo: 'genshin-characters';
            value: string | GenshinCharacter;
          } | null);
      last5Star?:
        | ({
            relationTo: 'genshin-weapons';
            value: string | GenshinWeapon;
          } | null)
        | ({
            relationTo: 'genshin-characters';
            value: string | GenshinCharacter;
          } | null);
      pity4Star: number;
      pity5Star: number;
      lastId?: string | null;
    };
    character: {
      pullCount: number;
      last4Star?:
        | ({
            relationTo: 'genshin-weapons';
            value: string | GenshinWeapon;
          } | null)
        | ({
            relationTo: 'genshin-characters';
            value: string | GenshinCharacter;
          } | null);
      last5Star?:
        | ({
            relationTo: 'genshin-weapons';
            value: string | GenshinWeapon;
          } | null)
        | ({
            relationTo: 'genshin-characters';
            value: string | GenshinCharacter;
          } | null);
      pity4Star: number;
      pity5Star: number;
      lastId?: string | null;
    };
    lastUpdate?: string | null;
  };
  importJob?: (string | null) | Job;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinWeapon {
  id: string;
  name: string;
  rarity: '3' | '4' | '5';
  icon: string | Media;
  updatedAt: string;
  createdAt: string;
}
export interface Media {
  id: string;
  folder?: string | null;
  addFileNameDate?: boolean | null;
  alt?: string | null;
  name?: string | null;
  type?: string | null;
  mimetype?: string | null;
  cloudinary?: {
    public_id?: string | null;
    original_filename?: string | null;
    format?: string | null;
    secure_url?: string | null;
    resource_type?: string | null;
  };
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
}
export interface GenshinCharacter {
  name: string;
  id: string;
  region?: ('mondstadt' | 'liyue' | 'inazuma' | 'sumeru' | 'fontaine') | null;
  rarity?: ('4' | '5') | null;
  icon: string | Media;
  specialty?: (string | null) | GenshinItem;
  talent?: (string | null) | GenshinItem;
  trounce?: (string | null) | GenshinItem;
  boss?: (string | null) | GenshinItem;
  books?: (string | GenshinItem)[] | null;
  weaponType?: string | null;
  substat?: string | null;
  element?: (string | null) | GenshinElement;
  gem?: (string | null) | GenshinItem;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinItem {
  id: string;
  name?: string | null;
  rarity?: number | null;
  type?:
    | (
        | 'collectable'
        | 'food'
        | 'characterAscension'
        | 'book'
        | 'weaponMat'
        | 'weaponAscensionMaterial'
        | 'expBook'
        | 'expOre'
        | 'fish'
        | 'mobDrop'
        | 'bossDrop'
        | 'trounceDrop'
        | 'gem'
      )
    | null;
  icon?: string | Media | null;
  region?: string | null;
  days?: ('0' | '1' | '2' | '3' | '4' | '5' | '6') | null;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinElement {
  id: string;
  name?: string | null;
  icon: string | Media;
  updatedAt: string;
  createdAt: string;
}
export interface Job {
  id: string;
  status: 'NEW' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';
  genshinAccount: string | GenshinAccount;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinDomain {
  id: string;
  region?: string | null;
  name?: string | null;
  location?: string | null;
  type?: ('artifacts' | 'books' | 'weapons' | 'trounce') | null;
  details?: {
    monday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
    tuesday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
    wednesday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
    thursday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
    friday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
    saturday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
    sunday?: {
      drops?: (string | GenshinItem)[] | null;
      characters?: (string | GenshinCharacter)[] | null;
    };
  };
  updatedAt: string;
  createdAt: string;
}
export interface GenshinMob {
  id: string;
  name?: string | null;
  icon?: string | Media | null;
  location?: string | null;
  type?: ('regular' | 'boss' | 'trouble') | null;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinArtifact {
  id: string;
  name?: string | null;
  icon?: string | Media | null;
  domain: string | GenshinDomain;
  rarity?: ('1' | '2' | '3' | '4' | '5') | null;
  '2pc'?: string | null;
  '4pc'?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinEvent {
  id: string;
  name?: string | null;
  type?: ('banner' | 'event') | null;
  bannerType?: ('weapon' | 'character') | null;
  start?: string | null;
  end?: string | null;
  timezoneDependent?: boolean | null;
  weapons?: {
    fourStar?: (string | GenshinWeapon)[] | null;
    fiveStar?: (string | GenshinWeapon)[] | null;
  };
  characters?: {
    fourStar?: (string | GenshinCharacter)[] | null;
    fiveStar?: (string | GenshinCharacter)[] | null;
  };
  url?: string | null;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinWish {
  id: string;
  bannerType?: ('character' | 'weapon' | 'standard') | null;
  date?: string | null;
  pity?: number | null;
  hoyoId?: string | null;
  genshinAccount?: (string | null) | GenshinAccount;
  itemId?:
    | ({
        relationTo: 'genshin-characters';
        value: string | GenshinCharacter;
      } | null)
    | ({
        relationTo: 'genshin-weapons';
        value: string | GenshinWeapon;
      } | null);
  wishNumber?: number | null;
  rarity?: number | null;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinArticle {
  id: string;
  title?: string | null;
  changes?:
    | {
        date?: string | null;
        description?:
          | {
              [k: string]: unknown;
            }[]
          | null;
        author?: (string | null) | PublicUser;
        id?: string | null;
      }[]
    | null;
  author?: (string | null) | PublicUser;
  type?: 'guide' | null;
  characterId?: (string | null) | GenshinCharacter;
  content?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  comps?:
    | {
        comp?: {
          compName?: string | null;
          description?:
            | {
                [k: string]: unknown;
              }[]
            | null;
          characterIds?: (string | GenshinCharacter)[] | null;
        };
        id?: string | null;
      }[]
    | null;
  weapons?:
    | {
        weapon?: {
          weaponId?: (string | null) | GenshinWeapon;
          description?:
            | {
                [k: string]: unknown;
              }[]
            | null;
        };
        id?: string | null;
      }[]
    | null;
  artifacts?:
    | {
        artifact?: {
          artifactId?: (string | GenshinArtifact)[] | null;
          description?:
            | {
                [k: string]: unknown;
              }[]
            | null;
        };
        id?: string | null;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface GenshinPatch {
  id: string;
  patchNumber?: string | null;
  releaseDate?: string | null;
  changes?:
    | {
        [k: string]: unknown;
      }[]
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadPreference {
  id: string;
  user:
    | {
        relationTo: 'users';
        value: string | User;
      }
    | {
        relationTo: 'public-users';
        value: string | PublicUser;
      };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}