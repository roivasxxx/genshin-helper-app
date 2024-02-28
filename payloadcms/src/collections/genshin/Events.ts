import { CollectionConfig } from "payload/types";
import characterField from "../../fields/CharacterField";

const Events: CollectionConfig = {
    slug: "events",
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
        },
        {
            name: "start",
            type: "date",
        },
        {
            name: "end",
            type: "date",
        },
        {
            name: "eventDescription",
            type: "richText",
            admin: {
                condition: (data) => {
                    return data?.fields?.type === "event";
                },
            },
        },
        {
            name: "rewards",
            // TODO: create reward field
            type: "text",
            admin: {
                condition: (data) => {
                    return data?.fields?.type === "event";
                },
            },
        },
        characterField({}),
        // {
        //     name: "icon",
        //     type: "upload",
        //     relationTo: "media",
        //     required: false,
        // },
    ],
};

export default Events;
