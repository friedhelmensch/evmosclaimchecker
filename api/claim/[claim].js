const claiming = require("../_claiming");

export default function handler(request, response) {
  claiming(request.query.claim, response.status(200).send);
}
