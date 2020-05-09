import * as csv from "async-csv";
import { promises as fs } from "fs";

(async () => {
  const filename = "down";
  const rawMap = {};
  const result = [];
  const csvString = await fs.readFile(`task2/data/${filename}.csv`, "utf-8");
  const rows = await csv.parse(csvString, {
    delimiter: ";",
  });
  const header = rows[0];

  for (let index = 1; index < rows.length; index++) {
    const element = rows[index];
    console.log("element", element);
    for (let j = 0; j < element.length; j++) {
      const _j = element[j];
      if (_j === "") {
        continue;
      }
      if (!rawMap[_j]) {
        rawMap[_j] = [];
      }

      rawMap[_j] = rawMap[_j].concat([header[j]]);
    }
  }

  for (const key in rawMap) {
    if (rawMap.hasOwnProperty(key)) {
      const element = rawMap[key];
      result.push([key].concat(element));
    }
  }

  console.table(result);
  const csvStr = await csv.stringify(result);
  await fs.writeFile(`task2/data/${filename}-result.csv`, csvStr);
})();
