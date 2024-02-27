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
import ReactSelect, { MultiValue } from "react-select";

const CharacterField: React.FC<Props> = (props) => {
    const { path, label, required } = props;
    const {
        value = [],
        initialValue = [],
        setValue,
    } = useFieldType<string[]>({
        path,
    });
    console.log(value);
    const [selected, setSelected] = useState<
        {
            label: string;
            value: string;
            image: { alt: string; url: string };
        }[]
    >([]);

    const [options, setOptions] = useState<
        {
            name: string;
            id: string;
            image: { alt: string; url: string };
        }[]
    >([
        { name: "keqing", id: "dfddfdf", image: { alt: "", url: "" } },
        { name: "diluc", id: "diluc", image: { alt: "", url: "" } },
    ]);
    console.log(options);
    const config = useConfig();

    const { serverURL } = config;

    useEffect(() => {
        const getElements = async () => {
            const req = await fetch(`${serverURL}/api/genshin-characters`, {
                credentials: "include",
            });
            const res = await req.json();
            const docs: PaginatedDocs = res;
            const newOptions = docs.docs.map((el) => {
                return {
                    name: el.name,
                    id: el.id,
                    image: {
                        alt: "",
                        url: "",
                        // alt: el.icon.alt,
                        // url: el.icon.cloudinary.secure_url,
                    },
                };
            });
            setOptions(newOptions);
            setSelected(
                Array.isArray(value)
                    ? newOptions
                          .filter((el) => value.includes(el.id))
                          .map((el) => ({
                              label: el.name,
                              value: el.id,
                              image: el.image,
                          }))
                    : []
            );
        };
        getElements();
    }, []);

    const onClick = (
        ids: MultiValue<{
            value: string;
            label: string;
            image: { alt: string; url: string };
        }>
    ) => {
        setValue([...ids.map((el) => el.value)]);
        setSelected([...ids]);
    };

    return (
        <div>
            <Label htmlFor={path} label={label} required={required} />
            <div className="element-picker__wrapper">
                <ReactSelect
                    options={options.map((el) => {
                        return {
                            value: el.id,
                            label: el.name,
                            image: {
                                alt: el.image.alt,
                                url: el.image.url,
                            },
                        };
                    })}
                    onChange={(e) => {
                        console.log(e.values());
                        onClick(e);
                    }}
                    formatOptionLabel={({ image, value, label }) => (
                        <div className="element-picker__item">
                            <img
                                src={image.url}
                                alt={image.alt}
                                width={35}
                                height={35}
                            />
                            <span>{label}</span>
                        </div>
                    )}
                    value={selected}
                    isMulti
                    components={{
                        MultiValueLabel: ({ data }) => (
                            <div className="element-picker__item">
                                <img
                                    src={data.image.url}
                                    alt={data.image.alt}
                                    width={35}
                                    height={35}
                                />
                                <span>{data.label}</span>
                            </div>
                        ),
                    }}
                />
            </div>
        </div>
    );
};

export default CharacterField;
