import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { Card } from "antd";
import CountUp from 'react-countup';
import { DASHBOARD_CARDS_DATA_MAP } from "../../config/constant";

// Single Dashboard Card Component
const DashboardCard = ({ title, icon, value, change }) => {
    const isPositive = change >= 0;

    // Parse numeric value from string (remove special characters)
    const numericValue = parseFloat(value.toString().replace(/[$,%]/g, ''));

    return (
        <Card className="w-full">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center gap-2">{icon} {title}</div>
                <div className="text-gray-400 cursor-pointer">ℹ️</div>
            </div>

            <div style={{ fontSize: '24px', fontWeight: '600', color: '#374151' }}>
                {value.toString().includes('$') && '$'}
                <CountUp
                    start={0}
                    end={numericValue}
                    duration={5}
                    separator=","
                    decimals={value.toString().includes('%') ? 1 : 0}
                />
                {value.toString().includes('%') && '%'}
            </div>

            <div
                className={`flex items-center w-fit px-2 py-0.5 rounded-md text-sm font-medium mt-2 ${isPositive ? "text-green-600 bg-green-100" : "text-red-600 bg-red-100"
                    }`}
            >
                {isPositive ? <ArrowUp size={14} className="mr-1" /> : <ArrowDown size={14} className="mr-1" />}
                <CountUp
                    start={0}
                    end={Math.abs(change)}
                    duration={5}
                    decimals={1}
                />%
            </div>
        </Card>
    );
};

// Dashboard Cards Container Component
const DashboardCards = ({ type = 'default' }) => {
    // Lấy dữ liệu từ constants
    const cards = DASHBOARD_CARDS_DATA_MAP[type] || DASHBOARD_CARDS_DATA_MAP.default;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, index) => (
                <DashboardCard
                    key={index}
                    title={card.title}
                    icon={card.icon}
                    value={card.value}
                    change={card.change}
                />
            ))}
        </div>
    );
};

// Export both components
export default DashboardCard;
export { DashboardCards };