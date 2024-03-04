import { Field } from "payload/types";
import ItemField from "./components/ItemField";

type ItemConfigProps = {
    fieldName: string;
    collection: string;
    max?: number;
    min?: number;
    visible?: (...args: any) => boolean;
    filter?: any;
    hasMany?: boolean;
};

/**
 * Filter -> depends on type from GenshinItem collection, should be an object, eg: {name: {equals: "fish"}};
 *
 */
export const genshinSelectField = ({
    fieldName,
    collection,
    max = 1,
    min = 1,
    visible = () => true,
    filter = undefined,
    hasMany = false,
}: ItemConfigProps): Field => {
    const hasMax = max > 1;

    const extraProps: any = {};

    if (hasMax) {
        // if maxRows is set and greater than 1 -> set minRows, maxRows and hasMany
        extraProps.maxRows = max;
        extraProps.minRows = min;
        extraProps.hasMany = true;
    } else if (hasMany) {
        // if max not set but hasMany is set -> set hasMany
        extraProps.hasMany = true;
    }

    return {
        ...{
            name: fieldName,
            type: "relationship",
            relationTo: collection,
            admin: {
                condition: visible,
                components: {
                    Field: (fieldProps) =>
                        ItemField({ ...fieldProps, filter, collection }),
                },
            },
        },
        ...extraProps,
    };
};
