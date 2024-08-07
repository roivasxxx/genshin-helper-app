"use client";
import { HTTP_METHOD } from "@/types";
import { NotificationItemType } from "@/types/genshinTypes";
import {
    GAMES,
    GAME_ACCOUNT_ID,
    GENSHIN_ACCOUNT_REGIONS,
} from "@/utils/constants";
import cmsRequest from "@/utils/fetchUtils";
import { createDeepCopy } from "@/utils/utils";
import {
    ReactNode,
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from "react";

type BaseAccount = {
    game: GAMES;
};

export type GenshinAccountState = BaseAccount & {
    accounts: {
        id: string;
        region: keyof typeof GENSHIN_ACCOUNT_REGIONS;
        hoyoId?: string;
        game: string;
    }[];
    notifications: {
        events: boolean;
        banners: boolean;
        items: string[];
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

const defaultAccountState: AccountContextState = {
    games: { [GAME_ACCOUNT_ID.GENSHIN]: defaultGenshinState },
    email: "",
    loading: true,
};

const defaultAccountContext: AccountContext = {
    state: { ...defaultAccountState },
    createGenshinAccount: null,
    setNotificationSettings: null,
    saveNotificationSettings: null,
};

type AccountContextState = {
    games: { [GAME_ACCOUNT_ID.GENSHIN]: GenshinAccountState };
    email: string;
    loading: boolean;
};
type AccountContext = {
    state: AccountContextState;
    createGenshinAccount:
        | ((acc: {
              region: keyof typeof GENSHIN_ACCOUNT_REGIONS;
              hoyoId: string;
          }) => Promise<string>)
        | null;
    setNotificationSettings:
        | (<T extends keyof GenshinAccountState["notifications"]>(
              key: T,
              value: GenshinAccountState["notifications"][T]
          ) => Promise<void>)
        | null;
    saveNotificationSettings: (() => Promise<boolean>) | null;
};

const AccountContext = createContext<AccountContext>(defaultAccountContext);

export const useAccount = () => useContext(AccountContext);

export default function AccountProvider(props: { children: ReactNode }) {
    const [account, setAccount] =
        useState<AccountContextState>(defaultAccountState);

    const getAccountData = useCallback(async () => {
        const _account: AccountContextState =
            createDeepCopy(defaultAccountState);
        setAccount({ ...account, loading: true });
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
                    _account.games.genshin.accounts =
                        data.user.genshinAccounts.map((el: any) => ({
                            id: el.id,
                            region: el.region || "",
                            hoyoId: el.hoyo_id || "",
                            game: "genshin",
                        }));
                }
                // and their notification settings
                if (data.user.tracking) {
                    _account.games.genshin.notifications = {
                        ...data.user.tracking,
                        items: data.user.tracking.items
                            ? data.user.tracking.items.map((el: any) => {
                                  return el.id;
                              })
                            : [],
                    };
                }
            }
        } catch (error) {
            console.error("Error getting account data", error);
        }
        setAccount({ ..._account, loading: false });
    }, []);

    const createGenshinAccount = useCallback(
        async (acc: {
            region: keyof typeof GENSHIN_ACCOUNT_REGIONS;
            hoyoId: string;
        }) => {
            try {
                const response = await cmsRequest({
                    path: "/api/genshin-accounts/create-genshin-account",
                    method: HTTP_METHOD.POST,
                    body: acc,
                });
                const data = await response.json();
                if (data.accountId) {
                    await getAccountData();
                    return data.accountId as string;
                }
            } catch (error) {
                console.error("Error creating genshin account", error);
            }
            return "";
        },
        []
    );

    const setNotificationSettings = useCallback(
        async <T extends keyof GenshinAccountState["notifications"]>(
            key: T,
            value: GenshinAccountState["notifications"][T]
        ) => {
            const _account: AccountContextState = createDeepCopy(account);
            _account.games.genshin.notifications[key] = value;
            setAccount({ ..._account });
        },
        []
    );

    const saveNotificationSettings = useCallback(async () => {
        try {
            await cmsRequest({
                path: "api/public-users/setNotificationSettings",
                method: HTTP_METHOD.POST,
                body: {
                    ...account.games.genshin.notifications,
                },
            });
            return true;
        } catch (error) {
            console.error("Error saving notification settings", error);
        }
        return false;
    }, []);

    useEffect(() => {
        getAccountData();
        return () => {};
    }, []);

    return (
        <AccountContext.Provider
            value={{
                state: account,
                createGenshinAccount,
                setNotificationSettings,
                saveNotificationSettings,
            }}
        >
            {props.children}
        </AccountContext.Provider>
    );
}
