import Link from "next/link";

export default function WishFAQ() {
    return (
        <>
            <h2 className="text-2xl">FAQ</h2>
            <section>
                <h3 className="text-xl font-bold">How does the import work?</h3>
                <p className="text-electro-50/90">
                    When you open on your device the game and inspect your wish
                    history a temporary auth token is generated. This token is
                    then used to make requests to Hoyo's API. This API returns
                    paginated data in JSON format. Electro Mains does the same
                    thing, except we make requests from our server and then
                    store the data under your account. The token is then stored
                    for a short period of time in our&nbsp;
                    <Link
                        href="https://github.com/roivasxxx/genshin-helper-app/blob/master/payloadcms/src/agenda.ts"
                        className="text-electro-5star-from"
                    >
                        job processing queue.&nbsp;
                    </Link>
                    <p className="text-red-500">
                        {
                            "The token is later cleared (it also expires after some time)."
                        }
                    </p>
                </p>
            </section>
            <section>
                <h3 className="text-xl font-bold">Can I get banned?</h3>
                <p className="text-electro-50/90">
                    We are doing the same thing Hoyo and other wish history apps
                    do. There is nothing shady going on in the background. No
                    game files are being modified. So it should be completely
                    safe. However this may change in the future. We will notify
                    you if that is the case.
                </p>
            </section>
            <section>
                <h3 className="text-xl font-bold">
                    Can my account be hacked this way?
                </h3>
                <p className="text-electro-50/90">
                    No. We do not use any of your sensitive information, so a
                    hack should not be possible. You can also check the app
                    code&nbsp;
                    <Link
                        href="https://github.com/roivasxxx/genshin-helper-app/blob/master/payloadcms/src/api/wishes/importer.ts"
                        className="text-electro-5star-from"
                    >
                        on our Github repo.
                    </Link>
                </p>
            </section>
            <section>
                <h3 className="text-xl font-bold">
                    What if I have multiple accounts?
                </h3>
                <p className="text-electro-50/90">
                    Each Genshin Account acts as a separate entity on Electro
                    Mains. So it's up to you to create multiple accounts - each
                    for your real Genshin account. Each one of these accounts
                    will have their own wish history.
                </p>
            </section>
        </>
    );
}
