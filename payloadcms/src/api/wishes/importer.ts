import axios from "axios";
import { HOYO_WISH_API_URL, WISH_BANNER_CODES } from "../../constants";
import { normalizeName, sleep } from "../../utils";
import { GenshinAcountWishInfo } from "../../../types/types";
const fs: typeof import("fs").promises = require("fs").promises;
// import GenshinData from "genshin-data";
// import payload from "payload";
// import genshindb, { Character } from "genshin-db";
export const wishImporter = async (
    authedLink: string,
    wishInfo: GenshinAcountWishInfo
) => {
    const originalUrl = new URL(authedLink);
    const searchParams = originalUrl.searchParams;

    const newUrl = new URL(HOYO_WISH_API_URL);
    newUrl.search = searchParams.toString();

    const history = await getHistory(
        newUrl,
        WISH_BANNER_CODES.CHARACTER,
        wishInfo.character.lastId
    );
    // TODO: this needs to be supplied as function params!!
    let counter4Star = 0;
    let counter5Star = 0;

    history.forEach((el, index) => {
        counter4Star++;
        counter5Star++;
        let pity = 1;
        if (el.rank_type === "4") {
            pity = counter4Star;
            counter4Star = 0;
        } else if (el.rank_type === "5") {
            pity = counter5Star;
            counter5Star = 0;
        }
        history[index] = {
            ...el,
            pity,
            rank_type: Number.parseInt(el.rank_type),
            item: normalizeName(el.name),
        };
    });
    // await fs.writeFile("history2.json", JSON.stringify({ history }));
};

// push to wishes, if lastId saved in DB is encountered, stop pushing, return true => should stop fetching wishes
// null = no lastId in db
const pushToWishHistory = (
    wishes: any[],
    newWishes: any[],
    lastId: string | null
) => {
    for (let i = 0; i < newWishes.length; i++) {
        const wish = newWishes[i];
        if (lastId && lastId === wish.id) {
            return true;
        }
        wishes.unshift(wish);
    }
    return false;
};

const getHistory = async (
    url: URL,
    bannerCode: WISH_BANNER_CODES,
    lastId: string | null
) => {
    url.searchParams.set("gacha_type", String(bannerCode));
    url.searchParams.set("size", "20");
    try {
        // initial request
        const wishes = [];
        console.log(url.href);
        const req = await axios.get(url.href);
        const result = req.data;
        // docs should be null
        if (!result.data || result.retcode === -101) {
            throw new Error("Invalid link provided");
        }

        if (pushToWishHistory(wishes, result.data.list, lastId)) {
            // if lastId is found, stop fetching, return wishes
            return wishes;
        }
        // use this as the end_id
        let endId = wishes[0]?.id;
        console.log(endId);
        while (endId) {
            // sleep for 1 second to avoid timeout
            await sleep(1000);
            console.log("running with end_id=", endId);
            url.searchParams.set("end_id", endId);
            const req = await axios.get(url.href);
            const result = req.data;
            if (!result.data || result.retcode === -101) {
                throw new Error("Invalid link provided");
            }
            const resultData = result.data.list;
            if (pushToWishHistory(wishes, resultData, lastId)) {
                break;
            }
            endId = resultData.length === 0 ? "" : wishes[0]?.id;
        }
        return wishes;
    } catch (error) {
        console.error("error", error);
        return [];
    }
};

// {
//   id: 22020201,
//   monsterId: 22020201,
//   name: 'Abyss Herald: Frost Fall',
//   specialNames: [
//     'Wynfled',    'Geilamir',
//     'Giselhardt', 'Heimwart',
//     'Haidrich',   'Ariowaldus',
//     'Ingemar',    'Kunnwulf',
//     'Graobert',   'Francobert'
//   ],
//   monsterType: 'MONSTER_ORDINARY',
//   enemyType: 'ELITE',
//   categoryType: 'CODEX_SUBTYPE_ABYSS',
//   categoryText: 'The Abyss',
//   description: 'A monster from the Abyss Order that wields frigid, icy blades in battle.\n' +
//     'Just as there are saints who will spread and glorify the profound gospel, there are envoys who must correct any twisted strains and remove any dissonance.\n' +
//     'People often say that steel feels like ice as it pierces the body, but this dark frost is said to freeze even the soul.',
//   rewardPreview: [],
//   images: { filename_icon: 'UI_MonsterIcon_Invoker_Herald_Ice' },
//   stats: [Function (anonymous)],
//   version: '3.5'
// }

export const test = async (link: string) => {
    await wishImporter(link, { character: null, weapon: null, standard: null });
    // const ordinary = genshindb.enemies("common", { matchCategories: true });
    // const boss = genshindb.enemies("boss", { matchCategories: true });
    // const elite = genshindb.enemies("elite", { matchCategories: true });

    // const all = genshindb.enemies("names", { matchCategories: true });
    // console.log(ordinary[0], boss[0], elite[0]);
    // console.log(ordinary.length + boss.length + elite.length, all.length);
    // console.log(elite);
    // let a = true;
    // const nmies = [];
    // const types = {};
    // for (const enemy of all) {
    //     const nmy = genshindb.enemies(enemy, { matchCategories: true });
    //     if (!types[nmy.enemyType]) {
    //         types[nmy.enemyType] = nmy.enemyType;
    //     }
    //     // console.log(normalizeName(nmy.name), images[normalizeName(nmy.name)]);
    //     nmies.push({
    //         name: nmy.name,
    //         _id: normalizeName(nmy.name),
    //         version: nmy.version || "1.0",
    //         type: nmy.enemyType.toLowerCase(),
    //         categoryType: nmy.categoryType,
    //         icon: images[normalizeName(nmy.name)],
    //     });
    // }

    // console.log(nmies.every((el) => el.icon));

    // console.log(Object.keys(types));
    // const genshinData = new GenshinData();
    // const localMats = await genshinData.localMaterials();
    // const mats = localMats.map((mat) => {
    //     return {
    //         name: mat.name,
    //         _id: mat.id,
    //         region: mat.location,
    //         type: "specialty",
    //         icon: images[mat.id],
    //     };
    // });
    // console.log(
    //     mats[0],
    //     mats.every((el) => el.icon)
    // );
    // await fs.writeFile("enemies-db.json", JSON.stringify(nmies));
};

