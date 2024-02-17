import { CollectionConfig } from "payload/types";

export const Media: CollectionConfig = {
    slug: "media",
    upload: {
        staticURL: "/media",
        staticDir: "media",
        adminThumbnail: "thumbnail",
        mimeTypes: ["image/*"],
        // files not saved to disk
        // they do get saved temporarily when uploading files to cloudinary
        // the media directory will remain -> deleting it might cause issues during concurrent uploads
        disableLocalStorage: true,
    },
    fields: [
        {
            name: "alt",
            type: "text",
        },
    ],
};
