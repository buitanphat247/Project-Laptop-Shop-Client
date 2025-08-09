import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Bar Chart Component
export const BarChart = ({ data, title, subtitle }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Hot Lead',
        data: data.map(item => item.hotLead),
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Warm Lead',
        data: data.map(item => item.warmLead),
        backgroundColor: '#E5E7EB',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: 'Cold Lead',
        data: data.map(item => item.coldLead),
        backgroundColor: '#8B5CF6',
        borderColor: '#8B5CF6',
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      subtitle: {
        display: true,
        text: subtitle,
        font: {
          size: 12,
        },
        color: '#6B7280',
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('vi-VN')} (đơn vị)`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toLocaleString('vi-VN');
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Line Chart Component
export const LineChart = ({ data, title, subtitle }) => {
  const chartData = {
    labels: data.map(item => item.day),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(item => item.value),
        borderColor: '#8B5CF6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#8B5CF6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      subtitle: {
        display: true,
        text: subtitle,
        font: {
          size: 12,
        },
        color: '#6B7280',
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${context.parsed.y.toLocaleString('vi-VN')} VNĐ`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toLocaleString('vi-VN');
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-80">
      <Line data={chartData} options={options} />
    </div>
  );
};

// Custom Donut Chart Component with SVG
export const DonutChart = ({ data, title, subtitle }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 80;
  const innerRadius = 48; // 60% cutout
  const centerX = 120;
  const centerY = 120;

  let currentAngle = -Math.PI / 2; // Start from top

  const createArc = (startAngle, endAngle, innerR, outerR) => {
    const x1 = centerX + innerR * Math.cos(startAngle);
    const y1 = centerY + innerR * Math.sin(startAngle);
    const x2 = centerX + innerR * Math.cos(endAngle);
    const y2 = centerY + innerR * Math.sin(endAngle);
    const x3 = centerX + outerR * Math.cos(endAngle);
    const y3 = centerY + outerR * Math.sin(endAngle);
    const x4 = centerX + outerR * Math.cos(startAngle);
    const y4 = centerY + outerR * Math.sin(startAngle);

    const largeArcFlag = Math.abs(endAngle - startAngle) > Math.PI ? 1 : 0;

    const path = [
      `M ${x1} ${y1}`,
      `A ${innerR} ${innerR} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${outerR} ${outerR} 0 ${largeArcFlag} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');

    return path;
  };

  const getTextPosition = (angle, r) => {
    const x = centerX + r * Math.cos(angle);
    const y = centerY + r * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="w-full h-80 p-4">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
      
      <div className="flex items-center justify-center">
        <svg width="240" height="240" className="flex-shrink-0">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 2 * Math.PI;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            const midAngle = startAngle + angle / 2;

            currentAngle = endAngle;

            const path = createArc(startAngle, endAngle, innerRadius, radius);
            const textPos = getTextPosition(midAngle, (innerRadius + radius) / 2);

            return (
              <g key={index}>
                <path
                  d={path}
                  fill={item.color}
                  stroke="#fff"
                  strokeWidth="2"
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
                {percentage > 8 && (
                  <text
                    x={textPos.x}
                    y={textPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#fff"
                    fontSize="11"
                    fontWeight="bold"
                    className="pointer-events-none"
                  >
                    {percentage.toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        <div className="ml-8 space-y-2">
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-2"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm text-gray-700">
                  {item.name}: {percentage.toFixed(1)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// Area Chart Component
export const AreaChart = ({ data, title, subtitle }) => {
  const chartData = {
    labels: data.map(item => item.month),
    datasets: [
      {
        label: 'Doanh thu',
        data: data.map(item => item.value),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderWidth: 3,
        pointBackgroundColor: '#fff',
        pointBorderColor: '#3B82F6',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Mục tiêu',
        data: data.map(item => item.target),
        borderColor: '#EF4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        borderDash: [5, 5],
        pointBackgroundColor: '#fff',
        pointBorderColor: '#EF4444',
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 5,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: title,
        font: {
          size: 16,
          weight: 'bold',
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
      subtitle: {
        display: true,
        text: subtitle,
        font: {
          size: 12,
        },
        color: '#6B7280',
        padding: {
          bottom: 10,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y.toLocaleString('vi-VN')} VNĐ`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          callback: function(value) {
            return value.toLocaleString('vi-VN');
          },
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
  };

  return (
    <div className="w-full h-80">
      <Line data={chartData} options={options} />
    </div>
  );
}; 