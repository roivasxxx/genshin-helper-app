import React, { useEffect, useState } from "react";
import { useConfig } from "payload/dist/admin/components/utilities/Config";
import ReactSelect, { components } from "react-select";
import { Label, useFieldType } from "payload/components/forms";
import { PaginatedDocs } from "payload/database";
import qs from "qs";
import ImageWithFallback from "./ImageWithFallback";

export default function MultiItemField(props) {
    const {
        path,
        label,
        required,
        hasMany: _hasMany,
        filter: _filter,
        collection,
    } = props;
    const hasMany = _hasMany || false;
    const filter = _filter || undefined;

    const { value = !hasMany ? "" : [], setValue } = useFieldType({
        path,
    });
    const [selected, setSelected] = useState(
        typeof value === "string" ? "" : []
    );

    const [options, setOptions] = useState<
        {
            name: string;
            id: string;
            images: { alt: string; url: string }[];
        }[]
    >([]);

    const config = useConfig();

    useEffect(() => {
        const getElements = async () => {
            let stringifiedQuery = "";
            if (filter) {
                const query = filter;
                stringifiedQuery = qs.stringify(
                    {
                        where: query,
                    },
                    { addQueryPrefix: true }
                );
            }
            const req = await fetch(
                `${serverURL}/api/${collection}${stringifiedQuery}`,
                {
                    credentials: "include",
                }
            );
            const res = await req.json();
            const docs: PaginatedDocs = res;
            const newOptions = docs.docs.map((el) => {
                const items = el.items || [];
                const itemNamesJoined = items.map((el) => el.name).join("-");
                const itemImages = items.map((el) => ({
                    alt: el?.icon?.alt,
                    url: el?.icon?.cloudinary?.secure_url,
                }));
                return {
                    name: itemNamesJoined || el.name,
                    id: el.id,
                    images: itemImages,
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
                              images: el.images,
                          }))
                    : ""
            );
        };
        getElements();
    }, []);

    const onClick = (e) => {
        setValue(!hasMany ? e.value : [...e.map((el) => el.value)]);
        setSelected(!hasMany ? e : [...e]);
    };

    const onRemoveClick = (id: string) => {
        setValue(
            hasMany && Array.isArray(value)
                ? value.filter((el) => el !== id)
                : ""
        );
        setSelected(
            hasMany && Array.isArray(selected)
                ? selected.filter((el) => el.value !== id)
                : ""
        );
    };

    const { serverURL } = config;
    return (
        <div>
            <Label htmlFor={path} label={label} required={required} />
            <div className="element-picker__wrapper">
                <ReactSelect
                    value={selected}
                    isMulti={hasMany}
                    controlShouldRenderValue={!hasMany}
                    onChange={(e) => {
                        onClick(e);
                    }}
                    options={options.map((el) => {
                        return {
                            value: el.id,
                            label: el.name,
                            images: el.images,
                        };
                    })}
                    components={{
                        Option: (props) => (
                            <components.Option {...props}>
                                <div className="genshin-picker__item--image-wrapper">
                                    {props.data.images.map((image) => {
                                        return (
                                            <ImageWithFallback
                                                src={image.url}
                                                alt={image.alt}
                                                className="genshin-picker__item--image-img"
                                                fallbackClassName="genshin-picker__item--image-fallback"
                                            />
                                        );
                                    })}
                                </div>
                                <span>{props.data.label}</span>
                            </components.Option>
                        ),
                        SingleValue: (props) => (
                            <components.SingleValue {...props}>
                                <div className="genshin-picker__item--selected">
                                    <div className="genshin-picker__item--image-wrapper">
                                        {props.data.images.map((image) => {
                                            return (
                                                <ImageWithFallback
                                                    src={image.url}
                                                    alt={image.alt}
                                                    className="genshin-picker__item--image-img"
                                                    fallbackClassName="genshin-picker__item--image-fallback"
                                                />
                                            );
                                        })}
                                    </div>
                                    <span>{props.data.label}</span>
                                </div>
                            </components.SingleValue>
                        ),
                    }}
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
                            color: "rgb(235, 235, 235)",
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
                            backgroundColor: styles.isFocused
                                ? "rgba(101,101,101,255)"
                                : "rgb(34, 34, 34)",
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
                        singleValue: (baseStyles, styles) => ({
                            ...baseStyles,
                            color: "rgb(235, 235, 235)",
                        }),
                    }}
                />
            </div>

            {hasMany && Array.isArray(selected) && selected.length > 0 ? (
                <div className="genshin-picker__selected-items">
                    {selected.map((char) => {
                        return (
                            <div
                                className={`genshin-picker__multi-selected-item`}
                                onClick={() => onRemoveClick(char.value)}
                                key={`select-${char.value}`}
                            >
                                {char.label}
                                {/* <img
                                    src={char.image.url}
                                    alt={char.image.alt || char.label}
                                    title={char.image.alt || char.label}
                                    width={60}
                                    height={60}
                                /> */}
                                <svg
                                    viewBox="0 0 20 20"
                                    aria-hidden="true"
                                    focusable="false"
                                    className="genshin-picker__multi-selected-item--cross"
                                >
                                    <path d="M14.348 14.849c-0.469 0.469-1.229 0.469-1.697 0l-2.651-3.030-2.651 3.029c-0.469 0.469-1.229 0.469-1.697 0-0.469-0.469-0.469-1.229 0-1.697l2.758-3.15-2.759-3.152c-0.469-0.469-0.469-1.228 0-1.697s1.228-0.469 1.697 0l2.652 3.031 2.651-3.031c0.469-0.469 1.228-0.469 1.697 0s0.469 1.229 0 1.697l-2.758 3.152 2.758 3.15c0.469 0.469 0.469 1.229 0 1.698z"></path>
                                </svg>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
