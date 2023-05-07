import { useEffect, useState } from "react";
import { TooltipWrapper, tableData } from "./App";
import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";
import Select from "react-select";

export default function Compare({
  data,
  setData,
  serachRef,
  setCompared,
  tooltip,
}) {
  const [values, setValues] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectData, setSelectData] = useState([]);

  useEffect(() => {
    if (open) {
      const arr = [];

      for (let i = 0; i < data.length; i++) {
        const city = data[i][tableData[0].onClick];
        arr.push({ value: city, label: city });
      }

      setSelectData(arr);
    }

    setValues([]);
  }, [open]);

  const compareCities = () => {
    if (values.length < 2) {
      alert("נא לבחור לפחות 2 יישובים בשביל לקבל תוצאה!");
      return;
    }
    if (values.length > 5) {
      alert("ניתן להשוות עד 5 יישובים!");
      return;
    }

    serachRef.current.value = "";

    const arr = [];
    const cities = [];

    for (let i = 0; i < Object.keys(values).length; i++) {
      const obj = data.find(
        (city) => city[tableData[0].onClick] === values[i].label
      );
      arr.push(obj);
      cities.push(values[i].label);
    }

    setCompared(cities);
    setData(arr);
    setOpen(false);
  };

  return (
    <>
      <TooltipWrapper
        title="ניתן להשוות עד 5 יישובים"
        open={tooltip}
        children={
          <button
            onClick={() => setOpen(true)}
            style={{ backgroundColor: "thistle" }}
          >
            השוואה בין יישובים
          </button>
        }
      />

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <div
          className="dialog"
          style={{ gap: "15px", alignItems: "center", padding: "5px" }}
        >
          <DialogTitle sx={{ color: "red", fontWeight: "bold" }}>
            ניתן להשוות עד 5 יישובים
          </DialogTitle>

          <Select
            noOptionsMessage={() => "אין תוצאות!"}
            isMulti
            placeholder={<span>חפש יישוב</span>}
            onChange={(e) => setValues(e)}
            menuPortalTarget={document.body}
            menuPlacement={"bottom"}
            closeMenuOnSelect={false}
            styles={selectStyle}
            options={selectData}
            components={{ IndicatorSeparator: () => null }}
          />
          <button onClick={compareCities}>השוואה בין יישובים</button>
        </div>
      </Dialog>
    </>
  );
}

const selectStyle = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    cursor: "pointer",
    minWidth: "500px",
  }),
  menuPortal: (provided) => ({ ...provided, zIndex: 9999 }),
  option: (styles) => ({ ...styles, cursor: "pointer" }),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
    cursor: "pointer",
    color: data.color,
  }),
  multiValueRemove: (styles, { data }) => ({
    ...styles,
    cursor: "pointer",
    color: data.color,
    ":hover": {
      backgroundColor: data.color,
      color: "white",
    },
  }),
};
