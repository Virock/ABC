const User = require("../models/User");
const Reward = require("../models/Reward");
const mail = require("../send_mail");
require("dotenv").load();

async function run() {
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  //Midnight
  yesterday.setHours(0, 0, 0, 0);
  //Get reward providers in the system who have rewards that were requested or claimed from till now (Assuming Midnight)
  const reward_providers = await Reward.find(
    {
      "users_who_claimed_this_reward.time": { $gte: yesterday }
    },
    { _id: false, reward_provider: true }
  );

  //If exists
  //Send emails
  const promises = [];
  reward_providers.forEach(element => {
    promises.push(mail.notifyRewardProvidersOfRequestOrClaim(element.reward_provider.email));
  });
  if (promises.length > 0) await Promise.all(promises);
}

module.exports = {
  run
}