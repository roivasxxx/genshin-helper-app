import axios from "axios";
import { EXPO_NOTIFICATION_API, WISH_REGIONS } from "./constants";
import payload from "payload";
import { GenshinItem, PublicUser } from "../types/payload-types";
import { sleep } from "./utils";

export const notifyUsers = async (region: WISH_REGIONS) => {
    try {
        const req = await payload.find({
            collection: "public-users",
            where: {
                and: [
                    {
                        tracking: {
                            exists: true,
                        },
                    },
                    {
                        "tracking.items": {
                            exists: true,
                        },
                    },
                ],
            },
            pagination: false,
        });
        const users = req.docs.filter((user) => user.tracking.items.length > 0);

        for (const user of users) {
            await notifyUser(user);
        }
    } catch (error) {
        console.log("Error while running notifyUsers job: ", error);
    }
};

/**
 * Notify specified user
 * @param user
 */
export const notifyUser = async (user: PublicUser) => {
    // get current day of the week index
    const dayIndex = new Date().getDay();
    console.log("Notifying user: ", user.email);
    for (const item of user.tracking.items) {
        const items: GenshinItem[] = [];
        const day = String(dayIndex) as GenshinItem["days"][number];
        if (
            typeof item === "object" &&
            "days" in item &&
            item.days &&
            item.days.includes(day)
        ) {
            items.push(item);
        }
        if (items.length > 0) {
            await createItemNotifications(user, items);
        }
    }
};

export const createItemNotifications = async (
    user: PublicUser,
    items: GenshinItem[]
) => {
    if (user.expoPushToken) {
        for (const item of items) {
            let messageBody = `${item.name} - ${
                item.type === "weaponMat"
                    ? "Weapon Enhancement Material"
                    : "Character Talent Material"
            }`;
            if (item.region) {
                messageBody += ` - ${item.region}`;
            }
            // sleep for 1 second to avoid rate limiting
            await sleep(1000);
            await sendExpoNotification(
                user.expoPushToken,
                "Today's domain items",
                messageBody
            );
        }
    }

    // implement mailing notifications - one mail, multiple items
};

export const sendExpoNotification = async (
    expoToken: string,
    title: string,
    body: String
) => {
    console.log("Sending expo notification to expoToken: ", expoToken);
    await axios({
        method: "POST",
        url: EXPO_NOTIFICATION_API,
        data: {
            to: expoToken,
            title,
            body,
            priority: "high",
            ttl: 86400,
        },
    });
};

// notifications need to be sent multiple times a day -> for each region (EU, NA, ASIA)
// https://github.com/agenda/agenda?tab=readme-ov-file#repeateveryinterval-options -> set timezone on jobs
