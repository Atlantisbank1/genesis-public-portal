export const SUSDC_ASSET = {
  code: "SUSDC",
  issuer: "GCNVCJFLW6WSZOKPQPDBWKAOLEZVTGMSLKRL66RWIONM4BVJVCXAJDIU",
  network: "Stellar Public Network",
  homeDomain: "genesistrust.online",
};

export const STELLAR_LINKS = {
  issuer: `https://stellar.expert/explorer/public/account/${SUSDC_ASSET.issuer}`,
  asset: `https://stellar.expert/explorer/public/asset/${SUSDC_ASSET.code}-${SUSDC_ASSET.issuer}`,
  toml: "https://genesistrust.online/.well-known/stellar.toml",
};