// UTILS

const generateRandomId = () => {
  const date = new Date();
  const timestamp = date.getTime();
  return "poem" + timestamp + Math.floor(Math.random() * 1000);
}


/**
 * 
 * @param {string} url 
 * @returns 
 */
const getMarkdownFileNameFromUrl = (url) => {
  if (url === null || url === undefined) { return generateRandomId(); }
  const regex = /\/([^/]+)\.md/;
  const match = url.match(regex);
  return match ? match[1] : generateRandomId();
}




/////

const poemStringHTMLtoJson = (content, urlMarkdownFile) => {
  const extractParagraphFromString = (str) => {
    const regex = /<p>.*?<\/p>/gs;
    return str.match(regex);
  }

  const isTitle = (strTitle) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(strTitle, "text/html");
    const strongTag = doc.querySelector("strong");
    return strongTag !== null ? strongTag.textContent.trim() : '';
  }
  
  const isStrophe = (strophes) => {
    const parser = new DOMParser();
    let stropheArray = [];    
    strophes.forEach((strophe) => {
      const _strophe = parser.parseFromString(strophe, "text/html").querySelector("p");
      let verses = _strophe.textContent.split("\n");
      stropheArray.push(verses);
    });
    return stropheArray;
  }

  const allParagraphs = extractParagraphFromString(content);
  let poemJson = {
    id: getMarkdownFileNameFromUrl(urlMarkdownFile),
    title: isTitle(allParagraphs[0]),
    strophes: isStrophe(allParagraphs.slice(1))
  }
  console.info(poemJson)

}




const initShowdown = (url, ok, ko) => {
  if (showdown === null) return;
  const converter = new showdown.Converter();
  fetch(url)
    .then(response => response.text())
    .then(content => {
      const html = converter.makeHtml(content);
      ok !== null && ok !== undefined
        ? ok(html)
        : console.info(html);
    })
    .catch((error) => {
      ko !== null && ko !== undefined
        ? ko(error)
        : console.error(error);
    });
};







console.log("***********initShowdown************");
const poemUrl = "md/verde_que_te_quiero_verde.md";
initShowdown(poemUrl, (content) => {
  console.log(content)
  poemStringHTMLtoJson(content, poemUrl);
});



