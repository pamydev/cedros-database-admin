import { $div } from "@common";

export const digestOutput = (args0: { output: string; result: any }) => {
  const { output, result } = args0;
  //   new $div({
  //     class: "code-editor-output",
  //     content: JSON.stringify(result, null, 2),
  //   }).create(output);

  if (typeof result[0] === "object") {
    renderTable(result, output);
  } else {
    new $div({
      class: "code-editor-output",
      content: JSON.stringify(result, null, 2),
    }).create(output);
  }
};

/*
const res = [
  { name: "John", age: 30, city: "New York" },
  { name: "Jane", age: 25, city: "Los Angeles" },
  { name: "Mike", age: 35, city: "Chicago" },
];
*/

const renderTable = (data: any[], output: string) => {
  const table = new $div({
    class: "code-editor-output",
  }).create(output).ids.div;

  const header = Object.keys(data[0]);

  const headerRow = new $div({
    class: "table-row",
  }).create(table).ids.div;

  header.forEach((key) => {
    new $div({
      class: "table-cell",
      content: key,
    }).create(headerRow);
  });

  data.forEach((row) => {
    const rowDiv = new $div({
      class: "table-row",
    }).create(table).ids.div;

    header.forEach((key) => {
      new $div({
        class: "table-cell",
        content: row[key],
      }).create(rowDiv);
    });
  });
};
