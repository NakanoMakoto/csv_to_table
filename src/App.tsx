import React, { useState } from "react";
import "./App.css";

function App(): JSX.Element {
  const [fileText, setFileText] = useState("");

  const processFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (!files) {
      setFileText("読み込み失敗");
    } else {
      try {
        const text = await readFileAsText(files[0]);

        setFileText(convertToTable(text));
      } catch (error) {
        console.log(error);

        setFileText("読み込み失敗");
      }
    }
  };

  return (
    <div className="App">
      <p>csvファイルを読み込み、backlogのテーブル形式に変換します。</p>
      <input type="file" name="csv" id="csv" onChange={processFile} />

      <div
        dangerouslySetInnerHTML={{
          __html: fileText.replace(/\n/g, "<br />"),
        }}
      />
    </div>
  );
}

function readFileAsText(file: Blob): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = () => {
      resolve((fileReader.result as string) || "");
    };

    fileReader.onerror = reject;

    fileReader.readAsText(file);
  });
}

function convertToTable(text: string): string {
  const [header, ...rows] = text.split("\n").map((row) => {
    return row.split(",");
  });

  let convertedText = "|" + header.join("|") + "|h";

  rows.forEach((row) => {
    convertedText = convertedText + "\n |" + row.join("|") + "|";
  });

  return convertedText;
}

export default App;
