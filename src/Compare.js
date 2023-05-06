import { useState } from "react";
import { tableData } from "./App";

export default function Compare({
  data,
  setData,
  selectRef1,
  selectRef2,
  serachRef,
}) {
  const [values, setValues] = useState({ first: "", second: "" });

  const compareCities = () => {
    serachRef.current.value = "";

    if (values.first === values.second) {
      alert("אי אפשר להשוות בין אותו יישוב!");
      return;
    }
    if (values.first === "" || values.second === "") {
      alert("נא לבחור יישוב בשביל לקבל תוצאה!");
      return;
    }

    const arr = [];

    for (let i = 0; i < 2; i++) {
      const obj = data.find(
        (city) =>
          city[tableData[0].onClick].trim() ===
          values[i === 0 ? "first" : "second"]
      );
      arr.push(obj);
    }

    setData(arr);
  };

  return (
    <div className="buttons">
      <span>השוואה בין יישובים:</span>
      <Select
        selectRef={selectRef1}
        data={data}
        values={values}
        setValues={setValues}
        position="first"
      />
      <span>לבין</span>
      <Select
        selectRef={selectRef2}
        data={data}
        values={values}
        setValues={setValues}
        position="second"
      />
      <button onClick={compareCities}>השווה</button>
    </div>
  );
}

function Select({ data, values, setValues, position, selectRef }) {
  return (
    <select
      ref={selectRef}
      onChange={(e) => setValues({ ...values, [position]: e.target.value })}
    >
      <option></option>
      {data.map((city, index) => {
        return <option key={index}>{city[tableData[0].onClick]}</option>;
      })}
    </select>
  );
}
