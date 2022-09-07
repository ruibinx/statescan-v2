const { getAddressCollection } = require("../index");

async function bulkUpdateAccounts(accounts = []) {
  if (accounts.length < 1) {
    return
  }

  const col = await getAddressCollection();
  const bulk = col.initializeUnorderedBulkOp();
  for (const { addr, detail } of accounts) {
    bulk
      .find({ address: addr })
      .upsert()
      .updateOne({
        $set: {
          ...detail,
        },
      });
  }

  await bulk.execute();
}

module.exports = {
  bulkUpdateAccounts,
}