const images = {
    magatsu_mitake_narukami_no_mikoto: "66007a63efed8405c035487e",
    childe: "66007a63efed8405c035487d",
    wooden_shieldwall_mitachurl: "66007974f19249f690d5b740",
    wooden_shield_hilichurl_guard: "66007974f19249f690d5b73f",
    winged_dendroshroom: "66007974f19249f690d5b73e",
    wind_operative: "66007974f19249f690d5b73d",
    winged_cryoshroom: "66007974f19249f690d5b73c",
    underwater_patrol_mek: "66007974f19249f690d5b73b",
    whirling_electro_fungus: "66007974f19249f690d5b73a",
    whirling_cryo_fungus: "66007974f19249f690d5b739",
    whirling_pyro_fungus: "66007974f19249f690d5b738",
    unusual_hilichurl: "66007974f19249f690d5b737",
    underwater_survey_mek: "66007974f19249f690d5b736",
    treasure_hoarders_seaman: "66007974f19249f690d5b735",
    treasure_hoarders_pyro_potioneer: "66007974f19249f690d5b734",
    treasure_hoarders_scout: "66007974f19249f690d5b733",
    treasure_hoarders_pugilist: "66007974f19249f690d5b732",
    treasure_hoarders_handyman: "66007974f19249f690d5b731",
    treasure_hoarders_marksman: "66007974f19249f690d5b730",
    treasure_hoarders_hydro_potioneer: "66007974f19249f690d5b72f",
    treasure_hoarders_gravedigger: "66007974f19249f690d5b72e",
    treasure_hoarders_electro_potioneer: "66007974f19249f690d5b72d",
    treasure_hoarders_cryo_potioneer: "66007974f19249f690d5b72c",
    thunderhelm_lawachurl: "66007974f19249f690d5b72b",
    treasure_hoarders_crusher: "66007974f19249f690d5b72a",
    thunder_manifestation: "66007974f19249f690d5b729",
    thundercraven_rifthound: "66007974f19249f690d5b728",
    thundercraven_rifthound_whelp: "66007974f19249f690d5b727",
    tainted_waterspouting_phantasm: "66007974f19249f690d5b726",
    stretchy_pyro_fungus: "66007974f19249f690d5b725",
    tainted_watersplitting_phantasm: "66007974f19249f690d5b724",
    stretchy_geo_fungus: "66007974f19249f690d5b723",
    stretchy_anemo_fungus: "66007974f19249f690d5b722",
    suppression_specialist_mek: "66007974f19249f690d5b721",
    stretchy_electro_fungus: "66007974f19249f690d5b720",
    stonehide_lawachurl: "66007974f19249f690d5b71f",
    shadowy_husk_standard_bearer: "66007974f19249f690d5b71e",
    stormterror: "66007974f19249f690d5b71d",
    sternshield_crab: "66007974f19249f690d5b71c",
    shadowy_husk_line_breaker: "66007974f19249f690d5b71b",
    shatterstone_breacher_primus: "66007974f19249f690d5b71a",
    setekh_wenut: "66007974f19249f690d5b719",
    shouki_no_kami_the_prodigal: "66007974f19249f690d5b718",
    shadowy_husk_defender: "66007974f19249f690d5b717",
    ruin_serpent: "66007974f19249f690d5b716",
    ruin_hunter: "66007974f19249f690d5b715",
    ruin_scout: "66007974f19249f690d5b714",
    ruin_guard: "66007974f19249f690d5b713",
    ruin_grader: "66007974f19249f690d5b712",
    ruin_drake_skywatch: "66007974f19249f690d5b711",
    ruin_drake_earthguard: "66007974f19249f690d5b710",
    ruin_destroyer: "66007974f19249f690d5b70f",
    ruin_defender: "66007974f19249f690d5b70e",
    rock_shield_hilichurl_guard: "66007974f19249f690d5b70d",
    ruin_cruiser: "66007974f19249f690d5b70c",
    rimebiter_bathysmal_vishap: "66007974f19249f690d5b70b",
    rockfond_rifthound_whelp: "66007974f19249f690d5b70a",
    rockfond_rifthound: "66007974f19249f690d5b708",
    rock_shieldwall_mitachurl: "66007974f19249f690d5b707",
    pyro_whopperflower: "66007974f19249f690d5b706",
    recon_log_mek: "66007974f19249f690d5b705",
    pyro_specter: "66007974f19249f690d5b704",
    pyro_regisvine: "66007974f19249f690d5b703",
    pyro_hypostasis: "66007974f19249f690d5b702",
    pyro_slime: "66007974f19249f690d5b701",
    millennial_pearl_seahorse: "66007974f19249f690d5b700",
    mirror_maiden: "66007974f19249f690d5b6ff",
    maguu_kenki_galloping_frost: "66007974f19249f690d5b6fe",
    hydro_mimic_frog: "66007974f19249f690d5b6fd",
    maguu_kenki_lone_gale: "66007974f19249f690d5b6fc",
    pyro_hilichurl_shooter: "66007974f19249f690d5b6fb",
    primordial_bathysmal_vishap: "66007974f19249f690d5b6fa",
    pyro_abyss_mage: "66007974f19249f690d5b6f9",
    primo_geovishap: "66007974f19249f690d5b6f8",
    primal_construct_reshaper: "66007974f19249f690d5b6f7",
    primal_construct_repulsor: "66007974f19249f690d5b6f6",
    perpetual_mechanical_array: "66007974f19249f690d5b6f5",
    overgrown_breacher_primus: "66007974f19249f690d5b6f4",
    primal_construct_prospector: "66007974f19249f690d5b6f3",
    oceanid: "66007974f19249f690d5b6f2",
    nobushi_jintouban: "66007974f19249f690d5b6f1",
    nobushi_kikouban: "66007974f19249f690d5b6f0",
    la_signora: "66007974f19249f690d5b6ef",
    nobushi_hitsukeban: "66007974f19249f690d5b6ee",
    large_shatterstone_breacher_primus: "66007974f19249f690d5b6ed",
    mutant_electro_slime: "66007974f19249f690d5b6ec",
    large_electro_slime: "66007974f19249f690d5b6eb",
    nimble_harvester_mek: "66007974f19249f690d5b6ea",
    lupus_boreas_dominator_of_wolves: "66007974f19249f690d5b6e9",
    large_dendro_slime: "66007974f19249f690d5b6e8",
    large_pyro_slime: "66007974f19249f690d5b6e7",
    maguu_kenki: "66007974f19249f690d5b6e6",
    large_anemo_slime: "66007974f19249f690d5b6e5",
    hydro_cicin: "66007974f19249f690d5b6e4",
    large_overgrown_breacher_primus: "66007974f19249f690d5b6e3",
    jadeplume_terrorshroom: "66007974f19249f690d5b6e2",
    hydro_mimic_crane: "66007974f19249f690d5b6e1",
    large_hydro_slime: "66007974f19249f690d5b6e0",
    hydro_mimic_mallard: "66007974f19249f690d5b6df",
    large_geo_slime: "66007974f19249f690d5b6de",
    kairagi_fiery_might: "66007974f19249f690d5b6dd",
    iniquitous_baptist: "66007974f19249f690d5b6dc",
    ice_shield_hilichurl_guard: "66007974f19249f690d5b6db",
    large_cryo_slime: "66007974f19249f690d5b6da",
    hydro_mimic_crab: "66007974f19249f690d5b6d9",
    hydro_mimic_boar: "66007974f19249f690d5b6d8",
    kairagi_dancing_thunder: "66007974f19249f690d5b6d7",
    ice_shieldwall_mitachurl: "66007974f19249f690d5b6d6",
    hydro_mimic_finch: "66007974f19249f690d5b6d5",
    hydro_tulpa: "66007974f19249f690d5b6d4",
    icewind_suite: "66007974f19249f690d5b6d3",
    hydro_specter: "66007974f19249f690d5b6d2",
    hydro_hypostasis: "66007974f19249f690d5b6d1",
    hydro_slime: "66007974f19249f690d5b6d0",
    hydro_samachurl: "66007974f19249f690d5b6cf",
    hydro_mimic_raptor: "66007974f19249f690d5b6ce",
    hydro_mimic_squirrel: "66007974f19249f690d5b6cd",
    hydro_abyss_mage: "66007974f19249f690d5b6cc",
    hydro_hilichurl_rogue: "66007974f19249f690d5b6cb",
    hunters_ray: "66007974f19249f690d5b6ca",
    hilichurl: "66007974f19249f690d5b6c9",
    hilichurl_shooter: "66007974f19249f690d5b6c8",
    hilichurl_grenadier: "66007974f19249f690d5b6c7",
    hilichurl_fighter: "66007974f19249f690d5b6c6",
    geo_hypostasis: "66007974f19249f690d5b6c5",
    hilichurl_berserker: "66007974f19249f690d5b6c4",
    hilichurl_chieftain: "66007974f19249f690d5b6c3",
    grounded_hydroshroom: "66007974f19249f690d5b6c2",
    guardian_of_apeps_oasis: "66007974f19249f690d5b6c1",
    hat_jellyfish: "66007974f19249f690d5b6c0",
    grounded_geoshroom: "66007974f19249f690d5b6bf",
    golden_wolflord: "66007974f19249f690d5b6be",
    geo_slime: "66007974f19249f690d5b6bd",
    geovishap_hatchling: "66007974f19249f690d5b6bc",
    geo_specter: "66007974f19249f690d5b6bb",
    fatui_skirmisher_pyroslinger_bracer: "66007974f19249f690d5b6ba",
    geo_samachurl: "66007974f19249f690d5b6b9",
    frostarm_lawachurl: "66007974f19249f690d5b6b8",
    geovishap: "66007974f19249f690d5b6b7",
    frost_operative: "66007974f19249f690d5b6b6",
    floating_dendro_fungus: "66007974f19249f690d5b6b5",
    geological_survey_mek: "66007974f19249f690d5b6b4",
    floating_anemo_fungus: "66007974f19249f690d5b6b3",
    fatui_skirmisher_hydrogunner_legionnaire: "66007974f19249f690d5b6b2",
    floating_hydro_fungus: "66007974f19249f690d5b6b1",
    fatui_skirmisher_geochanter_bracer: "66007974f19249f690d5b6b0",
    fatui_skirmisher_electrohammer_vanguard: "66007974f19249f690d5b6af",
    fatui_pyro_agent: "66007974f19249f690d5b6ae",
    fatui_skirmisher_cryogunner_legionnaire: "66007974f19249f690d5b6ad",
    fatui_skirmisher_anemoboxer_vanguard: "66007974f19249f690d5b6ac",
    fatui_electro_cicin_mage: "66007974f19249f690d5b6ab",
    fatui_cryo_cicin_mage: "66007974f19249f690d5b6aa",
    eremite_stone_enchanter: "66007974f19249f690d5b6a9",
    eye_of_the_storm: "66007974f19249f690d5b6a8",
    eremite_daythunder: "66007974f19249f690d5b6a7",
    eremite_sunfrost: "66007974f19249f690d5b6a6",
    experimental_field_generator: "66007974f19249f690d5b6a5",
    eremite_floral_ringdancer: "66007974f19249f690d5b6a4",
    eremite_sworddancer: "66007974f19249f690d5b6a3",
    eremite_ravenbeak_halberdier: "66007974f19249f690d5b6a2",
    eremite_scorching_loremaster: "66007974f19249f690d5b6a1",
    eremite_galehunter: "66007974f19249f690d5b6a0",
    eremite_linebreaker: "66007974f19249f690d5b69f",
    eremite_desert_clearwater: "66007974f19249f690d5b69e",
    eremite_crossbow: "66007974f19249f690d5b69d",
    eremite_axe_vanguard: "66007974f19249f690d5b69c",
    electro_whopperflower: "66007974f19249f690d5b69b",
    emperor_of_fire_and_iron: "66007974f19249f690d5b69a",
    electro_samachurl: "66007974f19249f690d5b699",
    electro_specter: "66007974f19249f690d5b698",
    electro_slime: "66007974f19249f690d5b697",
    electro_hilichurl_shooter: "66007974f19249f690d5b696",
    electro_hilichurl_grenadier: "66007974f19249f690d5b695",
    electro_hypostasis: "66007974f19249f690d5b694",
    electro_regisvine: "66007974f19249f690d5b693",
    dendro_specter: "66007974f19249f690d5b692",
    electro_abyss_mage: "66007974f19249f690d5b691",
    electro_cicin: "66007974f19249f690d5b690",
    dendro_hypostasis: "66007974f19249f690d5b68f",
    cryo_whopperflower: "66007974f19249f690d5b68e",
    dendro_slime: "66007974f19249f690d5b68d",
    deepwater_assault_mek: "66007974f19249f690d5b68c",
    dendro_samachurl: "66007974f19249f690d5b68b",
    cryo_slime: "66007974f19249f690d5b68a",
    cryo_samachurl: "66007974f19249f690d5b689",
    cryo_specter: "66007974f19249f690d5b688",
    cryo_regisvine: "66007974f19249f690d5b687",
    cryo_hypostasis: "66007974f19249f690d5b686",
    cryo_hilichurl_shooter: "66007974f19249f690d5b685",
    cryo_hilichurl_grenadier: "66007974f19249f690d5b684",
    cryo_cicin: "66007974f19249f690d5b683",
    consecrated_fanged_beast: "66007974f19249f690d5b682",
    cryo_abyss_mage: "66007974f19249f690d5b681",
    crackling_axe_mitachurl: "66007974f19249f690d5b680",
    construction_specialist_mek: "66007974f19249f690d5b67f",
    consecrated_scorpion: "66007974f19249f690d5b67e",
    consecrated_horned_crocodile: "66007974f19249f690d5b67d",
    consecrated_flying_serpent: "66007974f19249f690d5b67c",
    consecrated_red_vulture: "66007974f19249f690d5b67b",
    cherubic_sea_hare: "66007974f19249f690d5b67a",
    bubbly_seahorse: "66007974f19249f690d5b679",
    alldevouring_narwhal: "66007974f19249f690d5b677",
    anemo_slime: "66007974f19249f690d5b676",
    anemo_hypostasis: "66007974f19249f690d5b675",
    bolteater_bathysmal_vishap: "66007974f19249f690d5b674",
    bubbler_seahorse: "66007974f19249f690d5b673",
    anemo_samachurl: "66007974f19249f690d5b672",
    black_serpent_knight_windcutter: "66007974f19249f690d5b671",
    blazing_axe_mitachurl: "66007974f19249f690d5b670",
    black_serpent_knight_rockbreaker_ax: "66007974f19249f690d5b66f",
    blubberbeast: "66007974f19249f690d5b66e",
    ball_octopus: "66007974f19249f690d5b66d",
    bathysmal_vishap_herd: "66007974f19249f690d5b66c",
    azhdaha: "66007974f19249f690d5b66b",
    arithmetic_enhancer_mek: "66007974f19249f690d5b66a",
    assault_specialist_mek: "66007974f19249f690d5b669",
    armored_crab: "66007974f19249f690d5b668",
    abyss_lector_violet_lightning: "66007974f19249f690d5b667",
    area_alert_mek: "66007974f19249f690d5b666",
    anemo_specter: "66007974f19249f690d5b665",
    angelic_sea_hare: "66007974f19249f690d5b664",
    abyss_herald_wicked_torrents: "66007974f19249f690d5b663",
    annihilation_specialist_mek: "66007974f19249f690d5b662",
    aeonblight_drake: "66007974f19249f690d5b661",
    algorithm_of_semiintransient_matrix_of_overseer_network:
        "66007974f19249f690d5b660",
    anemo_hilichurl_rogue: "66007974f19249f690d5b65f",
    abyss_lector_fathomless_flames: "66007974f19249f690d5b65e",
    abyss_herald_frost_fall: "66007974f19249f690d5b65d",
};

