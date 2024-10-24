export enum SupportedChainKey {
  Sui = "sui",
  Aptos = "aptos",
  Avalanche = "avalanche",
  Solana = "solana",
  Bsc = "bsc",
  Algorand = "algorand",
  Polkadot = "polkadot",
}

export interface ChainInfo {
  name: string;
}

export type BlockchainConfig = Record<SupportedChainKey, ChainInfo>;

export const blockchainConfig = (): BlockchainConfig => ({
    [SupportedChainKey.Sui]: {
        name: "Sui",
    },
    [SupportedChainKey.Aptos]: {
        name: "Aptos",
    },
    [SupportedChainKey.Avalanche]: {
        name: "Avalanche",
    },
    [SupportedChainKey.Solana]: {

        name: "Solana",
    },
    [SupportedChainKey.Bsc]: {
        name: "Binance Smart Chain",
    },
    [SupportedChainKey.Algorand]: {
        name: "Algorand",
    },
    [SupportedChainKey.Polkadot]: {
        name: "Polkadot",
    },
})
