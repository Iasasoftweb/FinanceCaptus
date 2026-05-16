export const agregarImagenProporcional = (
  doc,
  base64,
  x,
  y,
  width
) => {

  return new Promise((resolve) => {

    const img = new Image();

    img.src = base64;

    img.onload = () => {

      const height =
        (img.height * width) / img.width;

      doc.addImage(
        base64,
        "PNG",
        x,
        y,
        width,
        height
      );

      resolve();
    };
  });
};