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
            ],
            admin: {
                condition: (data) => {
                    return data?.type === "banner";
                },
            },
            index: true,
        },
        {
            name: "start",
            type: "text",
            // format yyyy-mm-dd hh:mm:ss
        },
        {
            name: "end",
            type: "text",
            // format yyyy-mm-dd hh:mm:ss
        },
        // characterField({
        //     visible: (data) => {
        //         return (
        //             data?.type === "banner" && data?.bannerType === "character"
        //         );
        //     },
        // }),
        // weaponField({
        //     visible: (data) => {
        //         return data?.type === "banner" && data?.bannerType === "weapon";
        //     },
        // }),

        // genshinSelectField({
        //     collection: "genshin-patches",
        //     fieldName: "patch",
        // }),
        // {
        //     name: "eventDescription",
        //     type: "richText",
        //     admin: {
        //         condition: (data) => {
        //             return data?.type === "event";
        //         },
        //     },
        // },
    ],
};

export default Events;
