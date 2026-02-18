import React from "react";

function CarDash({icons, title1, title2, cantidad, icon2 }) {
  return (
    <div className="card">
      <div className="card-inner">
        <div className="d-flex ">
          <div className=" text-light rounded-circle border-1 bg-danger  p-3 m-3">
            {/* <{icons} className="fs-1" /> */}
          </div>
          <div className="lh-1 mt-2">
            <span className="fw-lighter text-black-50"> {title1}</span>
            <h2 className="lh-1 mt-2">300</h2>
            <span className="fw-lighter text-black-50 mt-0">
              Ulitimo Cliente: <br />
              <span className="fs-bold text-black"> Ismael Santos</span>
            </span>
          </div>
        </div>

        <div>x</div>
      </div>
    </div>
  );
}
