import { CollectionConfig, PayloadRequest } from "payload/types";
import { Response } from "express";
import { getIcon, relationToDictionary } from "../../utils";
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
                },
                {
                    name: "fiveStar1",
                    type: "relationship",
                    relationTo: "genshin-weapons",
                },
                {
                    name: "fiveStar2",
                    type: "relationship",
                    relationTo: "genshin-weapons",
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
        {
            name: "icon",
            type: "upload",
            relationTo: "media",
            required: false,
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
                            url?: string;
                            bannerType?: string;
                            characters?: {
                                fiveStar1: RecordWithIcon;
                                fiveStar2?: RecordWithIcon;
                                fourStar: RecordWithIcon[];
                            };
                            weapons?: {
                                fiveStar1: RecordWithIcon;
                                fiveStar2?: RecordWithIcon;
                                fourStar: RecordWithIcon[];
                            };
                            icon?: string;
                        } = {
                            name: doc.name,
                            type: doc.type,
                            timezoneDependent: doc.timezoneDependent || false,
                            start: doc.start,
                            end: doc.end,
                            url: doc?.url || "",
                        };

                        if (doc.type === "event") {
                            mappedDoc.icon = getIcon(doc);
                        }

                        if (doc.type === "banner") {
                            mappedDoc.bannerType = doc.bannerType;
                            if (doc.bannerType === "weapon" && doc.weapons) {
                                mappedDoc.weapons = {
                                    fiveStar1: relationToDictionary(
                                        doc.weapons.fiveStar1
                                    ),
                                    fiveStar2: relationToDictionary(
                                        doc.weapons.fiveStar2
                                    ),
                                    fourStar:
                                        doc.weapons.fourStar.map(
                                            relationToDictionary
                                        ),
                                };
                            } else if (
                                doc.bannerType === "character" &&
                                doc.characters
                            ) {
                                mappedDoc.characters = {
                                    fiveStar1: relationToDictionary(
                                        doc.characters.fiveStar1
                                    ),
                                    fiveStar2: relationToDictionary(
                                        doc.characters.fiveStar2
                                    ),
                                    fourStar:
                                        doc.characters.fourStar.map(
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
        {
            path: "/getDashboardEvents",
            method: "get",
            handler: async (req: PayloadRequest, res: Response) => {
                const date = req.query.date;
                if (!date) {
                    return res.status(400).send("No date provided");
                }
                try {
                    const eventsReq = await req.payload.find({
                        collection: "genshin-events",
                        where: {
                            and: [
                                {
                                    start: {
                                        less_than_equal: date,
                                    },
                                },
                                {
                                    end: {
                                        greater_than_equal: date,
                                    },
                                },
                            ],
                        },
                        sort: "start",
                    });

                    return res.status(200).send(event);
                } catch (error) {
                    console.error("getDashboardEvents threw an error: ", error);
                    return res.status(500).send(error);
                }
            },
        },
    ],
};

export default Events;
