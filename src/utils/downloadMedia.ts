const downloadMedia = (name: string, srcUrl: string) => {
  const anchor = document.createElement("a");
  document.body.appendChild(anchor);
  anchor.href = `${srcUrl}?downloadAs=${name}`;
  anchor.click();
  document.body.removeChild(anchor);
};

export default downloadMedia;
