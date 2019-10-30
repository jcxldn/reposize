const a = require("./index");

a.GetBytes("mdmulti", "client-unity").then(res => console.log("Bytes: " + res));

a.GetPrettyBytes("mdmulti", "client-unity").then(res =>
  console.log("Pretty: " + res)
);
