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
import ReactSelect, { MultiValue, components } from "react-select";
import ImageWithFallback from "./ImageWithFallback";

const CharacterField: React.FC<Props> = (props) => {
    const { path, label, required } = props;
    const {
        value = [],
        initialValue = [],
        setValue,
    } = useFieldType<string[]>({
        path,
    });
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
    >([]);

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
                        alt: el?.icon?.alt || "",
                        url: el?.icon?.cloudinary?.secure_url || "",
                    },
                };
            });
            setOptions(new Array(5).fill(newOptions[0]));
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

    const onRemoveClick = (id: string) => {
        setValue(value.filter((el) => el !== id));
        setSelected(selected.filter((el) => el.value !== id));
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
                        onClick(e);
                    }}
                    components={{
                        Option: (props) => (
                            <components.Option {...props}>
                                <div className="character-picker__item--image-wrapper">
                                    <ImageWithFallback
                                        src={props.data.image.url}
                                        alt={
                                            props.data.image.alt ||
                                            props.data.label
                                        }
                                        className="character-picker__item--image-img"
                                        fallbackClassName="character-picker__item--image-fallback"
                                    />
                                </div>
                                <span>{props.data.label}</span>
                            </components.Option>
                        ),
                    }}
                    value={selected}
                    isMulti
                    // disables selected values
                    controlShouldRenderValue={false}
                    styles={{
                        container: (baseStyles, styles) => ({
                            ...baseStyles,
                            width: "100%",
                            borderColor: styles.isFocused
                                ? "rgb(141, 141, 141)"
                                : "rgb(60, 60, 60)",
                        }),
                        control: (baseStyles, styles) => ({
                            ...baseStyles,
                            backgroundColor: "rgb(34, 34, 34)",
                            width: "100%",
                            borderColor: styles.isFocused
                                ? "rgb(141, 141, 141)"
                                : "rgb(60, 60, 60)",
                            boxShadow: "none",
                            "&:hover": {
                                borderColor: "rgb(141, 141, 141)",
                                boxShadow: "none",
                            },
                        }),
                        placeholder: (baseStyles, styles) => ({
                            ...baseStyles,
                            color: "rgb(235, 235, 235)",
                        }),
                        input: (baseStyles, styles) => ({
                            ...baseStyles,
                            color: "rgb(235, 235, 235)",
                        }),
                        option: (baseStyles, styles) => ({
                            ...baseStyles,
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            height: "40px",
                            color: "rgb(235, 235, 235)",
                            backgroundColor: "rgb(34, 34, 34)",
                            padding: "5px",
                            "&:hover": {
                                backgroundColor: "rgba(101,101,101,255)",
                            },
                        }),
                        menuList: (baseStyles, styles) => ({
                            ...baseStyles,
                            color: "rgb(235, 235, 235)",
                            backgroundColor: "rgb(34, 34, 34)",
                        }),
                        menu: (baseStyles, styles) => ({
                            ...baseStyles,
                            color: "rgb(235, 235, 235)",
                            backgroundColor: "rgb(34, 34, 34)",
                        }),
                    }}
                />
            </div>
            <div className="character-picker__selected-items">
                {selected.map((char) => {
                    return (
                        <div
                            className={`character-picker__selected-item`}
                            onClick={() => onRemoveClick(char.value)}
                        >
                            <img
                                src={char.image.url}
                                alt={char.image.alt || char.label}
                                title={char.image.alt || char.label}
                                width={60}
                                height={60}
                            />
                            <svg
                                height="40"
                                width="40"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                                focusable="false"
                                className="character-picker__selected-item--cross"
                            >
                                <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                            </svg>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CharacterField;
