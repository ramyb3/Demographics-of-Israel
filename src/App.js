import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
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
  const [order, setOrder] = useState(false);
  const [display, setDisplay] = useState(true);
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

        setAPIData(arr);
        setData(arr);
      } catch (e) {
        console.log(e);
      }
    };

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
        <div className="buttons">
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
          <button
            style={{ backgroundColor: "paleturquoise" }}
            onClick={() => setDisplay(!display)}
          >
            תצוגת {display ? "גרף" : "טבלה"}
          </button>
          <span className="cities">יישובים: {allData.length}</span>
        </div>

        <Compare
          serachRef={serachRef}
          data={sortByKey(apiData, tableData[0].onClick)}
          setData={setData}
          compared={compared}
          setCompared={setCompared}
        />
      </div>

      {display ? (
        <table border={1}>
          <thead>
            <tr>
              {tableData.map((header, index) => {
                return (
                  <th
                    key={index}
                    onClick={() => {
                      orderTable(header.onClick);
                      setOrder(!order);
                    }}
                  >
                    {header.text}
                  </th>
                );
              })}
            </tr>
          </thead>

          {allData.map((city, index) => {
            return (
              <tbody key={index}>
                <tr>
                  {tableData.map((item, index) => {
                    // const total =
                    //   index === tableData.length - 1
                    //     ? parseInt(city[item.onClick])
                    //     : null;

                    return (
                      <td
                        key={index}
                        // style={
                        //   total
                        //     ? {
                        //         color: `${
                        //           total >= 100_000
                        //             ? "green"
                        //             : total >= 10_000 && total < 100_000
                        //             ? "orange"
                        //             : total >= 1_000 && total < 10_000
                        //             ? "blue"
                        //             : "red"
                        //         }`,
                        //         fontWeight: "bold",
                        //       }
                        //     : null
                        // }
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
                        {city[item.onClick]}
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
          setData={setData}
          setDisplay={setDisplay}
          compared={compared}
        />
      )}
    </>
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
