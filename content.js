function replaceInTextNode(node) {
  if (node.nodeType !== Node.TEXT_NODE) return;
  const parent = node.parentElement;
  if (!parent) return;
  const tag = parent.tagName.toUpperCase();
  if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA") {
    return;
  }

  const text = node.nodeValue;
  let updated = text;

  if (/Jerusalem/i.test(updated)) {
    updated = updated.replace(/Jerusalem/gi, "Al-Quds");
  }
  if (/Tel\s*Aviv/i.test(updated)) {
    updated = updated.replace(/Tel\s*Aviv/gi, "Jaffa");
  }

  if (updated !== text) {
    node.nodeValue = updated;
  }
}

function walkTextNodes(root) {
  if (!root) return;
  if (root.nodeType === Node.TEXT_NODE) {
    replaceInTextNode(root);
    return;
  }

  if (root.nodeType === Node.ELEMENT_NODE) {
    const tag = root.tagName.toUpperCase();
    if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA") {
      return;
    }
  }

  const walker = document.createTreeWalker(
    root,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        const tag = parent.tagName.toUpperCase();
        if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT" || tag === "TEXTAREA") {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    }
  );

  let node;
  while ((node = walker.nextNode())) {
    replaceInTextNode(node);
  }
}

function replaceTargetSVGs(root) {
  if (!root) return;

  if (root.tagName && root.tagName.toUpperCase() === "SVG") {
    const path = root.querySelector('path[d^="M352 200.575h-64.001L256"]');
    if (path) {
      const flagUrl = chrome.runtime.getURL("ps.png");
      const img = document.createElement("img");
      img.src = flagUrl;
      img.style.width = "100%";
      img.style.height = "100%";
      if (root.parentNode) {
        root.parentNode.replaceChild(img, root);
      }
      return;
    }
  }

  if (root.querySelectorAll) {
    const svgs = root.querySelectorAll("svg");
    svgs.forEach((svg) => {
      const path = svg.querySelector('path[d^="M352 200.575h-64.001L256"]');
      if (path) {
        const flagUrl = chrome.runtime.getURL("ps.png");
        const img = document.createElement("img");
        img.src = flagUrl;
        img.style.width = "100%";
        img.style.height = "100%";
        if (svg.parentNode) {
          svg.parentNode.replaceChild(img, svg);
        }
      }
    });
  }
}

function modifyPage() {
  walkTextNodes(document.body);
  replaceTargetSVGs(document.body);
}

const observer = new MutationObserver((mutations) => {
  observer.disconnect();

  try {
    for (const mutation of mutations) {
      if (mutation.type === "childList") {
        mutation.addedNodes.forEach((node) => {
          walkTextNodes(node);
          replaceTargetSVGs(node);
        });
      } else if (mutation.type === "characterData") {
        replaceInTextNode(mutation.target);
      }
    }
  } catch (error) {
    console.error("Palestine Extension error:", error);
  } finally {
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  characterData: true,
});

modifyPage();
console.log("Palestine Extension: MutationObserver started successfully!");
