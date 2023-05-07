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

export default function Charts({
  data,
  apiData,
  setData,
  setDisplay,
  compared,
  setCompared,
}) {
  const [value, setValue] = useState(options[0].value);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const arr = [];

    if (value === options[0].value) {
      if (compared.length > 0) {
        for (let j = 0; j < data.length; j++) {
          const array = [];

          for (let i = 1; i < tableData.length; i++) {
            const obj = sumData(
              [data[j]],
              tableData[i].onClick,
              tableData[i].text
            );
            array.push(obj);
          }

          arr.push(array);
        }
      } else {
        for (let i = 1; i < tableData.length; i++) {
          const obj = sumData(data, tableData[i].onClick, tableData[i].text);
          arr.push(obj);
        }
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
      events: {
        render() {
          if (value !== options[0].value || compared.length === 0) {
            this.series[1]?.remove();
          }
        },
      },
    },
    title: {
      text: null,
    },
    legend: {
      enabled:
        value !== options[0].value || compared.length === 0 ? false : true,
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
        return `<div style="font-weight:bold; display:flex">${
          value === options[1].value ? this.key : ""
        }${
          value === options[0].value && compared.length > 0
            ? compared[this.point.colorIndex]
            : ""
        }
        ${parseInt(this.y).toLocaleString()}</div>`;
      },
    },
    colors: ["#2caffe", "#08af0d"],
    series: [
      {
        cursor: "pointer",
        name:
          compared.length > 0 && value === options[0].value
            ? compared[0]
            : "תושבים",
        data:
          compared.length > 0 && value === options[0].value
            ? chartData[0]
            : chartData,
        point: {
          events: {
            click: (e) => {
              if (value !== options[0].value) {
                setData(
                  (value === options[1].value ? data : apiData).filter(
                    (city) =>
                      city[
                        value === options[1].value
                          ? tableData[0].onClick
                          : "נפה"
                      ] === e.point.name
                  )
                );
                setCompared([]);
                setDisplay(true);
              }
            },
          },
        },
      },
      {
        cursor: "pointer",
        name: compared[1],
        data: chartData[1],
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
