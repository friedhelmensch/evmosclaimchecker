const axios = require("axios");
const { exec } = require("child_process");
var os = require("os");

const getClaims = (ethAddress, callback) => {
  process.env.HOME = os.tmpdir();
  exec(
    `${process.cwd()}/_files/evmosd debug addr ${ethAddress}`,
    (error, stdout, stderr) => {
      if (error) {
        callback(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        callback(`stderr: ${stderr}`);
        return;
      }

      const evmosAddress = stdout.split("\n")[3].split(":")[1].trim();

      axios
        .get(
          `https://rest.bd.evmos.org:1317/evmos/claims/v1/claims_records/${evmosAddress}`
        )
        .then((res) => {
          const result = {
            ethAddress,
            evmosAddress,
            claimable: (
              res.data.initial_claimable_amount / 1000000000000000000
            ).toFixed(2),
          };

          callback(result);
        })
        .catch((error) => {
          if (error.response.status === 404) {
            const result = {
              ethAddress,
              evmosAddress,
              claimable: 0,
            };
            callback(result);
          } else {
            callback(error);
          }
        });
    }
  );
};

module.exports = getClaims;
