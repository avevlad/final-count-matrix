import * as csv from "async-csv";
import { promises as fs } from "fs";

let files = {
  Del997_WT: "Del997_WT",
  Del1338_WT: "Del1338_WT",
  WT_MF: "WT_MF",
};

type Row = string[];

async function csvToJson<T>(
  file_name: string,
  ignore_header: boolean = false
): Promise<Array<T>> {
  const csvString = await fs.readFile(`task3/data/${file_name}.csv`, "utf-8");
  const rows: any[] = await csv.parse(csvString, {
    delimiter: "\t",
  });

  if (ignore_header) {
    return rows.filter((__, i) => i !== 0);
  }

  return rows;
}

async function compare(a_file_name: string, b_file_name: string) {
  let header = ["miR", a_file_name, b_file_name];

  let res: any[] = [header];
  let a = await csvToJson<Row>(a_file_name, true);
  let b = await csvToJson<Row>(b_file_name, true);
  let all = a.concat(b);
  let a_mir = a.map(([__]) => __);
  let b_mir = b.map(([__]) => __);

  let a_positive = a.filter(([__, v]) => parseFloat(v) > 0).map(([__]) => __);
  let a_negative = a.filter(([__, v]) => parseFloat(v) < 0).map(([__]) => __);
  let b_positive = b.filter(([__, v]) => parseFloat(v) > 0).map(([__]) => __);
  let b_negative = b.filter(([__, v]) => parseFloat(v) < 0).map(([__]) => __);

  function findValue(arr: Row[], mir: string) {
    let res = arr.filter((__) => __[0] === mir);
    if (res.length === 0) {
      return null;
    }

    return parseFloat(res[0][1]);
  }

  // console.log("a_positive:", a_positive);
  // console.log("a_negative:", a_negative);

  // console.log("b_positive:", b_positive);
  // console.log("b_negative:", b_negative);
  // let diff_pos = a_positive.filter((__) => b_positive.includes(__));
  // let diff_neg = a_negative.filter((__) => b_negative.includes(__));

  let diff_mir = a_mir.filter((__) => b_mir.includes(__));
  // let all_without_diff = all.filter(())
  // console.log("diff_mir:", diff_mir);
  // console.log("diff_mir:", diff_mir);
  console.log(all.length);

  console.log("element:", diff_mir);
  let not_common_list = all.filter(([__]) => !diff_mir.includes(__));

  console.log(not_common_list.length);
  console.log(diff_mir.length);

  for (let index = 0; index < diff_mir.length; index++) {
    const element = diff_mir[index];
    let a_file_res = findValue(a, element);
    let b_file_res = findValue(b, element);

    res.push([element, a_file_res, b_file_res]);
  }

  for (let index = 0; index < not_common_list.length; index++) {
    const [mir, v] = not_common_list[index];
    let a_file_res = findValue(a, mir);
    let b_file_res = findValue(b, mir);

    res.push([mir, a_file_res || "null", b_file_res || "null"]);
  }

  const csvStr = await csv.stringify(res, {
    delimiter: "\t",
    quoted_empty: true,
  });

  await fs.writeFile(
    `task3/data/res-${a_file_name}--${b_file_name}.csv`,
    csvStr
  );

  console.log("res:", res);
}

(async () => {
  compare(files.Del1338_WT, files.WT_MF);
  compare(files.Del997_WT, files.WT_MF);
})();
