import axios from "axios";
import { EXPO_NOTIFICATION_API, WISH_REGIONS } from "./constants";
import payload from "payload";
import { GenshinItem, PublicUser } from "../types/payload-types";
import { sleep } from "./utils";

require("dotenv").config();

export const notifyUsers = async () => {
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
    const items: GenshinItem[] = [];
    for (const item of user.tracking.items) {
        const day = String(dayIndex) as GenshinItem["days"][number];
        if (
            typeof item === "object" &&
            "days" in item &&
            item.days &&
            item.days.includes(day)
        ) {
            items.push(item);
        }
    }
    if (items.length > 0) {
        await createItemNotifications(user, items);
    }
};

export const createItemNotifications = async (
    user: PublicUser,
    items: GenshinItem[]
) => {
    let emailText = "";
    let emailHTML =
        "<div><h2>These domain items are farmable today!</h2><table><tbody>";
    for (const item of items) {
        let messageBody = `${item.name} - ${
            item.type === "weaponMat"
                ? "Weapon Enhancement Material"
                : "Character Talent Material"
        }`;
        if (item.region) {
            messageBody += ` - ${item.region}`;
        }
        emailText += `${messageBody}\n`;
        emailHTML += "<tr>";
        if (item.icon && typeof item.icon !== "string") {
            emailHTML += `<td style="vertical-align: middle; text-align: left;"><img src="${item.icon.cloudinary.secure_url}" alt="${item.name}" style="width:50px;height:50px"/></td>`;
        }
        emailHTML += `<td style="vertical-align: middle; text-align: left;">${messageBody}</td></tr>`;
    }
    emailHTML += `</tbody></table><a href="https://www.electromains.com"><h2>Electro Mains</h2></a></div>`;
    await payload.sendEmail({
        from: process.env.SERVICE_EMAIL,
        to: user.email,
        subject: "Today's domain items",
        text: emailText,
        html: emailHTML,
    });
};
