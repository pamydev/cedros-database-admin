export const formatJSON = (arg0: { content: {} }) => {
  let content = arg0.content;
  return JSON.stringify(content, null, 2)
    .replace(/\n/g, "<br>")
    .replace(/ /g, "&nbsp;")
    .replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
    .replace(/(".*?")/g, '<span class="json-key">$1</span>');
};
