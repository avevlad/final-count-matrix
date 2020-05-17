import * as csv from "async-csv";
import { promises as fs } from "fs";

async function csvToJson(file_name: string, ignore_header: boolean = false) {
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
  let a = await csvToJson(a_file_name, true);
  let b = await csvToJson(b_file_name, true);
  let all = a.concat(b);
  let a_mir = a.map(([__]) => __);
  let b_mir = b.map(([__]) => __);
  let a_positive = a.filter(([__, v]) => parseFloat(v) > 0).map(([__]) => __);
  let a_negative = a.filter(([__, v]) => parseFloat(v) < 0).map(([__]) => __);
  let b_positive = b.filter(([__, v]) => parseFloat(v) > 0).map(([__]) => __);
  let b_negative = b.filter(([__, v]) => parseFloat(v) < 0).map(([__]) => __);

  // console.log("a_positive:", a_positive);
  // console.log("a_negative:", a_negative);

  // console.log("b_positive:", b_positive);
  // console.log("b_negative:", b_negative);
  // let diff_pos = a_positive.filter((__) => b_positive.includes(__));
  // let diff_neg = a_negative.filter((__) => b_negative.includes(__));

  let diff_mir = a_mir.filter((__) => b_mir.includes(__));
  console.log("diff_mir:", diff_mir);
  console.log("diff_mir:", diff_mir);
}

(async () => {
  // compare("Del997_WT", "WT_MF");
  compare("Del1338_WT", "WT_MF");
})();
