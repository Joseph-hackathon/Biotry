// Comprehensive dummy mock for @coinbase/wallet-sdk to resolve build-blocking corruptions
export class CoinbaseWalletSDK {
    constructor() {}
    makeWeb3Provider() { return {}; }
    disconnect() {}
}

export class CoinbaseWalletProvider {
    constructor() {}
    request() { return Promise.resolve(null); }
    on() {}
    removeListener() {}
}

// Mock missing utility exports
export const isDarkMode = () => false;
export const getLocation = () => window.location;
export const getFavicon = () => "";
export const createSigner = () => ({});
export const fetchSignerType = () => Promise.resolve("scw");
export const loadSignerType = () => "scw";
export const storeSignerType = () => {};

export const createCoinbaseWalletSDK = (params) => new CoinbaseWalletSDK(params);

export default CoinbaseWalletSDK;
