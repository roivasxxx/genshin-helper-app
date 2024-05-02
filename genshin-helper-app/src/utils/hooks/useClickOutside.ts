import { useEffect, useRef, useState } from "react";

/**
 * React hook for components that need to react to click outside where onBlur is not enough.
 * Hook controls component's visibility. To use this hook ref needs to be set by component to itself.
 * Provides access to isVisible state and setVisibility setter function.
 * @param initialState                initial visible state of the component (boolean)
 * @param skipElements                list of element ids to skip
 */
export default function useClickOutside(
    initialState: boolean,
    skipElements?: string[]
) {
    const [isVisible, setVisibility] = useState(initialState);
    // HTMLDivElement is used as generic, should work for all other elements
    const ref = useRef<HTMLDivElement>(null);

    const handleClickOutside = (event: MouseEvent) => {
        if (ref.current && event.target instanceof Element) {
            if (
                !ref.current.contains(event.target) &&
                !skipElements?.includes(event.target.id)
            ) {
                setVisibility(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener(
            "click",
            (event) => {
                handleClickOutside(event);
            },
            true
        );
        return () => {
            document.removeEventListener(
                "click",
                (event) => {
                    handleClickOutside(event);
                },
                true
            );
        };
    }, []);

    return { ref, isVisible, setVisibility };
}
