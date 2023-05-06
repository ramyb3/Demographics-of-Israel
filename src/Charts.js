import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { useEffect, useState } from "react";
import { tableData } from "./App";

const options = [
  {
    name: "גיל",
    value: "age",
  },
  {
    name: "יישוב",
    value: "city",
  },
  {
    name: "איזור",
    value: "area",
  },
];

const color = "rgb(150, 53, 142)";

export default function Charts({ data, setData, setDisplay }) {
  const [value, setValue] = useState(options[0].value);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const arr = [];

    if (value === options[0].value) {
      for (let i = 1; i < tableData.length; i++) {
        const obj = sumData(data, tableData[i].onClick, tableData[i].text);
        arr.push(obj);
      }
    } else if (value === options[1].value) {
      for (let i = 0; i < data.length; i++) {
        arr.push([
          data[i][tableData[0].onClick],
          parseInt(data[i][tableData[tableData.length - 1].onClick]),
        ]);
      }
    } else if (value === options[2].value) {
      let area = data.map((city) => city["סמל_נפה"]);
      area = area.filter((item, index) => area.indexOf(item) === index);

      for (let i = 0; i < area.length; i++) {
        const obj = data.filter((city) => city["סמל_נפה"] === area[i]);
        arr.push(
          sumData(obj, tableData[tableData.length - 1].onClick, obj[0]["נפה"])
        );
      }
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

  const charts = {
    chart: {
      type: "column",
    },
    title: {
      text: null,
    },
    legend: {
      enabled: false,
    },
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
        cursor: "pointer",
        name: "תושבים",
        data: chartData,
        point: {
          events: {
            click: (e) => {
              if (value !== options[0].value) {
                setData(
                  data.filter(
                    (city) =>
                      city[
                        value === options[1].value
                          ? tableData[0].onClick
                          : "נפה"
                      ] === e.point.name
                  )
                );
                setDisplay(true);
              }
            },
          },
        },
      },
    ],
  };

  return (
    <>
      <div className="selector">
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
