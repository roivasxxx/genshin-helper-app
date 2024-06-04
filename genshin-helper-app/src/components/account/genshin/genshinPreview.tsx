import Arrow from "@/components/arrow";
import DialogModal from "@/components/dialog";
import FloatingLabelInput from "@/components/floatingLabelInput";
import { GENSHIN_ACCOUNT_REGIONS } from "@/utils/constants";
import Link from "next/link";
import NotificationBell from "../notificationBell";
import PlusSign from "@/components/plusSign";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useAccount } from "../accountProvider";
import LoadingLogo from "@/components/loadingLogo";
import SuccessCheckmark from "@/components/successCheckmark";

export default function GenshinPreview() {
    const { state, createGenshinAccount } = useAccount();
    const genshin = state.games.genshin;
    const accounts = genshin.accounts;

    const [accountModalVisible, setAccountModalVisible] = useState(false);

    const [newAccountFormState, setNewAccountFormState] = useState<{
        hoyoId: string;
        region: keyof typeof GENSHIN_ACCOUNT_REGIONS | null;
        loading: boolean;
        status: string;
    }>({
        hoyoId: "",
        region: null,
        loading: false,
        status: "",
    });

    const successRef = useRef<NodeJS.Timeout | null>(null);

    const onSubmit = async () => {
        if (!createGenshinAccount || !newAccountFormState.region) return;
        setNewAccountFormState({ ...newAccountFormState, loading: true });
        const newAccountId = await createGenshinAccount({
            region: newAccountFormState.region,
            hoyoId: newAccountFormState.hoyoId,
        });
        if (newAccountId) {
            setNewAccountFormState({
                ...newAccountFormState,
                loading: false,
                status: "success",
            });
            return;
        }
        successRef.current = setTimeout(() => {
            setAccountModalVisible(false);
        }, 1000);
        setNewAccountFormState({
            ...newAccountFormState,
            loading: false,
            status: "error",
        });
    };

    useEffect(() => {
        return () => {
            if (successRef.current) clearTimeout(successRef.current);
        };
    }, []);

    const ButtonContent = () => {
        if (newAccountFormState.loading) return <LoadingLogo size="size-7" />;

        return <span>Submit</span>;
    };

    return (
        <div className="w-full h-auto">
            <div className="w-full h-20 flex flex-row items-center justify-between bg-electro-850 p-2">
                <div className="rounded h-auto flex">
                    <Image
                        src={"/images/games/icons/genshin-impact.png"}
                        alt={"game-icon-genshin-impact"}
                        width="0"
                        height="0"
                        sizes="100vw"
                        className="w-16 rounded-md"
                    />
                </div>

                <div className="flex flex-row items-center">
                    <button
                        title="Create Account"
                        onClick={() => setAccountModalVisible(true)}
                    >
                        <PlusSign
                            containerClass="bg-electro-800 rounded-full size-12 hover:bg-electro-900 active:border-electro-900"
                            iconClass="bg-electro-50 border-2 rounded group-hover:border-electro-500 group-active:border-electro-500"
                        />
                    </button>
                    <Link href="#">
                        <NotificationBell className="size-10 fill-electro-50 hover:fill-electro-500 active:fill-electro-500 cursor-pointer" />
                    </Link>
                </div>
            </div>

            <div className="max-h-20 overflow-y-auto my-2 md:max-h-40 bg-electro-850 p-2 rounded">
                {accounts.length > 0 ? (
                    accounts.map((account) => {
                        return (
                            <>
                                <Link
                                    className="flex flex-row items-center justify-between group"
                                    key={"genshin-" + account.id}
                                    href="#"
                                >
                                    <div className="flex flex-col">
                                        <span>
                                            {account.hoyoId
                                                ? account.hoyoId
                                                : account.id}
                                        </span>
                                        <span>
                                            {
                                                GENSHIN_ACCOUNT_REGIONS[
                                                    account.region
                                                ]
                                            }
                                        </span>
                                    </div>
                                    <Arrow
                                        size="small"
                                        className="group-hover:border-electro-500 mx-2"
                                    />
                                </Link>
                                <hr className="border-[0.05rem] border-electro-50/50" />
                            </>
                        );
                    })
                ) : (
                    <span className="text-electro-50 text-lg">
                        {"No Accounts :("}
                    </span>
                )}
            </div>
            {accountModalVisible ? (
                <DialogModal
                    setVisibility={() => {
                        setAccountModalVisible(false);
                        setNewAccountFormState({
                            hoyoId: "",
                            region: null,
                            status: "",
                            loading: false,
                        });
                    }}
                >
                    {newAccountFormState.status === "success" ? (
                        <div className="flex flex-col items-center justify-center w-full h-full">
                            <SuccessCheckmark className="size-14 stroke-electro-500" />
                            <h2>Account created</h2>
                        </div>
                    ) : (
                        <div className="flex flex-col p-2">
                            <FloatingLabelInput
                                label="Hoyo ID"
                                required={false}
                                value={newAccountFormState.hoyoId}
                                onChange={(e) =>
                                    setNewAccountFormState({
                                        ...newAccountFormState,
                                        hoyoId: e.target.value,
                                        status: "",
                                    })
                                }
                                id="hoyoId"
                                labelBgColor="bg-electro-850"
                            />
                            <div className="flex flex-row overflow-x-auto gap-1">
                                {Object.keys(GENSHIN_ACCOUNT_REGIONS).map(
                                    (_region) => {
                                        const region =
                                            _region as keyof typeof GENSHIN_ACCOUNT_REGIONS;
                                        return (
                                            <button
                                                key={"genshin-" + region}
                                                className={`p-2 rounded bg-electro-800 hover:bg-electro-900 active:bg-electro-900 ${
                                                    newAccountFormState.region ===
                                                    region
                                                        ? "bg-electro-900 text-electro-50"
                                                        : "bg-electro-900/50 text-electro-50/50"
                                                }`}
                                                onClick={() => {
                                                    setNewAccountFormState({
                                                        ...newAccountFormState,
                                                        region: region,
                                                        status: "",
                                                    });
                                                }}
                                            >
                                                {
                                                    GENSHIN_ACCOUNT_REGIONS[
                                                        region
                                                    ]
                                                }
                                            </button>
                                        );
                                    }
                                )}
                            </div>

                            {newAccountFormState.status === "error" ? (
                                <span className="text-red-500">
                                    Uh oh, something went wrong, try again later
                                </span>
                            ) : (
                                <></>
                            )}
                            <button
                                className={`w-full mt-2 bg-electro-500 text-electro-50 p-2 rounded hover:bg-electro-900 disabled:bg-gray-600 flex justify-center`}
                                type="submit"
                                disabled={
                                    newAccountFormState.loading ||
                                    !newAccountFormState.region ||
                                    newAccountFormState.status === "success"
                                }
                                onClick={onSubmit}
                            >
                                <ButtonContent />
                            </button>
                        </div>
                    )}
                </DialogModal>
            ) : (
                <></>
            )}
        </div>
    );
}
