import { CollectionConfig } from "payload/types";
import { genshinItemConfig } from "../../fields/fieldsConfig";

const GenshinArticles: CollectionConfig = {
    slug: "genshin-articles",
    fields: [
        {
            name: "title",
            type: "text",
        },
        {
            name: "creationDate",
            type: "date",
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
        {
            name: "content",
            type: "richText",
        },
        genshinItemConfig({
            fieldName: "characterId",
            collection: "genshin-characters",
        }),
    ],
};

export default GenshinArticles;
