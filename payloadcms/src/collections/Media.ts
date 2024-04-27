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
        // setting custom cloudinary folder name, defaults to /media
        {
            name: "folder",
            type: "text",
        },
        // payload-cloudinary-plugin adds a timestamp to the filename, this results in the file in cloudinary containing the timestamp
        // to avoid this, check the addFileNameDate option
        {
            name: "addFileNameDate",
            type: "checkbox",
        },
        {
            name: "alt",
            type: "text",
        },
        {
            name: "name",
            type: "text",
        },
        {
            name: "type",
            type: "text",
        },
        {
            name: "mimetype",
            type: "text",
        },
    ],
};
