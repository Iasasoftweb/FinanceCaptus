import { TextField } from "@mui/material";
import React from "react";
import { TbBorderRadius } from "react-icons/tb";
import { NumericFormat } from "react-number-format";

// interface CurrencyTextFieldProps {
//   value: number;
//   onChange: (value: number) => void;
//   label?: string;
// }

const CurrencyTextField = ({ inputRef, onChange, ...rest }) => {
  return (
    <NumericFormat
      {...rest}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: rest.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator=","
      decimalSeparator="."
      prefix="DOP "
      decimalScale={2}
      fixedDecimalScale
      customInput={TextField}
    />
  );
};

// const CurrencyTextField: React.FC<CurrencyTextFieldProps> = ({
//   value,
//   onChange,
//   label,
// }) => {
//   return (
//     <NumericFormat
//       value={value}
//       thousandSeparator=","
//       decimalSeparator="."
//       prefix="DOP "
//       customInput={TextField}
//       decimalScale={2}
//       fixedDecimalScale
//       onValueChange={(values: NumericFormatProps) => {
//         const { floatValue } = values;
//         if (floatValue !== undefined) {
//           onChange(floatValue);
//         }
//       }}
//       label={label || "Currency"}
//       fullWidth
//       InputProps={{
//         style: { fontSize: "0.8rem", TbBorderRadius: "10px" }, // Cambia el tamaño de letra
//       }}
//     />
//   );
// };

export default CurrencyTextField;
