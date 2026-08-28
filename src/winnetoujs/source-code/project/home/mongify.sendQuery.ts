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
 * precisa remover o tabCount quando fecha chaves
 * esta com erro em colocar nova linha,
 * meu maior problema segue sendo o colorize com aquele timer
 * de 500ms que gera varios bugs de digitacao.
 * acho que eu preciso implementar nele o algoritmo
 * de fazer o cursos voltar para onde estava,
 * acho que ele ainda usa o algoritmo antigo que
 * insere o cursor no final.
 * ==
 * o real problema esta na insercao de tab e nova linha
 * ao apertar enter em colorize>insertTab>line101
 *
 */
