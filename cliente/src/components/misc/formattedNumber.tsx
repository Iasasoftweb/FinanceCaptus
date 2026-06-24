import React from "react";
import { safeFixed } from "../UtilsStuff";

function formatNumber(value) {
    if (value >= 1000000) {
      return (safeFixed(value / 1000000, 1)) + 'M';
    } else if (value >= 1000) {
        return (safeFixed(value / 1000, 1)) + 'K';
    } else {
    return value.toString();
    }
  }

  export default formatNumber;