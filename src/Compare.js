import { useEffect, useState } from "react";
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
  const [selectData, setSelectData] = useState([]);

  useEffect(() => {
    setSelectData(data);
    setValues([]);
  }, [open]);

  const compareCities = () => {
    if (values.length < 2) {
      alert("נא לבחור לפחות 2 יישובים בשביל לקבל תוצאה!");
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
          className="dialog"
          style={{ gap: "15px", alignItems: "center", padding: "5px" }}
        >
          <DialogTitle sx={{ color: "red", fontWeight: "bold" }}>
            ניתן להשוות עד 5 יישובים
          </DialogTitle>

          <div style={{ display: "flex", gap: "20px" }}>
            <div className="dialog">
              <input
                placeholder="הזן יישוב"
                onChange={(e) =>
                  setSelectData(
                    data.filter((city) =>
                      city[tableData[0].onClick].includes(e.target.value)
                    )
                  )
                }
              />
              <select
                size={10}
                onChange={(e) => {
                  const newVlues = values.filter(
                    (item, index) => values.indexOf(item) === index
                  );

                  if (newVlues.length > 4) {
                    alert("ניתן להשוות עד 5 יישובים!");
                  } else {
                    setValues([...newVlues, e.target.value]);
                  }
                }}
              >
                {selectData.map((city, index) => {
                  return (
                    <option key={index}>{city[tableData[0].onClick]}</option>
                  );
                })}
              </select>
            </div>
            <div className="dialog" style={{ alignItems: "center" }}>
              {values.length > 0 ? (
                <>
                  <span style={{ fontWeight: "bold" }}>יישובים שנבחרו:</span>
                  {values
                    .filter((item, index) => values.indexOf(item) === index)
                    .map((value, index) => {
                      return <span key={index}>{value}</span>;
                    })}
                </>
              ) : null}
            </div>
          </div>
          <button onClick={compareCities}>השוואה בין יישובים</button>
        </div>
      </Dialog>
    </>
  );
}
