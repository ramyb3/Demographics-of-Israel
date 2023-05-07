import { useState } from "react";
import { TooltipWrapper, tableData } from "./App";
import Dialog from "@mui/material/Dialog";
import { DialogTitle } from "@mui/material";

export default function Compare({
  data,
  setData,
  serachRef,
  setCompared,
  tooltip,
}) {
  const [values, setValues] = useState([]);
  const [open, setOpen] = useState(false);

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

    for (let i = 0; i < Object.keys(values).length; i++) {
      const obj = data.find(
        (city) => city[tableData[0].onClick].trim() === values[i]
      );
      arr.push(obj);
    }

    setCompared(values);
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
            padding: "5px",
          }}
        >
          <DialogTitle sx={{ color: "red", fontWeight: "bold" }}>
            ניתן להשוות עד 5 יישובים
          </DialogTitle>

          <select
            multiple
            size={10}
            onChange={(e) =>
              setValues(
                Array.from(e.target.selectedOptions, (option) => option.value)
              )
            }
          >
            {data.map((city, index) => {
              return <option key={index}>{city[tableData[0].onClick]}</option>;
            })}
          </select>
          <button onClick={compareCities}>השוואה בין יישובים</button>
        </div>
      </Dialog>
    </>
  );
}
