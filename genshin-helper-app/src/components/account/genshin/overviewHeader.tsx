import CSVIcon from "@/components/csvIcon";
import DialogModal from "@/components/dialog";
import JsonIcon from "@/components/jsonIcon";
import { GenshinAccount, IMPORT_STATUS } from "@/types/apiResponses";
import { useState } from "react";
import WishFAQ from "./wishFAQ";
import useClickOutside from "@/utils/hooks/useClickOutside";
import ImportFAQ from "./importFAQ";
import FloatingLabelInput from "@/components/floatingLabelInput";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "@/utils/dateUtils";
import cmsRequest from "@/utils/fetchUtils";

export default function OverviewHeader(props: {
    accountData: GenshinAccount;
    importHistory: (link: string) => Promise<void>;
}) {
    const { isVisible, setVisibility, ref } = useClickOutside(false);
    const {
        isVisible: importVisible,
        setVisibility: setImportVisible,
        ref: ref2,
    } = useClickOutside(false);
    const [link, setLink] = useState("");

    const accountData = props.accountData;

    const dateOrStatus = () => {
        if (accountData.importJobStatus === "NONE") {
            return (
                <span>
                    {accountData.wishInfo.lastUpdate
                        ? dayjs(
                              new Date(accountData.wishInfo.lastUpdate)
                          ).format(DATE_TIME_FORMAT)
                        : "No data"}
                </span>
            );
        } else {
            let color = "text-electro-50";
            switch (accountData.importJobStatus) {
                case "FAILED":
                    color = "text-red-500";
                    break;
                case "COMPLETED":
                    color = "text-green-500";
                    break;
            }
            return (
                <span className={color}>
                    IMPORT_STATUS[accountData.importJobStatus];
                </span>
            );
        }
    };

    return (
        <>
            <h2 className="text-xl text-center">{props.accountData.region}</h2>
            <hr className="my-2 border-[0.12rem] rounded px-2" />
            <div className="w-full md:w-1/2 m-auto">
                <div className="flex flex-row justify-between items-center">
                    <h2 className="text-2xl py-2">Wish History</h2>
                    {dateOrStatus()}
                </div>
                <div className="flex flex-row items-center justify-between gap-2 w-full">
                    <h2 className="text-xl py-2 flex-1">Import</h2>
                    <div className="flex flex-1 gap-2 justify-end">
                        <button
                            className="bg-electro-900 text-lg p-2 rounded hover:bg-electro-900/50 active:bg-electro-900/60"
                            onClick={() => setImportVisible(!importVisible)}
                        >
                            Tutorial
                        </button>
                        <button
                            className="bg-electro-900 text-lg p-2 rounded hover:bg-electro-900/50 active:bg-electro-900/60"
                            onClick={() => setVisibility(!isVisible)}
                        >
                            FAQ
                        </button>
                    </div>
                </div>

                {isVisible ? (
                    <DialogModal
                        setVisibility={() => setVisibility(false)}
                        ref={ref}
                    >
                        <WishFAQ />
                    </DialogModal>
                ) : (
                    <></>
                )}

                {importVisible ? (
                    <DialogModal
                        setVisibility={() => setImportVisible(false)}
                        ref={ref2}
                    >
                        <ImportFAQ />
                    </DialogModal>
                ) : (
                    <></>
                )}

                <div className="flex flex-col gap-2">
                    <div className="flex-1">
                        <FloatingLabelInput
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                            id=""
                            label="Link"
                        />
                    </div>
                    <button
                        className="bg-electro-900 text-lg p-2 rounded cursor-pointer flex-1 disabled:bg-gray-600 hover:bg-electro-900/50 active:bg-electro-900/60"
                        disabled={
                            link.length === 0 ||
                            props.accountData.importJobStatus === "NONE"
                        }
                        onClick={() => props.importHistory(link)}
                    >
                        Import
                    </button>
                </div>
                <div className="flex flex-row items-start items-center gap-2 p-2">
                    <h2 className="text-xl">Export</h2>
                    <div className="flex flex-1 gap-2 justify-end">
                        <button
                            className="bg-electro-900 p-2 rounded hover:bg-electro-900/60 active:bg-electro-900/60 flex items-center"
                            title="Export to JSON"
                        >
                            <JsonIcon className="fill-electro-50 size-7" />
                        </button>
                        <button
                            className="bg-electro-900 p-2 rounded hover:bg-electro-900/60 active:bg-electro-900/60"
                            title="Export to CSV"
                        >
                            <CSVIcon className="fill-electro-50 size-7" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
