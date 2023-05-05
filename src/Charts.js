import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { tableData } from "./App";

export default function Charts({ data }) {
  const [value, setValue] = useState("ages");
  const [chartData, setChartData] = useState([]);

  const color = "rgb(150, 53, 142)";

  useEffect(() => {
    const arr = [];

    if (value === "ages") {
      for (let i = 1; i < tableData.length; i++) {
        const obj = sumData(data, tableData[i].onClick, tableData[i].text);
        arr.push(obj);
      }
    } else if (value === "cities") {
      
    }

    setChartData(arr);
  }, [value, data]);

  const sumData = (arr, key, name) => {
    let sum = 0;

    arr.forEach((item) => {
      sum += parseInt(item[key]);
    });

    return [name, sum];
  };

  const options = [
    {
      name: "גילאים",
      value: "ages",
    },
    {
      name: "יישובים ",
      value: "cities",
    },
    // {
    //   name: "Monthly",
    //   value: "months",
    // },
  ];

  const charts = {
    chart: {
      type: "column",
    },
    title: {
      text: null,
    },
    // plotOptions: {
    //   series: {
    //     pointWidth: 8,
    //   },
    // },
    // legend: {
    //   enabled: false,
    // },
    xAxis: {
      type: "category",
      labels: {
        style: {
          color,
        },
      },
      title: {
        style: {
          color,
        },
      },
    },
    yAxis: {
      min: 0,
      labels: {
        style: {
          color,
        },
      },
      title: {
        text: "תושבים",
        style: {
          color,
        },
      },
    },
    tooltip: {
      formatter: function () {
        return `<span style="font-weight:bold">${this.y}</span>`;
      },
    },
    series: [
      {
        name: "תושבים",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <div style={{ textAlign: "center" }}>
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          {options.map(({ name, value }, index) => (
            <option key={index} value={value}>
              {name}
            </option>
          ))}
        </select>
      </div>

      <HighchartsReact highcharts={Highcharts} options={charts} />
    </>
  );
}
