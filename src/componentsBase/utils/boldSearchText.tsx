import * as React from "react";

const boldSearchText = (
  testoDigitato: string,
  testoRiferimento: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  boldStyle?: any
) => {
  const normTestoDigitato = testoDigitato.toLowerCase();
  const normTestoRiferimento = testoRiferimento.toLowerCase();
  const resultIndex = normTestoRiferimento.indexOf(normTestoDigitato);
  let result = null;
  let firstPart = null;
  let middlePart = null;
  let endPart = null;
  let indexFinal = null;

  if (resultIndex !== -1) {
    indexFinal = resultIndex + testoDigitato.length;
    firstPart = testoRiferimento.substr(0, resultIndex);
    middlePart = (
      <b style={boldStyle}>
        {testoRiferimento.substr(resultIndex, testoDigitato.length)}
      </b>
    );
    endPart = testoRiferimento.substr(
      indexFinal,
      testoRiferimento.length - indexFinal
    );
    result = (
      <>
        {firstPart}
        {middlePart}
        {endPart}
      </>
    );
  } else {
    result = testoRiferimento;
  }
  return result;
};

export default boldSearchText;
