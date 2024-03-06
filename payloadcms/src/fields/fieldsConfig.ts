import { Field } from "payload/types";
import ItemField from "./components/ItemField";
import { GenshinCollectionNames } from "../../types/payload-types";
import MultiItemField from "./components/MultiItemField";

type CommonItemConfigProps<T extends GenshinCollectionNames> = {
    fieldName: string;
    collection: T;
    visible?: (...args: any) => boolean;
    filter?: any;
};

type ItemConfigProps<T extends GenshinCollectionNames> =
    CommonItemConfigProps<T> &
        (
            | {
                  max?: number;
                  min?: number;
                  hasMany?: boolean;
                  isMultiSelect?: false;
              }
            | {
                  max?: undefined;
                  min?: undefined;
                  hasMany?: boolean;
                  isMultiSelect?: true;
              }
        );

/**
 * Filter -> depends on type from GenshinItem collection, should be an object, eg: {name: {equals: "fish"}};
 * isMultiSelect -> if true -> use a different component
 */
export const genshinSelectField = <T extends GenshinCollectionNames>({
    fieldName,
    collection,
    max = 1,
    min = 1,
    visible = () => true,
    filter = undefined,
    hasMany = false,
    isMultiSelect = false,
}: ItemConfigProps<T>): Field => {
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

    const components = {
        Field: (fieldProps) =>
            isMultiSelect
                ? MultiItemField({ ...fieldProps, filter, collection })
                : ItemField({ ...fieldProps, filter, collection }),
    };

    return {
        ...{
            name: fieldName,
            type: "relationship",
            relationTo: collection,
            admin: {
                condition: visible,
                components,
            },
        },
        ...extraProps,
    };
};
