export default function ImportFAQ() {
    return (
        <div className="w-full flex flex-col p-2">
            <h2 className="text-2xl font-xl">To import</h2>
            <ol className="list-decimal list-inside w-full break-words">
                <li>locate your Genshin instalation folder</li>
                <li>
                    Go to this path:
                    <ul className="list-inside pl-2">
                        <li className="text-sm text-electro-5star-from break-words">
                            {
                                "Genshin Impact/Genshin Impact game/GenshinImpact_Data/webCaches/2.25.0.0/Cache/Cache_Data"
                            }
                        </li>
                    </ul>
                </li>
                <li>Open Genshin Impact</li>
                <li>Open your Wish History</li>
                <li>
                    Let the history load, then&nbsp;
                    <span className="text-red-500 font-bold">
                        close the game
                    </span>
                </li>
                <li>
                    Open this file in the previously found Cache_Data
                    folder&nbsp;
                    <span className="font-bold text-electro-5star-from">
                        data_2
                    </span>
                    &nbsp;in Notepad/VS Code
                </li>
                <li>
                    Look for this text&nbsp;
                    <span className="text-electro-5star-from">
                        e20190909gacha-v2
                    </span>
                </li>
                <li>
                    Copy the text starting from&nbsp;
                    <span className="text-electro-5star-from">
                        https://gs.hoyoverse.com/genshin/event/e20190909gacha-v2
                    </span>
                    &nbsp;to&nbsp;
                    <span className="text-electro-5star-from">
                        game_biz=hk4e_global (this should be included)
                    </span>
                </li>
                <li>
                    The link should look like&nbsp;
                    <span className="text-electro-5star-from">
                        https://gs.hoyoverse.com/genshin/event/....game_biz=hk4e_global
                    </span>
                </li>
                <li>Paste it in the link field</li>
            </ol>
        </div>
    );
}
