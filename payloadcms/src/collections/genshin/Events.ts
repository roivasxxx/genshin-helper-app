import { CollectionConfig } from "payload/types";
import characterField from "../../fields/CharacterField";
import weaponField from "../../fields/WeaponField";

const Events: CollectionConfig = {
    slug: "genshin-events",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            // banner, event
            name: "type",
            type: "select",
            options: [
                { label: "Banner", value: "banner" },
                { label: "Event", value: "event" },
            ],
            index: true,
        },
        {
            // banner, event
            name: "bannerType",
            type: "select",
            options: [
                { label: "Weapon", value: "weapon" },
                { label: "Character", value: "character" },
                { label: "Standard", value: "standard" },
            ],
            admin: {
                condition: (data) => {
                    return data?.type === "banner";
                },
            },
            index: true,
        },
        characterField({
            visible: (data) => {
                return (
                    data?.type === "banner" && data?.bannerType === "character"
                );
            },
        }),
        weaponField({
            visible: (data) => {
                return data?.type === "banner" && data?.bannerType === "weapon";
            },
        }),
        {
            name: "start",
            type: "date",
        },
        {
            name: "end",
            type: "date",
            localized: false,
        },
        {
            name: "eventDescription",
            type: "richText",
            admin: {
                condition: (data) => {
                    return data?.type === "event";
                },
            },
        },
        {
            name: "rewards",
            // TODO: create reward field
            type: "text",
            admin: {
                condition: (data) => {
                    return data?.type === "event";
                },
            },
        },
    ],
};

export default Events;
