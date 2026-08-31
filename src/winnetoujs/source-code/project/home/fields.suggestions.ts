import { params } from "./params";

class FieldsSuggestions {
  private regex = {
    trigger: /db\.getCollection\(".+"\)\.find\({[\s\n\t]+/,
    collectionName: /db\.getCollection\("(.+)"\)/,
    filters: {
      /** /^\t([^,:\r\n]*)$/gm */
      next: /^\t([^,:\r\n]*)$/gm,
    },
    /** /(^\t+)([^,:\r\n]+)$/gm */
    select: /(^\t+)([^,:\r\n]+)$/gm,
  };

  private storage = {
    fieldsList: new Map<string, string[]>(),
  };

  private collectionName: string;

  private getCollectionName(text: string) {
    return text.match(this.regex.collectionName)?.[1] || "";
  }

  private async getFieldsList(args0: {
    collectionName: string;
    databaseId: string;
    projectId: string;
  }): Promise<string[]> {
    const { collectionName, databaseId, projectId } = args0;
    const identifier = `${args0.projectId}-${args0.databaseId}-${collectionName}`;
    if (this.storage.fieldsList.has(identifier)) {
      return this.storage.fieldsList.get(identifier);
    }
    let res = await window.database.mongify.sendQuery({
      command: `db.getCollection("${collectionName}").findOne()`,
      databaseId,
      projectId,
    });
    const fields = Object.keys(res || {});
    this.storage.fieldsList.set(identifier, fields);
    return fields;
  }

  // ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  public trigger(args0: { text: string }) {
    const { text } = args0;
    this.collectionName = this.getCollectionName(text);
    if (text.match(this.regex.trigger)?.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  public async filterSuggestions(args0: {
    databaseId: string;
    projectId: string;
    text: string;
  }): Promise<string[]> {
    const fieldsAvailable: string[] = await this.getFieldsList({
      collectionName: this.collectionName,
      databaseId: args0.databaseId,
      projectId: args0.projectId,
    });

    const nextMatch = args0.text.match(this.regex.filters.next)?.[0] || "";

    const suggestionsAvailable = fieldsAvailable.filter((field) => {
      if (nextMatch === "\t") return true;

      if (nextMatch.trim() === "") return false;

      if (field.startsWith(nextMatch.trim())) return true;
    });
    return suggestionsAvailable;
  }

  public selectSuggestion(args0: { editor: HTMLElement; content: string }) {
    const { editor, content } = args0;
    let text = editor.innerText;
    const selectRegex = this.regex.select;
    const match = text.match(selectRegex);
    const toBeReplaced = match?.[0] || "";

    console.log(
      JSON.stringify(
        {
          text,
          match,
          toBeReplaced,
          content,
        },
        null,
        2,
      ),
    );

    if (toBeReplaced === "" || !toBeReplaced) {
      // if innerText finish with \n remove it
      if (text.endsWith("\n")) {
        text = text.slice(0, -1);
      }
      editor.innerText = text + content + ":";
    } else {
      let tabCount = params.tabCount;
      editor.innerText = text.replace(
        selectRegex,
        (completeMatch: string, group1: string, group2: string) => {
          return `${group1}${content}:`;
        },
      );
    }
  }
}

export const fieldsSuggestionsModel = new FieldsSuggestions();
