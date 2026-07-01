const jaffaSelector =
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(6) > div.CvalsVWS > div.LSlmqo-l > div";

const imageSelectors = [
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(6) > div.CvalsVWS > div.mlnKELb2",
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(6) > div.LelS5mxC > div",
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(7) > div.CvalsVWS > div.mlnKELb2",
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(7) > div.LelS5mxC > div",
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(9) > div.CvalsVWS > div.mlnKELb2",
  "#app > div.omuXUjS1 > div > div.vgEFzMdg > div > div.QvOdAhOm > div.VLpxC353.wco9jMg6 > div:nth-child(9) > div.LelS5mxC > div",
];

function modifyPage() {
  const jaffaElement = document.querySelector(jaffaSelector);
  if (jaffaElement && jaffaElement.innerText !== "Jaffa") {
    jaffaElement.innerText = "Jaffa";
  }
  const flagUrl = chrome.runtime.getURL("ps.png");
  imageSelectors.forEach((selector) => {
    const imageElement = document.querySelector(selector);
    if (imageElement) {
      const hasOnlyFlag =
        imageElement.children.length === 1 &&
        imageElement.children[0].tagName === "IMG" &&
        imageElement.children[0].src === flagUrl;

      if (!hasOnlyFlag) {
        imageElement.innerHTML = "";
        const img = document.createElement("img");
        img.src = flagUrl;
        img.style.width = "100%";
        img.style.height = "100%";
        imageElement.appendChild(img);
      }
    }
  });
}

const observer = new MutationObserver(() => {
  modifyPage();
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

modifyPage();
console.log("Palestine Extension: MutationObserver started successfully!");
