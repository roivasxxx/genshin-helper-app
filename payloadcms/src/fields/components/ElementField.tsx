import React, { useEffect, useState } from "react";

// this is how we'll interface with Payload itself
import { useFieldType } from "payload/components/forms";

// we'll re-use the built in Label component directly from Payload
import { Label } from "payload/components/forms";

// we can use existing Payload types easily
import { Props } from "payload/components/fields/Text";

import { PaginatedDocs } from "payload/database";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import "./styles.scss";

const ElementField: React.FC<Props> = (props) => {
    const { path, label, required } = props;
    const { value = "", setValue } = useFieldType({
        path,
    });

    const [options, setOptions] = useState<
        {
            name: string;
            id: string;
            image: { alt: string; url: string };
        }[]
    >([]);

    const config = useConfig();

    const { serverURL } = config;

    useEffect(() => {
        const getElements = async () => {
            const req = await fetch(`${serverURL}/api/genshin-elements`, {
                credentials: "include",
            });
            const res = await req.json();
            const docs: PaginatedDocs = res;
            setOptions(
                docs.docs.map((el) => {
                    return {
                        name: el.name,
                        id: el.id,
                        image: {
                            alt: el.icon.alt,
                            url: el.icon.cloudinary.secure_url,
                        },
                    };
                })
            );
        };
        getElements();
    }, []);

    return (
        <div>
            <Label htmlFor={path} label={label} required={required} />
            <div className="element-picker__wrapper">
                {options.map((el) => {
                    return (
                        <span
                            key={el.id}
                            onClick={() => setValue(el.id)}
                            className={
                                value === el.id
                                    ? "element-picker__item element-picker__item--selected"
                                    : "element-picker__item"
                            }
                        >
                            <img
                                src={el.image.url}
                                alt={el.image.alt}
                                width={35}
                                height={35}
                            />
                        </span>
                    );
                })}
            </div>
        </div>
    );
};

export default ElementField;
