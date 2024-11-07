"use client"; 

import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale } from "chart.js";

ChartJS.register(LinearScale, PointElement, LineElement, Title, Tooltip, Legend, CategoryScale);

const Dashboard = () => {
    const [accessData, setAccessData] = useState<number[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1);
    const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
    const [loading, setLoading] = useState<boolean>(true);
    const [session, setSession] = useState<any>(null);
    const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState<boolean>(false);
    const [isYearDropdownOpen, setIsYearDropdownOpen] = useState<boolean>(false);

    // useEffect(() => {
    //     const fetchSession = async () => {
    //         const response = await fetch("/api/session"); // Tạo một API endpoint để lấy session
    //         const sessionData = await response.json();
    //         if (!sessionData) {
    //             redirect("/"); // Chuyển hướng nếu không có session
    //         } else {
    //             setSession(sessionData);
    //         }
    //     };
        
    //     fetchSession();
    // }, []);

    useEffect(() => {
        const fetchAccessData = async () => {
            const mockData = Array.from({ length: 31 }, () => Math.floor(Math.random() * 41) + 10);
            // Bỏ qua phần gọi API thật trong ví dụ này và dùng mock data
            setAccessData(mockData);
            setLoading(false); 
        };

        fetchAccessData();
    }, [selectedMonth, selectedYear]);

    const handleMonthChange = (month: number) => {
        setSelectedMonth(month);
        setIsMonthDropdownOpen(false); // Đóng dropdown sau khi chọn
    };

    const handleYearChange = (year: number) => {
        setSelectedYear(year);
        setIsYearDropdownOpen(false); // Đóng dropdown sau khi chọn
    };

    const labels = Array.from({ length: 31 }, (_, i) => i + 1); 
    const data = {
        labels: labels,
        datasets: [
            {
                label: "Số lần truy cập",
                data: accessData,
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
            },
        ],
    };

    return (
        <div className="p-9 flex flex-col items-center justify-center space-y-4">
            <h1 className="text-5xl max-[500px]:text-2xl">Dashboard</h1>
            <div className="flex space-x-4">
                <div className="select-container">
                    <div 
                        className="select-trigger" 
                        onClick={() => setIsMonthDropdownOpen(prev => !prev)}
                    >
                        Tháng {selectedMonth}
                    </div>
                    {isMonthDropdownOpen && (
                        <div className="select-dropdown">
                            {Array.from({ length: 12 }, (_, i) => (
                                <div 
                                    key={i} 
                                    className="select-option"
                                    onClick={() => handleMonthChange(i + 1)}
                                >
                                    Tháng {i + 1}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="select-container">
                    <div 
                        className="select-trigger" 
                        onClick={() => setIsYearDropdownOpen(prev => !prev)}
                    >
                        {selectedYear}
                    </div>
                    {isYearDropdownOpen && (
                        <div className="select-dropdown">
                            {Array.from({ length: selectedYear - 2000 + 1 }, (_, i) => (
                                <div 
                                    key={i} 
                                    className="select-option"
                                    onClick={() => handleYearChange(2000 + i)}
                                >
                                    {2000 + i}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div style={{ width: "100%", height: "400px" }} className="flex justify-center items-center">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <Line data={data} />
                )}
            </div>

            <style jsx>{`
                .select-container {
                    position: relative;
                    width: 100px; /* Chiều rộng có thể điều chỉnh */
                }

                .select-trigger {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    border: 2px solid #4f46e5; /* Màu viền */
                    border-radius: 8px; /* Đường viền bo tròn */
                    background-color: #ffffff; /* Màu nền */
                    cursor: pointer;
                    transition: border-color 0.3s; /* Hiệu ứng chuyển tiếp */
                    font-size: 14px; /* Thay đổi cỡ chữ */
                }

                .select-trigger:hover {
                    border-color: #3b82f6; /* Màu viền khi hover */
                }

                .select-dropdown {
                    position: absolute;
                    top: 100%;
                    left: 0;
                    width: 100%; /* Chiều rộng 100% */
                    border: 2px solid #4f46e5; /* Màu viền */
                    border-radius: 8px; /* Đường viền bo tròn */
                    background-color: #ffffff; /* Màu nền */
                    max-height: 200px; /* Chiều cao tối đa */
                    overflow-y: auto; /* Thanh cuộn dọc */
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Đổ bóng */
                    z-index: 10; /* Đảm bảo nó hiển thị trên các phần tử khác */
                }

                .select-option {
                    padding-left: 10px; /* Padding cho các mục */
                    transition: background-color 0.3s; /* Hiệu ứng chuyển tiếp */
                    cursor: pointer;
                    font-size: 14px; /* Cỡ chữ nhỏ hơn cho các mục */
                }

                .select-option:hover {
                    background-color: #e5e7eb; /* Màu nền khi hover */
                }
            `}</style>
        </div>
    );
};

export default Dashboard;
