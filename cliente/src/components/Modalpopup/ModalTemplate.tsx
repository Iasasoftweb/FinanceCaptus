import React from "react";
import "./Modalpopup.css";

function ModalTemplate( {edit, show, Id, close}) {
return <>
       <div className="modal-backdrop1">
      <div className="modal-content1">
        <div className="d-flex mx-2">
          <div className=" m-auto">
                    Pantalla Modal
          </div>
        </div>
      </div>
    </div>
  </>;
}

export default ModalTemplate;
