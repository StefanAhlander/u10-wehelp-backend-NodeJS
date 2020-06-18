const mongoose = require('mongoose');

module.exports = [
  {
    title: "köpa mat",
    category: "handla",
    description: "Jag behöver hjälp med att köpa mat från lokala ICA.",
    owner: mongoose.Types.ObjectId(),
    performers: [mongoose.Types.ObjectId(), mongoose.Types.ObjectId()],
  }, {
    title: "handla mat",
    category: "handla",
    description: "Jag behöver hjälp med att köpa mat från lokala Coop.",
    owner: mongoose.Types.ObjectId(),
    performers: [],
  }
];