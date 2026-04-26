"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  isConnected,
  getAddress,
  getNetwork,
  requestAccess,
} from "@stellar/freighter-api";

interface WalletState {
  address: string | null;
  network: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

interface WalletContextValue extends WalletState {
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WalletState>({
    address: null,
    network: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  // Restore session on mount
  useEffect(() => {
    (async () => {
      try {
        const connected = await isConnected();
        if (connected?.isConnected) {
          const [addrResult, netResult] = await Promise.all([
            getAddress(),
            getNetwork(),
          ]);
          if (addrResult?.address) {
            setState({
              address: addrResult.address,
              network: netResult?.network ?? null,
              isConnected: true,
              isLoading: false,
              error: null,
            });
          }
        }
      } catch {
        // Freighter not installed or not connected — silent fail
      }
    })();
  }, []);

  const connect = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const accessResult = await requestAccess();
      if (accessResult?.error) {
        setState((s) => ({
          ...s,
          isLoading: false,
          error: accessResult.error ?? "Connection rejected",
        }));
        return;
      }
      const [addrResult, netResult] = await Promise.all([
        getAddress(),
        getNetwork(),
      ]);
      setState({
        address: addrResult?.address ?? null,
        network: netResult?.network ?? null,
        isConnected: !!addrResult?.address,
        isLoading: false,
        error: null,
      });
    } catch (err) {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to connect wallet",
      }));
    }
  }, []);

  const disconnect = useCallback(() => {
    setState({
      address: null,
      network: null,
      isConnected: false,
      isLoading: false,
      error: null,
    });
  }, []);

  return (
    <WalletContext.Provider value={{ ...state, connect, disconnect }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): WalletContextValue {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within WalletProvider");
  return ctx;
}
