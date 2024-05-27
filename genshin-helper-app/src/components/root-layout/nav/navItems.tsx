"use client";
import ArrowToggle from "@/components/arrowToggle";
import navConfig, { NavConfigPath } from "@/nav-config";
import { GAMES } from "@/utils/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

function SubPaths(props: {
    pathName: string;
    path: string;
    subpaths: NavConfigPath[];
}) {
    return props.subpaths.map((subpath) => (
        <div key={props.pathName + props.path + subpath.path}>
            <Link
                href={"/game/" + props.pathName + props.path + subpath.path}
                className="py-2 hover:text-electro-500"
            >
                {subpath.label}
            </Link>
        </div>
    ));
}

export default function NavItems() {
    const pathName = usePathname()?.split("/")[2] || "";
    const [openStatus, setOpenStatus] = useState<boolean[]>([]);
    // initial state for mobile is false, needs to be updated on client, cant use default window.innerWidth value, cause of server rendering, hydration errors
    const [isMobile, setIsMobile] = useState(false);

    const resolution = isMobile ? "small" : "large";

    useEffect(() => {
        if (pathName in navConfig) {
            setOpenStatus(navConfig[pathName as GAMES].paths.map(() => false));
        }
    }, [pathName]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener("resize", handleResize);

        // run once to set initial state on client
        handleResize();
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (!(pathName in navConfig)) {
        return null;
    }
    return (
        <>
            {navConfig[pathName as GAMES].paths.map((path, pathIndex) => {
                if (path.subpaths) {
                    return (
                        <div
                            key={pathName + path.path}
                            className={`w-full h-full group px-6 py-2 relative hover:cursor-pointer ${
                                resolution === "small" && openStatus[pathIndex]
                                    ? "bg-electro-900"
                                    : ""
                            }`}
                        >
                            <div
                                className={`w-full h-full flex items-center justify-between ${
                                    resolution === "large"
                                        ? "hover:text-electro-500"
                                        : ""
                                }`}
                                {...(resolution === "small"
                                    ? {
                                          onClick: () =>
                                              setOpenStatus(
                                                  openStatus.map(
                                                      (open, index) =>
                                                          index === pathIndex
                                                              ? !open
                                                              : open
                                                  )
                                              ),
                                      }
                                    : {})}
                            >
                                {path.label}

                                {resolution === "small" ? (
                                    <ArrowToggle
                                        isOpen={openStatus[pathIndex]}
                                        strokeWidth={2}
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                            {resolution === "large" ? (
                                <div className="absolute hidden group-hover:block bg-electro-800 py-2 px-4">
                                    <SubPaths
                                        pathName={pathName}
                                        path={path.path}
                                        subpaths={path.subpaths}
                                    />
                                </div>
                            ) : openStatus[pathIndex] ? (
                                <div className="w-full bg-electro-900 py-2">
                                    <SubPaths
                                        pathName={pathName}
                                        path={path.path}
                                        subpaths={path.subpaths}
                                    />
                                </div>
                            ) : (
                                <></>
                            )}
                        </div>
                    );
                }
                return (
                    <Link
                        key={pathName + path.path}
                        href={"/game/" + pathName + path.path}
                        className=" hover:text-electro-500 w-full h-full flex items-center px-6 py-2"
                    >
                        {path.label}
                    </Link>
                );
            })}
        </>
    );
}
