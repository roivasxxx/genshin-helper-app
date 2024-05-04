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
                href={props.pathName + props.path + subpath.path}
                className="py-2 hover:text-electro-500"
            >
                {subpath.label}
            </Link>
        </div>
    ));
}

export default function NavItems(props: { resolution: "small" | "large" }) {
    const pathName = usePathname()?.split("/")[2] || "";
    const [openStatus, setOpenStatus] = useState<boolean[]>([]);

    useEffect(() => {
        if (pathName in navConfig) {
            setOpenStatus(navConfig[pathName as GAMES].paths.map(() => false));
        }
    }, [pathName]);

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
                                props.resolution === "small" &&
                                openStatus[pathIndex]
                                    ? "bg-electro-900"
                                    : ""
                            }`}
                        >
                            <div
                                className={`w-full h-full flex items-center justify-between ${
                                    props.resolution === "large"
                                        ? "hover:text-electro-500"
                                        : ""
                                }`}
                                {...(props.resolution === "small"
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

                                {props.resolution === "small" ? (
                                    <svg
                                        className={`w-5 h-5 transition-transform duration-300 transform ${
                                            openStatus[pathIndex]
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d={
                                                openStatus[pathIndex]
                                                    ? "M5 15l7-7 7 7"
                                                    : "M19 9l-7 7-7-7"
                                            }
                                        />
                                    </svg>
                                ) : (
                                    <></>
                                )}
                            </div>
                            {props.resolution === "large" ? (
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
                        href={pathName + path.path}
                        className=" hover:text-electro-500 w-full h-full flex items-center px-6 py-2"
                    >
                        {path.label}
                    </Link>
                );
            })}
        </>
    );
}