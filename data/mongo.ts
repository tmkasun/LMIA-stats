var axios = require("axios");

export async function addEntry(batch: any) {
  const data = JSON.stringify({
    collection: "lmias",
    database: "ircc",
    dataSource: "ircc",
    documents: batch,
  });
  var config = {
    method: "post",
    url: "https://us-east-2.aws.data.mongodb-api.com/app/data-dwrlp/endpoint/data/v1/action/insertMany",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Request-Headers": "*",
      "api-key": "4DrgfRdPUaG6Mk8WpaR8wOQvQfMqR4t0CtcML1bipxmnTFDFevVLvIpab8XAbSSt",
    },
    data: data,
  };
  const res = await axios(config);
  return res;
}
