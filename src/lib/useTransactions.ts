"use client";

import { useEffect } from "react";
import useSWR, { mutate as globalMutate } from "swr";
import { supabase } from "./supabase";

export interface TransactionItem {
  id: string;
  name: string;
  email: string;
  amount: string;
  rawAmount: number;
  currency: string;
  currencySymbol: string;
  designation: string;
  status: "Completed" | "Pending" | "Failed" | string;
  date: string;
  avatar: string;
  color: string;
  isAnonymous: boolean;
  campaign_id?: string | null;
  created_at?: string;
}

export const TRANSACTIONS_KEY = "/api/transactions";
const STORAGE_KEY = "crc_cached_transactions";

const transactionsFetcher = async (url: string): Promise<TransactionItem[]> => {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to fetch transactions");
    const data = await res.json();
    if (Array.isArray(data)) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch {
          // ignore
        }
      }
      return data;
    }
  } catch (err) {
    console.warn("API transactions fetch error, checking cache:", err);
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {
        // ignore
      }
    }
  }

  return [];
};

export function useTransactions(statusFilter?: string) {
  const url = statusFilter && statusFilter !== "All" 
    ? `/api/transactions?status=${encodeURIComponent(statusFilter)}` 
    : TRANSACTIONS_KEY;

  const { data, error, isLoading, isValidating, mutate } = useSWR<TransactionItem[]>(
    url,
    transactionsFetcher,
    {
      revalidateOnFocus: true,
      revalidateIfStale: true,
      dedupingInterval: 1000,
      keepPreviousData: false,
    }
  );

  // Live real-time updates from Supabase
  useEffect(() => {
    const channelId = `realtime-transactions-${Math.random().toString(36).substring(2, 9)}`;
    const channel = supabase
      .channel(channelId)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transactions" },
        () => {
          globalMutate(TRANSACTIONS_KEY);
          if (statusFilter) {
            globalMutate(url);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [url, statusFilter]);

  return {
    transactions: data ?? [],
    isLoading: isLoading && data === undefined,
    isValidating,
    isError: error,
    mutate,
  };
}

export async function addTransaction(payload: Partial<TransactionItem>): Promise<TransactionItem> {
  const res = await fetch("/api/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to add transaction");
  }

  const saved = await res.json();
  globalMutate(TRANSACTIONS_KEY);
  return saved;
}

