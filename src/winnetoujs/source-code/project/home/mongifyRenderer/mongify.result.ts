import { formatJSON } from "@helpers/json.helper";
import { createCodeDiv } from "../codeDiv/codeDiv";
import { $div, $option, $select, $table, $td, $th, $tr } from "@common";
import { W } from "winnetoujs";

export const printMongifyResult = (arg0: {
  panelOutput: string;
  result: {}[] | any;
  command: string;
}) => {
  const { panelOutput, result, command } = arg0;
  const codeDivResponse = createCodeDiv({
    panelOutput: panelOutput,
    title: arg0.command,
    type: "mongify",
  });
  const { output, right } = codeDivResponse;
  let resultDiv: string;

  const printJson = () => {
    document.getElementById(resultDiv)?.remove();
    const formattedResult = formatJSON({
      content: arg0.result,
    });
    resultDiv = new $div({
      content: formattedResult,
      class: "mongify-output",
    }).create(output).ids.div;
  };

  const printTable = () => {
    document.getElementById(resultDiv)?.remove();
    resultDiv = new $div({
      class: "mongify-output",
    }).create(output).ids.div;

    const content = arg0.result;

    console.log({
      objectKeys: Object.keys(content[0]),
    });

    if (Object.keys(content[0])[0] == "0") {
      new $div({
        content: "No data available",
      }).create(resultDiv);
      return;
    }

    const table = new $table().create(resultDiv);
    let tr1 = table.ids.thead_tr_output;

    let columns = new Set<string>();

    content.forEach((obj: any) => {
      const tr = new $tr().create(table.ids.tbody_output).ids.tr;
      const keys = Object.keys(obj);
      keys.forEach((key) => {
        const value = obj[key];
        columns.add(key);
      });
      columns.forEach((column) => {
        if (keys.includes(column)) {
          const key = column;
          const value = obj[key];
          console.log("typeof value", typeof value);
          new $td({
            content:
              typeof value !== "string" &&
              typeof value !== "number" &&
              typeof value !== "boolean"
                ? JSON.stringify(value)
                : value,
          }).create(tr);
        }
      });
    });

    columns.forEach((column) => {
      new $th({ scope: "col", content: column }).create(
        table.ids.thead_tr_output,
      );
    });
  };

  const selectFormat = new $select({
    onchange: W.fx(() => {
      const format = (
        document.getElementById(selectFormat) as HTMLSelectElement
      ).value;
      if (format === "JSON") {
        printJson();
      } else if (format === "Table") {
        printTable();
      }
    }),
  }).create(right).ids.select;

  new $option({
    content: "JSON",
    value: "JSON",
  }).create(selectFormat);

  new $option({
    content: "Table",
    value: "Table",
  }).create(selectFormat);

  printJson();
};
