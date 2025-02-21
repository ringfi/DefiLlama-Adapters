const retry = require('async-retry')
const axios = require("axios");
const BigNumber = require("bignumber.js");

function fetch(chainId) {
  return async () => {
    const url = 'https://europe-west3-wormhole-315720.cloudfunctions.net/mainnet-notionaltvl'
    const res = await retry(async bail => await axios.get(url))
    if (chainId in res.data.AllTime) {
      const tvl = res.data.AllTime[chainId]["*"].Notional
      return new BigNumber(tvl).toFixed(2)
    } else {
      throw "invalid ChainId supplied"
    }
  }
}

async function fetchAll() {
    const url = 'https://europe-west3-wormhole-315720.cloudfunctions.net/mainnet-notionaltvl'
    const res = await retry(async bail => await axios.get(url))
    return Number(res.data.AllTime["*"]["*"].Notional)
}

module.exports = {
  methodology: "USD value of native assets currently held by Wormhole contracts. Token prices sourced from CoinGecko.",
  solana: {
    fetch: fetch("1")
  },
  ethereum: {
    fetch: fetch("2")
  },
  bsc: {
    fetch: fetch("3")
  },
  terra: {
    fetch: fetch("4")
  },
  polygon: {
    fetch: fetch("5")
  },
  avax: {
    fetch: fetch("6")
  },
  oasis: {
    fetch: fetch("7")
  },
  fantom: {
    fetch: fetch("10")
  },
  fetch: fetchAll
}
