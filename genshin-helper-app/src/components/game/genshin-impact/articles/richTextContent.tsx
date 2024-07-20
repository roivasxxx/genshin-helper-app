import { RichText, RichTextChild, RichTextItem } from "@/types/genshinTypes";
import { ARTICLE_KEY_VALUES } from "@/utils/constants";
import React, { ElementType, Fragment } from "react";

function TextHelper(props: { text: string; keyString: string }) {
    const { text, keyString } = props;
    const parts = text.split(/(\${[^}]+})/g);
    return (
        <>
            {parts.map((part, index) => {
                if (part.match(/\${[^}]+}/)) {
                    // Handle placeholder styling here
                    let slice = part.slice(2, -1);
                    const keyPair = slice.split("-");
                    const key = keyPair[0];
                    const value = keyPair[1];

                    const keyValue =
                        ARTICLE_KEY_VALUES[
                            key as keyof typeof ARTICLE_KEY_VALUES
                        ];

                    const content: any =
                        keyValue[
                            value as keyof (typeof ARTICLE_KEY_VALUES)[keyof typeof ARTICLE_KEY_VALUES]
                        ];

                    return (
                        <span
                            key={`${keyString}-placeholder-${index}`}
                            className={content.className || ""}
                        >
                            {content.text}
                        </span>
                    );
                }
                return (
                    <Fragment key={`${keyString}-fragment-${index}`}>
                        {part}
                    </Fragment>
                );
            })}
        </>
    );
}

// Helper function to render a text node
function RenderTextNode(
    props: RichTextChild & { text: string; keyString: string }
) {
    const { text, bold, italic, underline, keyString } = props;
    let content: JSX.Element = <TextHelper text={text} keyString={keyString} />;
    if (bold) {
        content = <strong>{content}</strong>;
    }

    if (italic) {
        content = <em>{content}</em>;
    }

    if (underline) {
        content = <u>{content}</u>;
    }

    return content;
}

// Helper function to render children nodes
function RenderChildren(props: {
    children: RichTextItem["children"];
    keyString: string;
}) {
    const { children, keyString } = props;

    return children.map((child, index) => {
        const key = `${keyString}-child-${index}`;
        // console.log(key, index, child, children.length);
        if (child?.type === "li" && child.children) {
            return (
                <li key={key}>
                    {child.children
                        ?.filter(
                            (el): el is RichTextChild & { text: string } =>
                                !!el.text
                        )
                        .map((child, index) => {
                            const _key = `${key}-li-${index}`;
                            return (
                                <RenderTextNode
                                    {...child}
                                    key={_key}
                                    keyString={`${_key}-textNode`}
                                />
                            );
                        })}
                </li>
            );
        } else if (child.text && typeof child.text === "string") {
            const { text, ...rest } = child;
            return (
                <span key={key}>
                    <RenderTextNode
                        text={child.text}
                        {...rest}
                        keyString={key}
                    />
                </span>
            );
        }
        return <React.Fragment key={key} />;
    });
}

function Transform(props: { item: RichTextItem; keyString: string }) {
    const { item, keyString } = props;
    let Wrapper: ElementType = "div";
    let className = "";
    if (item.type === "ul") {
        Wrapper = "ul";
        className = "list-disc list-inside";
    } else if (item.type?.match(/h[1-6]/)) {
        Wrapper = item.type;
        className = "font-bold text-lg";
    }

    return (
        <Wrapper className={className}>
            <RenderChildren children={item.children} keyString={keyString} />
        </Wrapper>
    );
}

/**
 * Returns transformed slate.js rich text content
 */
export default function RichTextContent(props: {
    content?: RichText;
    keyString: string;
    className?: string;
}) {
    const { content, keyString, className } = props;

    const _className = className || "w-full";
    if (!content) {
        return <React.Fragment key={keyString}></React.Fragment>;
    }
    return (
        <div className={_className}>
            {content.map((item, index) => {
                return (
                    <Transform
                        item={item}
                        keyString={`${keyString}-transform-${index}`}
                        key={`${keyString}-transform-${index}`}
                    />
                );
            })}
        </div>
    );
}