// const images = {
//     xenochromatic_crystal: "65fc85554958e33ce6e12933",
//     worldspan_fern: "65fc85554958e33ce6e12932",
//     wine_goblet_of_the_pristine_sea: "65fc85554958e33ce6e12931",
//     wolfhook: "65fc85554958e33ce6e12930",
//     windwheel_aster: "65fc85554958e33ce6e1292f",
//     whopperflower_nectar: "65fc85554958e33ce6e1292e",
//     weathered_arrowhead: "65fc85554958e33ce6e1292d",
//     water_that_failed_to_transcend: "65fc85554958e33ce6e1292c",
//     wanderers_blooming_flower: "65fc85554958e33ce6e1292b",
//     wanderers_advice: "65fc85554958e33ce6e1292a",
//     violetgrass: "65fc85554958e33ce6e12929",
//     vayuda_turquoise_sliver: "65fc85554958e33ce6e12928",
//     vayuda_turquoise_gemstone: "65fc85554958e33ce6e12927",
//     vayuda_turquoise_chunk: "65fc85554958e33ce6e12926",
//     vayuda_turquoise_fragment: "65fc85554958e33ce6e12925",
//     varunada_lazurite_sliver: "65fc85554958e33ce6e12924",
//     varunada_lazurite_gemstone: "65fc85554958e33ce6e12923",
//     varunada_lazurite_fragment: "65fc85554958e33ce6e12922",
//     varunada_lazurite_chunk: "65fc85554958e33ce6e12921",
//     valberry: "65fc85554958e33ce6e12920",
//     vajrada_amethyst_sliver: "65fc85554958e33ce6e1291f",
//     vajrada_amethyst_gemstone: "65fc85554958e33ce6e1291e",
//     vajrada_amethyst_fragment: "65fc85554958e33ce6e1291d",
//     vajrada_amethyst_chunk: "65fc85554958e33ce6e1291c",
//     tusk_of_monoceros_caeli: "65fc85554958e33ce6e1291b",
//     turbid_prism: "65fc85554958e33ce6e1291a",
//     trishiraite: "65fc85554958e33ce6e12919",
//     trimmed_red_silk: "65fc85554958e33ce6e12918",
//     treasure_hoarder_insignia: "65fc85554958e33ce6e12917",
//     transoceanic_pearl: "65fc85554958e33ce6e12916",
//     treasured_flower: "65fc85554958e33ce6e12915",
//     tile_of_decarabians_tower: "65fc85554958e33ce6e12914",
//     tourbillon_device: "65fc85554958e33ce6e12913",
//     transoceanic_chunk: "65fc85554958e33ce6e12912",
//     thunderclap_fruitcore: "65fc85554958e33ce6e12911",
//     the_meaning_of_aeons: "65fc85554958e33ce6e12910",
//     teachings_of_resistance: "65fc85554958e33ce6e1290f",
//     tears_of_the_calamitous_god: "65fc85554958e33ce6e1290e",
//     teachings_of_transience: "65fc85554958e33ce6e1290d",
//     teachings_of_prosperity: "65fc85554958e33ce6e1290c",
//     teachings_of_praxis: "65fc85554958e33ce6e1290b",
//     teachings_of_justice: "65fc85554958e33ce6e1290a",
//     teachings_of_order: "65fc85554958e33ce6e12909",
//     teachings_of_light: "65fc85554958e33ce6e12908",
//     teachings_of_freedom: "65fc85554958e33ce6e12907",
//     teachings_of_ingenuity: "65fc85554958e33ce6e12906",
//     teachings_of_gold: "65fc85554958e33ce6e12905",
//     teachings_of_equity: "65fc85554958e33ce6e12904",
//     teachings_of_elegance: "65fc85554958e33ce6e12903",
//     teachings_of_diligence: "65fc85554958e33ce6e12902",
//     sturdy_shell: "65fc85554958e33ce6e12901",
//     teachings_of_ballad: "65fc85554958e33ce6e12900",
//     teachings_of_admonition: "65fc85554958e33ce6e128ff",
//     sturdy_bone_shard: "65fc85554958e33ce6e128fe",
//     sublimation_of_pure_sacred_dewdrop: "65fc85554958e33ce6e128fd",
//     spring_of_the_first_dewdrop: "65fc85554958e33ce6e128fc",
//     tail_of_boreas: "65fc85554958e33ce6e128fb",
//     storm_beads: "65fc85554958e33ce6e128fa",
//     stained_mask: "65fc85554958e33ce6e128f9",
//     subdetection_unit: "65fc85554958e33ce6e128f8",
//     starconch: "65fc85554958e33ce6e128f7",
//     spring_of_pure_sacred_dewdrop: "65fc85554958e33ce6e128f6",
//     spirit_locket_of_boreas: "65fc85554958e33ce6e128f5",
//     spectral_nucleus: "65fc85554958e33ce6e128f4",
//     spectral_husk: "65fc85554958e33ce6e128f3",
//     silver_talisman_of_the_forest_dew: "65fc85554958e33ce6e128f2",
//     smoldering_pearl: "65fc85554958e33ce6e128f1",
//     spectral_heart: "65fc85554958e33ce6e128f0",
//     small_lamp_grass: "65fc85554958e33ce6e128ef",
//     slime_condensate: "65fc85554958e33ce6e128ee",
//     slime_secretions: "65fc85554958e33ce6e128ed",
//     silver_goblet_of_the_pristine_sea: "65fc85554958e33ce6e128ec",
//     slime_concentrate: "65fc85554958e33ce6e128eb",
//     silver_raven_insignia: "65fc85554958e33ce6e128ea",
//     silk_flower: "65fc85554958e33ce6e128e9",
//     shivada_jade_gemstone: "65fc85554958e33ce6e128e8",
//     shivada_jade_sliver: "65fc85554958e33ce6e128e7",
//     sharp_arrowhead: "65fc85554958e33ce6e128e6",
//     shivada_jade_fragment: "65fc85554958e33ce6e128e5",
//     shard_of_a_foul_legacy: "65fc85554958e33ce6e128e4",
//     shivada_jade_chunk: "65fc85554958e33ce6e128e3",
//     shimmering_nectar: "65fc85554958e33ce6e128e2",
//     shadow_of_the_warrior: "65fc85554958e33ce6e128e1",
//     shackles_of_the_dandelion_gladiator: "65fc85554958e33ce6e128e0",
//     sealed_scroll: "65fc85554958e33ce6e128df",
//     sergeants_insignia: "65fc85554958e33ce6e128de",
//     scattered_piece_of_decarabians_dream: "65fc85554958e33ce6e128dd",
//     sea_ganoderma: "65fc85554958e33ce6e128dc",
//     scarab: "65fc85554958e33ce6e128db",
//     scoop_of_tainted_water: "65fc85554958e33ce6e128da",
//     sakura_bloom: "65fc85554958e33ce6e128d9",
//     sango_pearl: "65fc85554958e33ce6e128d8",
//     sand_grease_pupa: "65fc85554958e33ce6e128d7",
//     romaritime_flower: "65fc85554958e33ce6e128d6",
//     runic_fang: "65fc85554958e33ce6e128d5",
//     robust_fungal_nucleus: "65fc85554958e33ce6e128d4",
//     rukkhashava_mushrooms: "65fc85554958e33ce6e128d3",
//     ring_of_boreas: "65fc85554958e33ce6e128d2",
//     rift_core: "65fc85554958e33ce6e128d1",
//     riftborn_regalia: "65fc85554958e33ce6e128d0",
//     rich_red_brocade: "65fc85554958e33ce6e128cf",
//     relic_from_guyun: "65fc85554958e33ce6e128ce",
//     remnant_glow_of_scorching_might: "65fc85554958e33ce6e128cd",
//     rainbow_rose: "65fc85554958e33ce6e128cc",
//     recruits_insignia: "65fc85554958e33ce6e128cb",
//     radiant_prism: "65fc85554958e33ce6e128ca",
//     quelled_creeper: "65fc85554958e33ce6e128c9",
//     qingxin: "65fc85554958e33ce6e128c8",
//     pseudostamens: "65fc85554958e33ce6e128c7",
//     puppet_strings: "65fc85554958e33ce6e128c6",
//     prithiva_topaz_sliver: "65fc85554958e33ce6e128c5",
//     prithiva_topaz_gemstone: "65fc85554958e33ce6e128c4",
//     prithiva_topaz_chunk: "65fc85554958e33ce6e128c3",
//     prithiva_topaz_fragment: "65fc85554958e33ce6e128c2",
//     primordial_greenbloom: "65fc85554958e33ce6e128c1",
//     piece_of_aerosiderite: "65fc85554958e33ce6e128c0",
//     polarizing_prism: "65fc85554958e33ce6e128bf",
//     philosophies_of_resistance: "65fc85554958e33ce6e128be",
//     philosophies_of_transience: "65fc85554958e33ce6e128bd",
//     philosophies_of_praxis: "65fc85554958e33ce6e128bc",
//     philosophies_of_prosperity: "65fc85554958e33ce6e128bb",
//     philosophies_of_order: "65fc85554958e33ce6e128ba",
//     philosophies_of_light: "65fc85554958e33ce6e128b9",
//     philosophies_of_justice: "65fc85554958e33ce6e128b8",
//     philosophies_of_ingenuity: "65fc85554958e33ce6e128b7",
//     philosophies_of_gold: "65fc85554958e33ce6e128b6",
//     philosophies_of_freedom: "65fc85554958e33ce6e128b5",
//     philosophies_of_equity: "65fc85554958e33ce6e128b4",
//     philosophies_of_diligence: "65fc85554958e33ce6e128b3",
//     philosophies_of_elegance: "65fc85554958e33ce6e128b2",
//     philosophies_of_ballad: "65fc85554958e33ce6e128b1",
//     philosophies_of_admonition: "65fc85554958e33ce6e128b0",
//     perpetual_heart: "65fc85554958e33ce6e128af",
//     perpetual_caliber: "65fc85554958e33ce6e128ae",
//     philanemo_mushroom: "65fc85554958e33ce6e128ad",
//     operatives_constancy: "65fc85554958e33ce6e128ac",
//     operatives_standard_pocket_watch: "65fc85554958e33ce6e128ab",
//     padisarah: "65fc85554958e33ce6e128aa",
//     old_operatives_pocket_watch: "65fc85554958e33ce6e128a9",
//     ominous_mask: "65fc85554958e33ce6e128a8",
//     onikabuto: "65fc85554958e33ce6e128a7",
//     old_handguard: "65fc85554958e33ce6e128a6",
//     oasis_gardens_truth: "65fc85554958e33ce6e128a5",
//     oasis_gardens_reminiscence: "65fc85554958e33ce6e128a4",
//     olden_days_of_scorching_might: "65fc85554958e33ce6e128a3",
//     noctilucous_jade: "65fc85554958e33ce6e128a2",
//     oasis_gardens_mourning: "65fc85554958e33ce6e128a1",
//     nilotpala_lotus: "65fc85554958e33ce6e128a0",
//     oasis_gardens_kindness: "65fc85554958e33ce6e1289f",
//     narukamis_wisdom: "65fc85554958e33ce6e1289e",
//     newborn_tainted_hydro_phantasm: "65fc85554958e33ce6e1289d",
//     narukamis_valor: "65fc85554958e33ce6e1289c",
//     narukamis_affection: "65fc85554958e33ce6e1289b",
//     nagadus_emerald_sliver: "65fc85554958e33ce6e1289a",
//     narukamis_joy: "65fc85554958e33ce6e12899",
//     nagadus_emerald_gemstone: "65fc85554958e33ce6e12898",
//     naku_weed: "65fc85554958e33ce6e12897",
//     nagadus_emerald_chunk: "65fc85554958e33ce6e12896",
//     nagadus_emerald_fragment: "65fc85554958e33ce6e12895",
//     mystic_enhancement_ore: "65fc85554958e33ce6e12894",
//     mudra_of_the_malefic_general: "65fc85554958e33ce6e12893",
//     movement_of_an_ancient_chord: "65fc85554958e33ce6e12892",
//     mourning_flower: "65fc85554958e33ce6e12891",
//     mora: "65fc85554958e33ce6e12890",
//     mist_veiled_primo_elixir: "65fc85554958e33ce6e1288f",
//     molten_moment: "65fc85554958e33ce6e1288e",
//     mist_veiled_lead_elixir: "65fc85554958e33ce6e1288d",
//     mist_veiled_mercury_elixir: "65fc85554958e33ce6e1288c",
//     mist_veiled_gold_elixir: "65fc85554958e33ce6e1288b",
//     mist_grass_wick: "65fc85554958e33ce6e1288a",
//     mechanical_spur_gear: "65fc85554958e33ce6e12889",
//     meshing_gear: "65fc85554958e33ce6e12888",
//     mist_grass_pollen: "65fc85554958e33ce6e12887",
//     mist_grass: "65fc85554958e33ce6e12886",
//     mirror_of_mushin: "65fc85554958e33ce6e12885",
//     mask_of_the_wicked_lieutenant: "65fc85554958e33ce6e12884",
//     mask_of_the_onehorned: "65fc85554958e33ce6e12883",
//     marionette_core: "65fc85554958e33ce6e12882",
//     mask_of_the_tigers_bite: "65fc85554958e33ce6e12881",
//     mask_of_the_kijin: "65fc85554958e33ce6e12880",
//     majestic_hooked_beak: "65fc85554958e33ce6e1287f",
//     marked_shell: "65fc85554958e33ce6e1287e",
//     lustrous_stone_from_guyun: "65fc85554958e33ce6e1287d",
//     lunar_fin: "65fc85554958e33ce6e1287c",
//     lumitoile: "65fc85554958e33ce6e1287b",
//     luminous_sands_from_guyun: "65fc85554958e33ce6e1287a",
//     luminescent_pollen: "65fc85554958e33ce6e12879",
//     lumidouce_bell: "65fc85554958e33ce6e12878",
//     light_guiding_tetrahedron: "65fc85554958e33ce6e12877",
//     lightless_silk_string: "65fc85554958e33ce6e12876",
//     lightless_mass: "65fc85554958e33ce6e12875",
//     lightning_prism: "65fc85554958e33ce6e12874",
//     lightless_eye_of_the_maelstrom: "65fc85554958e33ce6e12873",
//     lieutenants_insignia: "65fc85554958e33ce6e12872",
//     ley_line_sprout: "65fc85554958e33ce6e12871",
//     lakelight_lily: "65fc85554958e33ce6e12870",
//     guide_to_gold: "65fc85554958e33ce6e1286f",
//     kalpalata_lotus: "65fc85554958e33ce6e1286e",
//     kageuchi_handguard: "65fc85554958e33ce6e1286d",
//     juvenile_jade: "65fc85554958e33ce6e1286c",
//     jueyun_chili: "65fc85554958e33ce6e1286b",
//     jeweled_branch_of_a_distant_sea: "65fc85554958e33ce6e1286a",
//     inspectors_sacrificial_knife: "65fc85554958e33ce6e12869",
//     jade_branch_of_a_distant_sea: "65fc85554958e33ce6e12868",
//     iron_talisman_of_the_forest_dew: "65fc85554958e33ce6e12867",
//     inactivated_fungal_nucleus: "65fc85554958e33ce6e12866",
//     guide_to_freedom: "65fc85554958e33ce6e12865",
//     guide_to_equity: "65fc85554958e33ce6e12864",
//     hurricane_seed: "65fc85554958e33ce6e12863",
//     grain_of_aerosiderite: "65fc85554958e33ce6e12862",
//     hunters_sacrificial_knife: "65fc85554958e33ce6e12861",
//     guide_to_resistance: "65fc85554958e33ce6e12860",
//     hoarfrost_core: "65fc85554958e33ce6e1285f",
//     heavy_horn: "65fc85554958e33ce6e1285e",
//     henna_berry: "65fc85554958e33ce6e1285d",
//     heros_wit: "65fc85554958e33ce6e1285c",
//     guide_to_diligence: "65fc85554958e33ce6e1285b",
//     guide_to_transience: "65fc85554958e33ce6e1285a",
//     hellfire_butterfly: "65fc85554958e33ce6e12859",
//     golden_talisman_of_the_forest_dew: "65fc85554958e33ce6e12858",
//     guide_to_prosperity: "65fc85554958e33ce6e12857",
//     guide_to_elegance: "65fc85554958e33ce6e12856",
//     guide_to_ballad: "65fc85554958e33ce6e12855",
//     guide_to_praxis: "65fc85554958e33ce6e12854",
//     guide_to_order: "65fc85554958e33ce6e12853",
//     guide_to_light: "65fc85554958e33ce6e12852",
//     guide_to_justice: "65fc85554958e33ce6e12851",
//     guide_to_ingenuity: "65fc85554958e33ce6e12850",
//     guide_to_admonition: "65fc85554958e33ce6e1284f",
//     golden_goblet_of_the_pristine_sea: "65fc85554958e33ce6e1284e",
//     golden_raven_insignia: "65fc85554958e33ce6e1284d",
//     famed_handguard: "65fc85554958e33ce6e1284c",
//     golden_branch_of_a_distant_sea: "65fc85554958e33ce6e1284b",
//     dvalins_sigh: "65fc85554958e33ce6e1284a",
//     gloomy_statuette: "65fc85554958e33ce6e12849",
//     echo_of_scorching_might: "65fc85554958e33ce6e12848",
//     glaze_lily: "65fc85554958e33ce6e12847",
//     gilded_scale: "65fc85554958e33ce6e12846",
//     fragment_of_decarabians_epic: "65fc85554958e33ce6e12845",
//     fungal_spores: "65fc85554958e33ce6e12844",
//     energy_nectar: "65fc85554958e33ce6e12843",
//     dross_of_pure_sacred_dewdrop: "65fc85554958e33ce6e12842",
//     evergloom_ring: "65fc85554958e33ce6e12841",
//     fragment_of_an_ancient_chord: "65fc85554958e33ce6e12840",
//     fragile_bone_shard: "65fc85554958e33ce6e1283f",
//     fossilized_bone_shard: "65fc85554958e33ce6e1283e",
//     fontemer_unihorn: "65fc85554958e33ce6e1283d",
//     forbidden_curse_scroll: "65fc85554958e33ce6e1283c",
//     firm_arrowhead: "65fc85554958e33ce6e1283b",
//     foreign_synapse: "65fc85554958e33ce6e1283a",
//     fluorescent_fungus: "65fc85554958e33ce6e12839",
//     fine_enhancement_ore: "65fc85554958e33ce6e12838",
//     echo_of_an_ancient_chord: "65fc85554958e33ce6e12837",
//     dragonheirs_false_fin: "65fc85554958e33ce6e12836",
//     faded_red_satin: "65fc85554958e33ce6e12835",
//     feathery_fin: "65fc85554958e33ce6e12834",
//     fetters_of_the_dandelion_gladiator: "65fc85554958e33ce6e12833",
//     dvalins_plume: "65fc85554958e33ce6e12832",
//     emperors_resolution: "65fc85554958e33ce6e12831",
//     enhancement_ore: "65fc85554958e33ce6e12830",
//     essence_of_pure_sacred_dewdrop: "65fc85554958e33ce6e1282f",
//     everflame_seed: "65fc85554958e33ce6e1282e",
//     everamber: "65fc85554958e33ce6e1282d",
//     drop_of_tainted_water: "65fc85554958e33ce6e1282c",
//     dvalins_claw: "65fc85554958e33ce6e1282b",
//     dream_of_the_dandelion_gladiator: "65fc85554958e33ce6e1282a",
//     dragon_lords_crown: "65fc85554958e33ce6e12829",
//     dream_of_scorching_might: "65fc85554958e33ce6e12828",
//     divine_body_from_guyun: "65fc85554958e33ce6e12827",
//     dormant_fungal_nucleus: "65fc85554958e33ce6e12826",
//     divining_scroll: "65fc85554958e33ce6e12825",
//     dismal_prism: "65fc85554958e33ce6e12824",
//     dendrobium: "65fc85554958e33ce6e12823",
//     dew_of_repudiation: "65fc85554958e33ce6e12822",
//     desiccated_shell: "65fc85554958e33ce6e12821",
//     dead_ley_line_leaves: "65fc85554958e33ce6e12820",
//     debris_of_decarabians_city: "65fc85554958e33ce6e1281f",
//     deathly_statuette: "65fc85554958e33ce6e1281e",
//     dead_ley_line_branch: "65fc85554958e33ce6e1281d",
//     dark_statuette: "65fc85554958e33ce6e1281c",
//     damaged_prism: "65fc85554958e33ce6e1281b",
//     dandelion_seed: "65fc85554958e33ce6e1281a",
//     damaged_mask: "65fc85554958e33ce6e12819",
//     crystal_prism: "65fc85554958e33ce6e12818",
//     dakas_bell: "65fc85554958e33ce6e12817",
//     crystal_marrow: "65fc85554958e33ce6e12816",
//     crystalline_cyst_dust: "65fc85554958e33ce6e12815",
//     cor_lapis: "65fc85554958e33ce6e12814",
//     crystalline_bloom: "65fc85554958e33ce6e12813",
//     copper_talisman_of_the_forest_dew: "65fc85554958e33ce6e12812",
//     crown_of_insight: "65fc85554958e33ce6e12811",
//     coral_branch_of_a_distant_sea: "65fc85554958e33ce6e12810",
//     concealed_talon: "65fc85554958e33ce6e1280f",
//     concealed_unguis: "65fc85554958e33ce6e1280e",
//     concealed_claw: "65fc85554958e33ce6e1280d",
//     clearwater_jade: "65fc85554958e33ce6e1280c",
//     cloudseam_scale: "65fc85554958e33ce6e1280b",
//     chunk_of_aerosiderite: "65fc85554958e33ce6e1280a",
//     cleansing_heart: "65fc85554958e33ce6e12809",
//     chasmlight_fin: "65fc85554958e33ce6e12808",
//     chapter_of_an_ancient_chord: "65fc85554958e33ce6e12807",
//     chaos_storage: "65fc85554958e33ce6e12806",
//     chaos_axis: "65fc85554958e33ce6e12805",
//     agnidus_agate_sliver: "65fc85554958e33ce6e12804",
//     chaos_oculus: "65fc85554958e33ce6e12803",
//     chaos_device: "65fc85554958e33ce6e12802",
//     chaos_module: "65fc85554958e33ce6e12801",
//     chaos_gear: "65fc85554958e33ce6e12800",
//     agents_sacrificial_knife: "65fc85554958e33ce6e127ff",
//     chaos_core: "65fc85554958e33ce6e127fe",
//     agnidus_agate_gemstone: "65fc85554958e33ce6e127fd",
//     chaos_circuit: "65fc85554958e33ce6e127fc",
//     chaos_bolt: "65fc85554958e33ce6e127fb",
//     cecilia: "65fc85554958e33ce6e127fa",
//     chains_of_the_dandelion_gladiator: "65fc85554958e33ce6e127f9",
//     brilliant_diamond_sliver: "65fc85554958e33ce6e127f8",
//     calla_lily: "65fc85554958e33ce6e127f7",
//     broken_goblet_of_the_pristine_sea: "65fc85554958e33ce6e127f6",
//     brilliant_diamond_gemstone: "65fc85554958e33ce6e127f5",
//     brilliant_diamond_fragment: "65fc85554958e33ce6e127f4",
//     brilliant_diamond_chunk: "65fc85554958e33ce6e127f3",
//     boreal_wolfs_nostalgia: "65fc85554958e33ce6e127f2",
//     boreal_wolfs_cracked_tooth: "65fc85554958e33ce6e127f1",
//     boreal_wolfs_milk_tooth: "65fc85554958e33ce6e127f0",
//     black_crystal_horn: "65fc85554958e33ce6e127ef",
//     boreal_wolfs_broken_fang: "65fc85554958e33ce6e127ee",
//     bloodjade_branch: "65fc85554958e33ce6e127ed",
//     basalt_pillar: "65fc85554958e33ce6e127ec",
//     bit_of_aerosiderite: "65fc85554958e33ce6e127eb",
//     beryl_conch: "65fc85554958e33ce6e127ea",
//     black_bronze_horn: "65fc85554958e33ce6e127e9",
//     a_flower_yet_to_bloom: "65fc85554958e33ce6e127e8",
//     agnidus_agate_fragment: "65fc85554958e33ce6e127e7",
//     alien_life_core: "65fc85554958e33ce6e127e6",
//     artificed_spare_clockwork_component_coppelia: "65fc85554958e33ce6e127e5",
//     artificed_dynamic_gear: "65fc85554958e33ce6e127e4",
//     agnidus_agate_chunk: "65fc85554958e33ce6e127e3",
//     artificed_spare_clockwork_component_coppelius: "65fc85554958e33ce6e127e2",
//     adventurers_experience: "65fc85554958e33ce6e127e1",
//     amakumo_fruit: "65fc85554958e33ce6e127e0",
//     ashen_heart: "65fc85554958e33ce6e127df",
// };
