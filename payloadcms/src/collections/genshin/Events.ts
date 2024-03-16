import { CollectionConfig } from "payload/types";
import characterField from "../../fields/CharacterField";
import weaponField from "../../fields/WeaponField";
import { genshinSelectField } from "../../fields/fieldsConfig";

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
                // add resin event - domain - books / leylines
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
        genshinSelectField({
            collection: "genshin-patches",
            fieldName: "patch",
        }),
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
