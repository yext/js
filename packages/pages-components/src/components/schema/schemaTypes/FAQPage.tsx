type RTF2 = {
  json?: Record<string, any>;
};

type FAQ = PlainTextFAQ | RichTextFAQ;

type PlainTextFAQ = {
  question: string;
  answer: string;
};

type RichTextFAQ = {
  question: string;
  answerV2: RTF2;
};

const validatePlainTextFAQ = (faq: any): faq is PlainTextFAQ => {
  if (typeof faq !== "object") {
    return false;
  }
  return "question" in faq && "answer" in faq;
};

const validateRichTextFAQ = (faq: any): faq is RichTextFAQ => {
  if (typeof faq === "object" && "question" in faq && "answerV2" in faq) {
    return "json" in faq.answerV2 && typeof faq.answerV2.json === "object";
  }
  return false;
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
    mainEntity: data.map((faq) => {
      if (!(validatePlainTextFAQ(faq) || validateRichTextFAQ(faq))) {
        return undefined;
      }
      return {
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: "answer" in faq ? faq.answer : getRichTextContent(faq.answerV2),
        },
      };
    }),
  };
};

export { FAQPage };
