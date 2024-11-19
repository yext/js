type RTF2 = {
  json?: Record<string, any>;
};

type FAQ =
  | {
      question: string;
      answer: string;
    }
  | {
      question: string;
      answerV2: RTF2;
    };

function getTextNodesFromJson(
  rtfObject: Record<string, any>,
  textNodes: string[]
) {
  for (const key in rtfObject) {
    if (typeof rtfObject[key] === "object") {
      if (Array.isArray(rtfObject[key])) {
        // loop through array
        for (let i = 0; i < rtfObject[key].length; i++) {
          getTextNodesFromJson(rtfObject[key][i], textNodes);
        }
      } else {
        // call function recursively for object
        getTextNodesFromJson(rtfObject[key], textNodes);
      }
    } else {
      if (key === "text") {
        // store all text nodes in an array
        textNodes.push(rtfObject[key]);
      }
    }
  }
}

function getRichTextContent(answer: RTF2) {
  if (answer.json) {
    const textNodes: string[] = [];
    getTextNodesFromJson(answer.json, textNodes);
    return textNodes.join("");
  }
  return "";
}

// https://schema.org/FAQPage
const FAQPage = (data: FAQ[]) => {
  return {
    "@context": "http://www.schema.org",
    "@type": "FAQPage",
    mainEntity: data.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: "answer" in faq ? faq.answer : getRichTextContent(faq.answerV2),
      },
    })),
  };
};

export { FAQPage };
