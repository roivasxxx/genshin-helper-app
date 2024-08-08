import { CollectionConfig } from "payload/types";
import { accessControls } from "../api/accessControls";

const Releases: CollectionConfig = {
    slug: "releases",
    access: accessControls,
    fields: [
        {
            name: "allowImport",
            type: "checkbox",
        },
        {
            name: "version",
            type: "text",
        },
        {
            name: "content",
            type: "array",
            fields: [
                {
                    name: "title",
                    type: "text",
                },
                {
                    name: "content",
                    type: "textarea",
                },
            ],
        },
    ],
};
export default Releases;
