// import React from 'react';
// import DashboardCard from './DashboardCard';
// import { Clock, DollarSign, Eye } from 'lucide-react';

// const DashboardCards = ({ type = 'default' }) => {
//     // Định nghĩa dữ liệu cho từng loại dashboard
//     const dashboardData = {
//         user: [
//             {
//                 title: "Total Users",
//                 icon: <Eye size={16} />,
//                 value: "2,450",
//                 change: 12.5
//             },
//             {
//                 title: "Active Users",
//                 icon: <DollarSign size={16} />,
//                 value: "1,890",
//                 change: 8.2
//             },
//             {
//                 title: "New Users",
//                 icon: <Clock size={16} />,
//                 value: "156",
//                 change: -5.1
//             }
//         ],
//         product: [
//             {
//                 title: "Total Products",
//                 icon: <Eye size={16} />,
//                 value: "1,250",
//                 change: 15.8
//             },
//             {
//                 title: "Revenue",
//                 icon: <DollarSign size={16} />,
//                 value: "$25,450",
//                 change: -2.4
//             },
//             {
//                 title: "Stock Items",
//                 icon: <Clock size={16} />,
//                 value: "890",
//                 change: 7.3
//             }
//         ],
//         order: [
//             {
//                 title: "Total Orders",
//                 icon: <Eye size={16} />,
//                 value: "3,120",
//                 change: 18.9
//             },
//             {
//                 title: "Order Revenue",
//                 icon: <DollarSign size={16} />,
//                 value: "$48,920",
//                 change: 12.1
//             },
//             {
//                 title: "Pending Orders",
//                 icon: <Clock size={16} />,
//                 value: "67",
//                 change: -8.5
//             }
//         ],
//         default: [
//             {
//                 title: "Page Views",
//                 icon: <Eye size={16} />,
//                 value: "12,450",
//                 change: 15.8
//             },
//             {
//                 title: "Total Revenue",
//                 icon: <DollarSign size={16} />,
//                 value: "$363.95",
//                 change: -34.0
//             },
//             {
//                 title: "Bounce Rate",
//                 icon: <Clock size={16} />,
//                 value: "86.5%",
//                 change: 24.2
//             }
//         ]
//     };

//     const cards = dashboardData[type] || dashboardData.default;

//     return (
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {cards.map((card, index) => (
//                 <DashboardCard
//                     key={index}
//                     title={card.title}
//                     icon={card.icon}
//                     value={card.value}
//                     change={card.change}
//                 />
//             ))}
//         </div>
//     );
// };

// export default DashboardCards;