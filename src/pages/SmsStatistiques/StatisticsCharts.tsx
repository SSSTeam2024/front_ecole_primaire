import React from "react";
import ReactApexChart from "react-apexcharts";
import getChartColorsArray from "Common/ChartsDynamicColor";
import { useFetchSmSQuery } from "features/sms/smsSlice";

const PurchaseCharts = ({ dataColors, month }: any) => {
  const monthAbbrs = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const selectedMonthIndex = monthAbbrs.indexOf(month);
  const currentYear = new Date().getFullYear();
  const { data: allSms = [] } = useFetchSmSQuery();
  const sentSmses = allSms.filter((sms) => sms.status === "sent");

  const getDayFromTimestamp = (timestamp: Date) => {
    const day = timestamp.getDate();
    return day;
  };

  const aggregateSmsByDay = (smsData: any[]) => {
    const smsCountByDay = Array(31).fill(0);

    smsData.forEach((sms: any) => {
      const createdAt = new Date(parseInt(sms._id.substring(0, 8), 16) * 1000);
      if (
        createdAt.getFullYear() === currentYear &&
        createdAt.getMonth() === selectedMonthIndex
      ) {
        const day = getDayFromTimestamp(createdAt) - 1;
        smsCountByDay[day] += 1;
      }
    });

    return smsCountByDay;
  };

  const smsCountByDay = aggregateSmsByDay(sentSmses);

  const series = [
    {
      name: "Total SMS",
      data: smsCountByDay,
    },
  ];

  const options = {
    chart: {
      height: 380,
      type: "line",
      zoom: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    colors: getChartColorsArray(dataColors),
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: [3],
      curve: "smooth",
    },
    grid: {
      row: {
        colors: ["transparent", "transparent"],
        opacity: 0.2,
      },
      borderColor: "#f1f1f1",
    },
    markers: {
      style: "inverted",
      size: 6,
    },
    xaxis: {
      categories: Array.from({ length: 31 }, (_, index) => `${index + 1}`),
    },
    responsive: [
      {
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false,
            },
          },
          legend: {
            show: false,
          },
        },
      },
    ],
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="line"
        height="380"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const IncomeStatisticsCharts = ({ dataColors }: any) => {
  const chartColumnColors = getChartColorsArray(dataColors);
  const { data: allSms = [] } = useFetchSmSQuery();
  const sentSmses = allSms.filter((sms) => sms.status === "sent");
  const monthlyTotals: Record<string, number> = {
    Jan: 0,
    Feb: 0,
    Mar: 0,
    Apr: 0,
    May: 0,
    Jun: 0,
    Jul: 0,
    Aug: 0,
    Sep: 0,
    Oct: 0,
    Nov: 0,
    Dec: 0,
  };

  sentSmses.forEach((sms: any) => {
    const objectIdHex = sms._id.replace(/^ObjectId\("(.*)"\)$/);
    const createdAt = new Date(
      parseInt(objectIdHex.substring(0, 8), 16) * 1000
    );

    const monthIndex = createdAt.getMonth();
    const monthName = Object.keys(monthlyTotals)[monthIndex];

    if (monthName) {
      monthlyTotals[monthName]++;
    }
  });

  const orderedMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const series = [
    {
      name: "Total SMS",
      data: orderedMonths.map((month) => monthlyTotals[month]),
    },
  ];

  const options = {
    chart: {
      height: 380,
      type: "bar",
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        endingShape: "rounded",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    colors: chartColumnColors,
    xaxis: {
      categories: orderedMonths,
    },
    // yaxis: {
    //   title: {
    //     text: "£",
    //   },
    // },
    grid: {
      borderColor: "#f1f1f1",
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val: any) {
          return val;
        },
      },
    },
  };

  return (
    <React.Fragment>
      <ReactApexChart
        dir="ltr"
        options={options}
        series={series}
        type="bar"
        height="380"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export { PurchaseCharts, IncomeStatisticsCharts };
