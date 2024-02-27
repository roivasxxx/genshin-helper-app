import { CollectionConfig } from "payload/types";

const GenshinDomainItem: CollectionConfig = {
    slug: "genshin-domain-items",
    fields: [
        {
            name: "name",
            type: "text",
        },
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: false,
        },
        {
            // item type
            // book, weapon
            name: "type",
            type: "select",
            options: [
                {
                    label: "Book",
                    value: "book",
                },
                {
                    label: "Weapon",
                    value: "weapon",
                },
            ],
            required: true,
        },
        {
            name: "domain",
            type: "relationship",
            relationTo: "genshin-domains",
            required: true,
        },
        {
            // dropped on
            // hidden for artifacts and trounce domains
            name: "droppedOn",
            type: "select",
            defaultValue: ["7"],
            hasMany: true,
            options: [
                {
                    label: "Monday",
                    value: "1",
                },
                {
                    label: "Tuesday",
                    value: "2",
                },
                {
                    label: "Wednesday",
                    value: "3",
                },
                {
                    label: "Thursday",
                    value: "4",
                },
                {
                    label: "Friday",
                    value: "5",
                },
                {
                    label: "Saturday",
                    value: "6",
                },
                {
                    label: "Sunday",
                    value: "7",
                },
            ],
        },
    ],
};

export default GenshinDomainItem;
