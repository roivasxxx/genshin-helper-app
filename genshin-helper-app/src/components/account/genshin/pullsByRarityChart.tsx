import { STAR_SYMBOL } from "@/utils/constants";
import { useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

export default function PullsByRarityChart(props: {
    total: number;
    fourStarTotal: number;
    fiveStarTotal: number;
}) {
    const { total, fourStarTotal, fiveStarTotal } = props;

    const [focusBar, setFocusBar] = useState<number | null>(null);

    const pieData = useMemo(() => {
        return [
            {
                name: `3 ${STAR_SYMBOL}`,
                value: total - fourStarTotal - fiveStarTotal,
                color: "rgba(125,211,252,0.5)",
                colorActive: "rgba(125,211,252,1)",
            },
            {
                name: `4 ${STAR_SYMBOL}`,
                value: fourStarTotal,
                color: "rgba(210,143,214,0.5)",
                colorActive: "rgba(210,143,214,1)",
            },
            {
                name: `5 ${STAR_SYMBOL}`,
                value: fiveStarTotal,
                color: "rgba(255,177,63,0.5)",
                colorActive: "rgba(255,177,63,1)",
            },
        ];
    }, []);

    const CustomTooltip = ({ active: active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-electro-800 rounded p-2 chart">
                    <p
                        style={{ color: pieData[0].colorActive }}
                    >{`${pieData[0].name} : ${pieData[0].value}`}</p>
                    <p
                        style={{ color: pieData[1].colorActive }}
                    >{`${pieData[1].name} : ${pieData[1].value}`}</p>
                    <p
                        style={{ color: pieData[2].colorActive }}
                    >{`${pieData[2].name} : ${pieData[2].value}`}</p>
                </div>
            );
        }

        return <></>;
    };

    return (
        <div className="flex flex-col flex-1 bg-electro-900 rounded p-2">
            <h2 className="text-xl font-bold">Pulls by Rarity</h2>
            {total > 0 ? (
                <ResponsiveContainer
                    className="chart"
                    width="100%"
                    height={160}
                >
                    <PieChart tabIndex={-1} className="chart">
                        <Pie
                            data={pieData}
                            outerRadius={70}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            dataKey="value"
                            tabIndex={-1}
                            rootTabIndex={-1}
                            className="chart"
                        >
                            {pieData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        index === focusBar
                                            ? entry.colorActive
                                            : entry.color
                                    }
                                    stroke={"none"}
                                    tabIndex={-1}
                                    className="chart"
                                    onMouseEnter={() => {
                                        setFocusBar(index);
                                    }}
                                    onMouseLeave={() => {
                                        setFocusBar(null);
                                    }}
                                />
                            ))}
                        </Pie>
                        <Tooltip content={CustomTooltip} />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <>{"No data :("}</>
            )}
        </div>
    );
}
