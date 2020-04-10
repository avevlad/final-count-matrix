const csv = require('async-csv');
const fs = require('fs').promises;

const size = 3;

(async () => {
    const rawList = [];
    const rawMap = [];
    const result = [];

    const files = await fs.readdir(('./counts'));
    const header = ["mmT-miR__KEY"].concat(files.map((__)=> __.replace(".txt", "")));
    result.push(header);

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const csvString = await fs.readFile(`./counts/${file}`);

        const rows = await csv.parse(csvString, {
            delimiter: "\t"
        });


        const map = {};
        for (let j = 0; j < rows.length; j++) {
            const row = rows[j];
            map[row[0]] = row[1];
        }

        rawMap.push(map);
        rawList.push(rows);
    }

    const uniqKeys = rawList
        .reduce((acc, cur) => acc.concat(cur), [])
        .map((_) => _[0])
        .filter((v, i, a) => a.indexOf(v) === i);


    for (let i = 0; i < uniqKeys.length; i++) {
        const key = uniqKeys[i];
        const cell = [key];

        for (let j = 0; j < rawMap.length; j++) {
            const rawMapElement = rawMap[j];
            const value = rawMapElement[key] || "zero";
            cell.push(value)
        }

        result.push(cell);
    }

    const csvStr = await csv.stringify(result);

    await fs.writeFile("final-result.csv", csvStr);
})();
