import { Field } from "payload/types";
import ItemField from "./components/ItemField";

type ItemConfigProps = {
    fieldName: string;
    max?: number;
    min?: number;
    visible?: (...args: any) => boolean;
    filter?: any;
};

/**
 * Filter -> depends on type from GenshinItem collection
 */
export const genshinItemConfig = ({
    fieldName,
    max = 1,
    min = 1,
    visible = () => true,
    filter = "",
}: ItemConfigProps): Field => {
    const hasMax = max > 1;

    return {
        name: fieldName,
        type: "relationship",
        relationTo: "genshin-items",
        admin: {
            condition: visible,
            components: {
                Field: (fieldProps) => ItemField({ ...fieldProps, filter }),
            },
        },
        maxRows: hasMax ? max : undefined,
        minRows: hasMax ? min : undefined,
        hasMany: hasMax || undefined,
    };
};
