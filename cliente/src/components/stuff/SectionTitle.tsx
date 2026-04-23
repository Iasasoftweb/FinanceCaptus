import React from "react";

export const SectionTitle = ({ title }) => (
    <div className="col-12 mt-2 mb-2">
      <div
        className="py-2 px-3 rounded-1 fw-bold text-uppercase"
        style={{
          backgroundColor: "#E9ECEF",
          color: "#495057",
          fontSize: "11px",
          letterSpacing: "1px",
        }}
      >
        {title}
      </div>
    </div>
  );

