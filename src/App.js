import "./App.css";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function App() {
  const [allData, setData] = useState([]);
  const [apiData, setAPIData] = useState([]);
  const [order, setOrder] = useState(true);
  const [search, setSearch] = useState("");
  const serachRef = useRef(null);

  const tableData = [
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

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axios.get(
          "https://data.gov.il/api/3/action/datastore_search?resource_id=64edd0ee-3d5d-43ce-8562-c336c24dbc1f&limit=10000"
        );

        const arr = resp.data.result.records.filter(
          (city) => parseInt(city["סמל_ישוב"]) !== 0
        );

        arr.sort((a, b) => {
          return parseInt(b["סהכ"]) - parseInt(a["סהכ"]);
        });

        setAPIData(arr);
        setData(arr);
      } catch (e) {
        console.log(e);
      }
    };

    getData();
  }, []);

  const orderTable = (method) => {
    const sortByKey = (array, key) => {
      return array.sort((a, b) => {
        const x = key === "שם_ישוב" ? a["שם_ישוב"].trim() : parseInt(a[key]);
        const y = key === "שם_ישוב" ? b["שם_ישוב"].trim() : parseInt(b[key]);

        return x < y ? -1 : x > y ? 1 : 0;
      });
    };

    const arr = sortByKey(allData, method);
    setData(order ? [...arr] : [...arr.reverse()]);
  };

  const getCity = () => {
    if (search !== "") {
      const list = allData.filter((city) => city["שם_ישוב"].includes(search));

      if (list.length === 0) {
        alert("אין תוצאות! נסו שוב");
      } else {
        setData(list);
      }
    } else {
      alert("נא להקליד יישוב בשביל לקבל תוצאה!");
    }
  };

  return (
    <>
      <header>*המידע מתעדכן אחת לשבוע ע"י המדינה*</header>

      <div className="search">
        <input
          ref={serachRef}
          placeholder="הזן יישוב"
          type="text"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={getCity}>חיפוש</button>
        <button
          onClick={() => {
            serachRef.current.value = "";
            setSearch("");
            setData(apiData);
          }}
        >
          הסר חיפוש
        </button>
        <span className="cities">יישובים: {allData.length}</span>
      </div>

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
                <td
                  className="city"
                  onClick={() =>
                    window.open(
                      `https://www.google.co.il/search?q=${city["שם_ישוב"]}`,
                      "_blank"
                    )
                  }
                >
                  {city["שם_ישוב"]}
                </td>
                <td>{city["גיל_0_5"]}</td>
                <td>{city["גיל_6_18"]}</td>
                <td>{city["גיל_19_45"]}</td>
                <td>{city["גיל_46_55"]}</td>
                <td>{city["גיל_56_64"]}</td>
                <td>{city["גיל_65_פלוס"]}</td>
                <td>{city["סהכ"]}</td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </>
  );
}
