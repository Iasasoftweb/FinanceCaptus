import React, { useState, useRef } from "react";
import { GoGraph } from "react-icons/go";
import './TitleTop.css'

function TitleTop({ titulos, subtitulos, icon, btnVisible, btnLabel,  visibleEstado, estado }) {
  const [btnEstado, setbtnEstado] = useState(true);
  const estadoTitle = useRef('')

  const toglleButtonVisibilty = () => {
    setbtnEstado(!btnEstado);
  };
  return (

    <div className="card card w-100 p-2">
      <div>
        <div className="d-flex justify-content-between align-content-center ">
          <div className="d-flex">
            <div className="me-1">
             {icon}
            </div>
            <div className="lh-1 mt-3">
              <h5 className=" title2">{titulos}</h5>
              <span className="title1">{subtitulos}</span>
             
            </div>
          </div>

          {/* {btnVisible && (
            <Button label={btnLabel} rounded raised className=" bt " />
          )} */}

           { visibleEstado && <span className="clFont text-bg-danger py-2 px-2 rounded-3 text-center text-white" ref={estadoTitle} > {estado} </span>}
        </div>
      </div>
    </div>
  );
}

export default TitleTop;
