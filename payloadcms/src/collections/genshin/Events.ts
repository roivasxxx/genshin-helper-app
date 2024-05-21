import { CollectionConfig, PayloadRequest } from "payload/types";
import { Response } from "express";
import { relationToDictionary } from "../../utils";
import { RecordWithIcon } from "../../../types/types";

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
        {
            name: "timezoneDependent",
            type: "checkbox",
            defaultValue: false,
        },
        {
            name: "weapons",
            type: "group",
            fields: [
                {
                    name: "fourStar",
                    type: "relationship",
                    relationTo: "genshin-weapons",
                    hasMany: true,
                },
                {
                    name: "fiveStar",
                    type: "relationship",
                    relationTo: "genshin-weapons",
                    hasMany: true,
                },
            ],
        },
        {
            name: "characters",
            type: "group",
            fields: [
                {
                    name: "fourStar",
                    type: "relationship",
                    relationTo: "genshin-characters",
                    hasMany: true,
                },
                {
                    name: "fiveStar",
                    type: "relationship",
                    relationTo: "genshin-characters",
                    hasMany: true,
                },
                {
                    name: "fiveStar1",
                    type: "relationship",
                    relationTo: "genshin-characters",
                },
                {
                    name: "fiveStar2",
                    type: "relationship",
                    relationTo: "genshin-characters",
                },
            ],
        },
        {
            name: "url",
            type: "text",
        },
        {
            name: "version",
            type: "text",
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
    endpoints: [
        {
            path: "/getEventOverview",
            method: "get",
            handler: [
                async (req: PayloadRequest, res: Response) => {
                    const _events = await req.payload.find({
                        collection: "genshin-events",
                        limit: 10,
                        sort: "-start",
                    });
                    const events = _events.docs.map((doc) => {
                        const mappedDoc: {
                            name: string;
                            type: string;
                            timezoneDependent: boolean;
                            start: string;
                            end: string;
                            url: string;
                            bannerType?: string;
                            featured?: {
                                fourStar: (RecordWithIcon | string)[];
                                fiveStar: (RecordWithIcon | string)[];
                            };
                        } = {
                            name: doc.name,
                            type: doc.type,
                            timezoneDependent: doc.timezoneDependent || false,
                            start: doc.start,
                            end: doc.end,
                            url: doc.url,
                        };

                        if (doc.type === "banner") {
                            mappedDoc.bannerType = doc.bannerType;
                            if (doc.bannerType === "weapon") {
                                mappedDoc.featured = {
                                    fourStar:
                                        doc.weapons.fourStar.map(
                                            relationToDictionary
                                        ),
                                    fiveStar:
                                        doc.weapons.fourStar.map(
                                            relationToDictionary
                                        ),
                                };
                            } else if (doc.bannerType === "character") {
                                mappedDoc.featured = {
                                    fourStar:
                                        doc.characters.fourStar.map(
                                            relationToDictionary
                                        ),
                                    fiveStar:
                                        doc.characters.fiveStar.map(
                                            relationToDictionary
                                        ),
                                };
                            }
                        }
                        return mappedDoc;
                    });
                    return res.status(200).send(events);
                },
            ],
        },
    ],
};

export default Events;
