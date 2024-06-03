"use client";
import { HTTP_METHOD } from "@/types";
import { NotificationItemType } from "@/types/apiResponses";
import { GAMES, GAME_ACCOUNT_ID } from "@/utils/constants";
import cmsRequest from "@/utils/fetchUtils";
import { createDeepCopy } from "@/utils/utils";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

type BaseAccount = {
    accounts: any[];
    game: GAMES;
};

type GenshinAccountState = BaseAccount & {
    notifications: {
        events: boolean;
        banners: boolean;
        items: NotificationItemType[];
    };
};

const defaultGenshinState: GenshinAccountState = {
    accounts: [],
    notifications: {
        events: false,
        banners: false,
        items: [],
    },
    game: GAMES.GENSHIN,
};

export type GameAccountState = GenshinAccountState; // | StarRailAccountState | ZenAccountState;

const defaultAccountState: Account = {
    games: { [GAME_ACCOUNT_ID.GENSHIN]: defaultGenshinState },
    email: "",
    loading: true,
};

type Account = {
    games: { [GAME_ACCOUNT_ID.GENSHIN]: GenshinAccountState };
    email: string;
    loading: boolean;
};

const AccountContext = createContext<Account>(defaultAccountState);

export const useAccount = () => useContext(AccountContext);

export default function AccountProvider(props: { children: ReactNode }) {
    const [account, setAccount] = useState<Account>(defaultAccountState);

    async function getAccountData() {
        const _account = createDeepCopy(defaultAccountState);
        try {
            const res = await cmsRequest({
                path: "api/public-users/me",
                method: HTTP_METHOD.GET,
            });
            const data = await res.json();
            if (data && data.user) {
                _account.email = data.user.email;

                if (
                    data.user.genshinAccounts &&
                    Array.isArray(data.user.genshinAccounts) &&
                    data.user.genshinAccounts.length > 0
                ) {
                    // we only really care about the user's genshin accounts
                    _account.genshin.genshinAccounts =
                        data.user.genshinAccounts.map((el: any) => ({
                            id: el.id,
                            region: el.region || "",
                            hoyoId: el.hoyo_id || "",
                            game: "genshin",
                        }));
                }
                // and their notification settings
                if (data.user.tracking) {
                    _account.genshin.notifications = {
                        ...data.user.tracking,
                        items: data.user.tracking.items
                            ? data.user.tracking.items.map((el: any) => {
                                  return {
                                      name: el.name,
                                      id: el.id,
                                      icon: el.icon.cloudinary.secure_url,
                                      days: el.days,
                                  };
                              })
                            : [],
                    };
                }
            }
        } catch (error) {
            console.error("Error getting account data", error);
        }
        setAccount({ ..._account, loading: false });
    }

    useEffect(() => {
        getAccountData();
    }, []);

    return (
        <AccountContext.Provider
            value={{
                ...account,
            }}
        >
            {props.children}
        </AccountContext.Provider>
    );
}
