const Act = require("../models/Act");
const mail = require("../send_mail");
require("dotenv").load();

async function run() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const end = new Date();
  end.setHours(23, 59, 59, 999);

  await Act.updateMany(
    {
      $and: [
        { expiration_date: { $exists: true } },
        { expiration_date: { $gte: start } },
        { expiration_date: { $lt: end } }
      ]
    },
    {
      state: "NOT_AVAILABLE"
    }
  );
}
module.exports = {
  run
};
