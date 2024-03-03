import { CollectionConfig } from "payload/types";
import { genshinItemConfig } from "../../fields/fieldsConfig";

const isGuide = (data) => {
    return data.type === "guide";
};

const GenshinArticles: CollectionConfig = {
    slug: "genshin-articles",
    fields: [
        {
            name: "title",
            type: "text",
        },
        {
            // changelog
            name: "changes",
            type: "array",
            fields: [
                {
                    name: "date",
                    type: "date",
                },
                {
                    name: "description",
                    type: "richText",
                },
                {
                    name: "author",
                    type: "relationship",
                    relationTo: "public-users",
                    defaultValue: ({ user }) => {
                        return user?.id || user?.uuid;
                    },
                    hidden: true,
                },
            ],
            defaultValue: [],
        },
        {
            name: "author",
            type: "relationship",
            relationTo: "public-users",
            defaultValue: ({ user }) => {
                return user?.id || user?.uuid;
            },
            hidden: true,
        },
        {
            // for new possible article types
            name: "type",
            type: "select",
            options: [
                {
                    label: "Guide",
                    value: "guide",
                },
            ],
            defaultValue: "guide",
            // hidden since it only has one option at this moment
            hidden: true,
        },
        genshinItemConfig({
            fieldName: "characterId",
            collection: "genshin-characters",
            visible: isGuide,
        }),
        {
            name: "content",
            type: "richText",
        },
        {
            name: "comps",
            type: "array",
            fields: [
                {
                    name: "comp",
                    type: "group",
                    fields: [
                        {
                            name: "compName",
                            type: "text",
                        },
                        {
                            name: "description",
                            type: "richText",
                        },
                        genshinItemConfig({
                            fieldName: "characterIds",
                            collection: "genshin-characters",
                            max: 3,
                        }),
                        // when the comp can have a character of flex element
                        // for example any anemo character in a comp for vv, or any dendro character etc..
                        // genshinItemConfig({
                        //     fieldName: "flexElements",
                        //     collection: "genshin-elements",
                        //     visible: (_, siblingData) => {
                        //         return (
                        //             siblingData.characterIds &&
                        //             siblingData.characterIds.length < 3
                        //         );
                        //     },
                        // }),
                    ],
                },
            ],
            admin: {
                condition: (data) => {
                    return isGuide(data) && data.characterId;
                },
            },
        },
        {
            name: "weapons",
            type: "array",
            fields: [
                {
                    name: "weapon",
                    type: "group",
                    fields: [
                        genshinItemConfig({
                            fieldName: "weaponId",
                            collection: "genshin-weapons",
                        }),
                        {
                            name: "description",
                            type: "richText",
                        },
                    ],
                },
            ],
            admin: {
                condition: isGuide,
            },
        },
        {
            name: "artifacts",
            type: "array",
            fields: [
                {
                    name: "artifact",
                    type: "group",
                    fields: [
                        genshinItemConfig({
                            fieldName: "artifactId",
                            collection: "genshin-artifacts",
                            // for combinations of 2/2
                            max: 2,
                        }),
                        {
                            name: "description",
                            type: "richText",
                        },
                    ],
                },
            ],
            admin: {
                condition: isGuide,
            },
        },
    ],
};

export default GenshinArticles;
