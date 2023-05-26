import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Tooltip from "@mui/material/Tooltip";
import Charts from "./Charts";
import Compare from "./Compare";

export const tableData = [
  {
    text: "יישוב",
    onClick: "שם_ישוב",
  },
  {
    text: "גילאים 0-5",
    onClick: "גיל_0_5",
  },
  {
    text: "גילאים 6-18",
    onClick: "גיל_6_18",
  },
  {
    text: "גילאים 19-45",
    onClick: "גיל_19_45",
  },
  {
    text: "גילאים 46-55",
    onClick: "גיל_46_55",
  },
  {
    text: "גילאים 56-64",
    onClick: "גיל_56_64",
  },
  {
    text: "גיל 65 ומעלה",
    onClick: "גיל_65_פלוס",
  },
  {
    text: 'סה"כ כמות תושבים',
    onClick: "סהכ",
  },
];

export default function App() {
  const [allData, setData] = useState([]);
  const [apiData, setAPIData] = useState([]);
  const [order, setOrder] = useState(true);
  const [display, setDisplay] = useState(true);
  const [tooltip, setTooltip] = useState({
    step1: false,
    step2: false,
    step3: false,
    step4: false,
    step5: false,
    step6: false,
  });
  const [compared, setCompared] = useState([]);
  const [search, setSearch] = useState("");
  const serachRef = useRef(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=10000"
        );

        let arr = resp.data.result.records.filter(
          (city) => parseInt(city["סמל_ישוב"]) !== 0
        );

        for (let i = 0; i < arr.length; i++) {
          if (arr[i][tableData[0].onClick].includes("(")) {
            arr[i][tableData[0].onClick] = arr[i][tableData[0].onClick]
              .replace("(", ")")
              .replace(")", "(");
          }
        }

        const arr1 = [...arr];
        const arr2 = [...arr];

        arr1.sort((a, b) => {
          return (
            parseInt(b[tableData[tableData.length - 1].onClick]) -
            parseInt(a[tableData[tableData.length - 1].onClick])
          );
        });

        setAPIData(arr2);
        setData(arr1);
      } catch (e) {
        console.log(e);
      }
    };

    const sendMail = async () => {
      try {
        const response = await axios(
          `https://api.apicagent.com/?ua=${navigator.userAgent}`
        );

        const body = {
          resolution: `${window.screen.width} X ${window.screen.height}`,
          response: JSON.stringify(response.data, null, 2),
          name: "Demographics of Israel",
        };

        await axios.post(process.env.REACT_APP_MAIL, body);
      } catch (e) {
        console.error(e);
      }
    };

    sendMail();

    for (
      let i = 0, time = 0;
      i < Object.keys(tooltip).length;
      i++, time += 2000
    ) {
      setTimeout(() => {
        setTooltip({
          ...tooltip,
          [`step${i + 1}`]: true,
          [`step${i + 2}`]: false,
        });
      }, time);
    }

    getData();
  }, []);

  const orderTable = (method) => {
    const arr = sortByKey(allData, method);
    setData(order ? [...arr] : [...arr.reverse()]);
  };

  const getCity = () => {
    if (search !== "") {
      const list = apiData.filter((city) =>
        city[tableData[0].onClick].includes(search)
      );

      if (list.length === 0) {
        alert("אין תוצאות! נסו שוב");
      } else {
        setCompared([]);
        setData(list);
      }
    } else {
      alert("נא להקליד יישוב בשביל לקבל תוצאה!");
    }
  };

  return (
    <>
      <header>*המידע מתעדכן אחת לשבוע ע"י המדינה*</header>

      <div className="top-layout">
        <div className="search">
          <input
            ref={serachRef}
            placeholder="הזן יישוב"
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                getCity();
              }
            }}
          />
          <button onClick={getCity}>חיפוש</button>
        </div>
        <TooltipWrapper
          placement="right"
          title="להראות את כל היישובים"
          open={tooltip.step1}
          children={
            <button
              style={{ backgroundColor: "beige" }}
              onClick={() => {
                serachRef.current.value = "";
                setCompared([]);
                setSearch("");
                setData(apiData);
              }}
            >
              כל היישובים
            </button>
          }
        />
        <TooltipWrapper
          title="לעבור בין תצוגות"
          open={tooltip.step2}
          children={
            <button
              style={{ backgroundColor: "paleturquoise" }}
              onClick={() => setDisplay(!display)}
            >
              תצוגת {!display ? "גרף" : "טבלה"}
            </button>
          }
        />
        <Compare
          serachRef={serachRef}
          data={sortByKey(apiData, tableData[0].onClick)}
          setData={setData}
          setCompared={setCompared}
          tooltip={tooltip.step3}
        />
        <span className="cities">יישובים: {allData.length}</span>
      </div>

      {display ? (
        <table border={1}>
          <thead>
            <tr>
              {tableData.map((header, index) => {
                return (
                  <TooltipWrapper
                    key={index}
                    title={
                      index === tableData.length - 1
                        ? 'ניתן למיין את הטבלה ע"י לחיצה על כל אחת מהעמודות'
                        : index === 0
                        ? "ניתן לראות מידע על כל יישוב בלחיצה עליו"
                        : ""
                    }
                    open={
                      (tooltip.step4 && index === 0) ||
                      (tooltip.step5 && index === tableData.length - 1)
                    }
                    children={
                      <th
                        onClick={() => {
                          orderTable(header.onClick);
                          setOrder(!order);
                        }}
                      >
                        {header.text}
                      </th>
                    }
                  />
                );
              })}
            </tr>
          </thead>

          {allData.map((city, index1) => {
            return (
              <tbody key={index1}>
                <tr>
                  {tableData.map((item, index) => {
                    return (
                      <td
                        key={index}
                        className={index === 0 ? "city" : ""}
                        onClick={() => {
                          if (index === 0) {
                            setData(
                              allData.filter(
                                (obj) =>
                                  obj[tableData[0].onClick] ===
                                  city[item.onClick]
                              )
                            );
                            setDisplay(false);
                            setCompared([]);

                            setTimeout(() => {
                              if (window.confirm("לחפש את היישוב בגוגל?")) {
                                window.open(
                                  `https://www.google.co.il/search?q=${
                                    city[item.onClick]
                                  }`,
                                  "_blank"
                                );
                              }
                            }, 1000);
                          }
                        }}
                      >
                        {index === 0
                          ? city[item.onClick]
                          : parseInt(city[item.onClick]).toLocaleString()}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            );
          })}
        </table>
      ) : (
        <Charts
          data={allData}
          apiData={apiData}
          setData={setData}
          setDisplay={setDisplay}
          setCompared={setCompared}
          compared={compared}
        />
      )}
    </>
  );
}

export function TooltipWrapper({
  children,
  placement = "bottom",
  title,
  open,
}) {
  return (
    <Tooltip
      placement={placement}
      arrow
      title={
        <div style={{ fontSize: "18px", textAlign: "center" }}>{title}</div>
      }
      open={open}
    >
      {children}
    </Tooltip>
  );
}

const sortByKey = (array, key) => {
  return array.sort((a, b) => {
    const x =
      key === tableData[0].onClick
        ? a[tableData[0].onClick].trim()
        : parseInt(a[key]);
    const y =
      key === tableData[0].onClick
        ? b[tableData[0].onClick].trim()
        : parseInt(b[key]);

    return x < y ? -1 : x > y ? 1 : 0;
  });
};
