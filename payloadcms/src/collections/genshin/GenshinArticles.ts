import { CollectionConfig } from "payload/types";
import { genshinSelectField } from "../../fields/fieldsConfig";
import { relationToDictionary } from "../../utils";
import { GenshinArticle } from "../../../types/payload-types";
import { accessControls } from "../../api/accessControls";

const isGuide = (data) => {
    return data.type === "guide";
};

const mapArticleOverview = (doc: GenshinArticle) => {
    const article = {
        id: doc.id,
        title: doc.title,
        type: doc.type,
        updatedAt: doc.updatedAt,
        status: doc.updatedAt === doc.createdAt ? "new" : "updated",
    };

    if (doc.type === "guide") {
        article["character"] = relationToDictionary(doc.characterId);
    }

    return article;
};

const GenshinArticles: CollectionConfig = {
    slug: "genshin-articles",
    access: accessControls,
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
        genshinSelectField({
            fieldName: "characterId",
            collection: "genshin-characters",
            visible: isGuide,
        }),
        {
            name: "weapons",
            type: "group",
            fields: [
                {
                    type: "array",
                    name: "sections",
                    fields: [
                        {
                            name: "title",
                            type: "text",
                        },
                        {
                            name: "description",
                            type: "richText",
                        },
                    ],
                },
                {
                    name: "weaponsList",
                    type: "array",
                    fields: [
                        genshinSelectField({
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
            type: "group",
            fields: [
                {
                    type: "array",
                    name: "sections",
                    fields: [
                        {
                            name: "title",
                            type: "text",
                        },
                        {
                            name: "description",
                            type: "richText",
                        },
                    ],
                },
                {
                    name: "artifactList",
                    type: "array",
                    fields: [
                        genshinSelectField({
                            fieldName: "artifactIds",
                            collection: "genshin-artifacts",
                            // for combinations of 2/2
                            max: 2,
                        }),
                        {
                            name: "description",
                            type: "richText",
                        },
                    ],
                    admin: {
                        condition: isGuide,
                    },
                },
            ],
            admin: {
                condition: isGuide,
            },
        },
        {
            name: "bestTeams",
            type: "group",
            fields: [
                { name: "description", type: "richText" },
                {
                    name: "teamMateList",
                    type: "array",
                    fields: [
                        genshinSelectField({
                            fieldName: "characterId",
                            collection: "genshin-characters",
                        }),
                        {
                            type: "richText",
                            name: "description",
                        },
                    ],
                },
            ],
            admin: {
                condition: isGuide,
            },
        },
        {
            name: "comps",
            type: "group",
            fields: [
                {
                    type: "array",
                    name: "sections",
                    fields: [
                        {
                            name: "title",
                            type: "text",
                        },
                        {
                            name: "description",
                            type: "richText",
                        },
                    ],
                },
                {
                    name: "compsList",
                    type: "array",
                    fields: [
                        {
                            name: "compName",
                            type: "text",
                        },
                        {
                            name: "description",
                            type: "richText",
                        },
                        genshinSelectField({
                            fieldName: "characterIds",
                            collection: "genshin-characters",
                            max: 3,
                        }),
                        genshinSelectField({
                            fieldName: "flexElements",
                            collection: "genshin-elements",
                            max: 3,
                        }),
                    ],
                },
            ],
            admin: {
                condition: isGuide,
            },
        },
        {
            name: "sections",
            type: "array",
            fields: [
                {
                    name: "title",
                    type: "text",
                },
                {
                    name: "content",
                    type: "richText",
                },
            ],
        },
    ],
    hooks: {
        afterChange: [
            async ({ doc }) => {
                const revalidateUrl = `${process.env.FRONTEND_URL}/api/revalidate?path=article&articleId=${doc.id}&secret=${process.env.FRONTEND_REVALIDATE_SECRET}`;
                const result = await fetch(revalidateUrl);
                if (result.ok) {
                    console.log(`Revalidated article ${doc.id}`);
                } else {
                    console.error(`Failed to revalidate article ${doc.id}`);
                }

                return doc;
            },
        ],
    },
    endpoints: [
        {
            path: "/getArticleIds",
            method: "get",
            handler: async (req, res) => {
                try {
                    const articles = await req.payload.find({
                        collection: "genshin-articles",
                        pagination: false,
                    });
                    return res
                        .status(200)
                        .json(articles.docs.map((doc) => doc.id));
                } catch (error) {
                    console.error(
                        "/genshin-articles/getArticleIds threw an error: ",
                        error
                    );
                }
            },
        },
        {
            path: "/getArticle",
            method: "get",
            handler: async (req, res) => {
                try {
                    const { id } = req.query;
                    if (typeof id !== "string") {
                        return res.status(400).send("Invalid id");
                    }
                    const _article = await req.payload.findByID({
                        id,
                        collection: "genshin-articles",
                    });
                    const { characterId, ...rest } = _article;

                    const article: Record<string, any> = {
                        character: relationToDictionary(characterId),
                        changes: rest.changes,
                        sections: rest.sections,
                        createdAt: rest.createdAt,
                        updatedAt: rest.updatedAt,
                        type: rest.type,
                        title: rest.title,
                    };

                    article.bestTeams = {
                        description: rest.bestTeams.description,
                        list: rest.bestTeams.teamMateList.map((teamMate) => {
                            const { characterId, id, ...mate } = teamMate;
                            return {
                                ...mate,
                                character: relationToDictionary(characterId),
                            };
                        }),
                    };

                    rest.comps.compsList.forEach((comp, index) => {
                        rest.comps.compsList[index] = {
                            //@ts-ignore
                            flexElements: comp.flexElements.map((element) => {
                                return relationToDictionary(element);
                            }),
                            //@ts-ignore
                            characters: comp.characterIds.map((characterId) =>
                                relationToDictionary(characterId)
                            ),
                            compName: comp.compName,
                            description: comp.description,
                        };
                    });

                    article.comps = {
                        sections: rest.comps.sections,
                        list: rest.comps.compsList,
                    };

                    article.artifacts = {
                        sections: rest.artifacts.sections,
                        list: rest.artifacts.artifactList.map((artifact) => {
                            const { id, artifactIds, ...rest } = artifact;
                            return {
                                ...rest,
                                artifacts: artifactIds.map((artifactId) =>
                                    relationToDictionary(artifactId)
                                ),
                            };
                        }),
                    };

                    article.weapons = {
                        sections: rest.weapons.sections,
                        list: rest.weapons.weaponsList.map((weapon) => {
                            const { weaponId, id, ...rest } = weapon;
                            return {
                                ...rest,
                                weapon: relationToDictionary(weapon.weaponId),
                            };
                        }),
                    };

                    return res.status(200).json(article);
                } catch (error) {
                    console.error(
                        "/genshin-articles/getArticleIds threw an error: ",
                        error
                    );
                }
            },
        },
        {
            path: "/getArticleOverview",
            method: "get",
            handler: async (req, res) => {
                try {
                    const articles = await req.payload.find({
                        collection: "genshin-articles",
                        pagination: false,
                    });
                    return res
                        .status(200)
                        .send(articles.docs.map(mapArticleOverview));
                } catch (error) {
                    console.error(
                        "/genshin-articles/getArticleIds threw an error: ",
                        error
                    );
                    return res.status(500).send(error);
                }
            },
        },
        {
            path: "/getRecentArticles",
            method: "get",
            handler: async (req, res) => {
                try {
                    const articles = await req.payload.find({
                        collection: "genshin-articles",
                        limit: 5,
                        sort: "-updatedAt",
                    });
                    return res
                        .status(200)
                        .send(articles.docs.map(mapArticleOverview));
                } catch (error) {
                    console.error(
                        "/genshin-articles/getArticleIds threw an error: ",
                        error
                    );
                    return res.status(500).send(error);
                }
            },
        },
        {
            path: "/getArticleTitle",
            method: "get",
            handler: async (req, res) => {
                try {
                    const { id } = req.query;
                    if (typeof id !== "string") {
                        return res.status(400).send("Invalid id");
                    }
                    const _article = await req.payload.findByID({
                        id,
                        collection: "genshin-articles",
                    });
                    return res.status(200).send(_article.title);
                } catch (error) {
                    console.error(
                        "/genshin-articles/getArticleTitle threw an error: ",
                        error
                    );
                    return res.status(500).send(error);
                }
            },
        },
    ],
};

export default GenshinArticles;
