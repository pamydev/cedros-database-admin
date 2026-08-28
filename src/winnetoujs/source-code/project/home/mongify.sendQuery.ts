import { digestOutput } from "./digestOutput";

export const mongify_sendQuery = async (args0: {
  projectId: string;
  databaseId: string;
  command: string;
  output: string;
}) => {
  const { projectId, databaseId, command, output } = args0;

  const res = await window.database.mongify.sendQuery({
    projectId: projectId,
    databaseId: databaseId,
    command: document.getElementById(command).textContent,
  });
  console.log(res);
  digestOutput({
    output: output,
    result: res,
  });
};
