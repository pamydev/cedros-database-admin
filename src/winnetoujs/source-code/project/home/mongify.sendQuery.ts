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

/**
 * Onde eu parei:
 * db.getCollection("profiles").find({
 *	role:"profiles"
 * });
 *
 * este codigo gera erro pois "profiles" é encontrado
 * duas vezes, fazendo adicionar duas vezes a span
 * no primeiro e nenhuma no segundo.
 * Preciso usar uma abordagem que diferencie as ocorrências de "profiles"
 * talvez usando índices ou uma abordagem baseada em posição no texto.
 *
 */
