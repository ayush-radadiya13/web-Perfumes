'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth } from './AuthProvider';
import { getWishlist, wishlistAdd, wishlistRemove, wishlistClear } from '../lib/api';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { token, user, isAuthenticated, mounted: authMounted } = useAuth();
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const userId = user?.id || user?._id;

  const refresh = useCallback(async () => {
    if (!token || !userId) {
      setProductIds([]);
      setProducts([]);
      setHydrated(true);
      return;
    }
    setLoading(true);
    try {
      const data = await getWishlist(String(userId), token);
      setProductIds(data.productIds || []);
      setProducts(data.products || []);
    } catch {
      setProductIds([]);
      setProducts([]);
    } finally {
      setLoading(false);
      setHydrated(true);
    }
  }, [token, userId]);

  useEffect(() => {
    if (!authMounted) return;
    if (!isAuthenticated || !userId) {
      setProductIds([]);
      setProducts([]);
      setHydrated(true);
      return;
    }
    refresh();
  }, [authMounted, isAuthenticated, userId, refresh]);

  const isInWishlist = useCallback(
    (productId) => productIds.includes(String(productId)),
    [productIds]
  );

  const toggle = useCallback(
    async (productId) => {
      if (!token || !userId) throw new Error('LOGIN_REQUIRED');
      const id = String(productId);
      const inList = productIds.includes(id);
      if (inList) {
        const data = await wishlistRemove(id, token);
        setProductIds(data.productIds || []);
        setProducts(data.products || []);
      } else {
        const data = await wishlistAdd(id, token);
        setProductIds(data.productIds || []);
        setProducts(data.products || []);
      }
    },
    [token, userId, productIds]
  );

  const remove = useCallback(
    async (productId) => {
      if (!token || !userId) return;
      const data = await wishlistRemove(String(productId), token);
      setProductIds(data.productIds || []);
      setProducts(data.products || []);
    },
    [token, userId]
  );

  const clear = useCallback(async () => {
    if (!token || !userId) return;
    await wishlistClear(String(userId), token);
    setProductIds([]);
    setProducts([]);
  }, [token, userId]);

  const count = productIds.length;

  const saleAlerts = useMemo(() => {
    return products.filter(
      (p) =>
        p &&
        p.compareAtPrice != null &&
        Number(p.compareAtPrice) > Number(p.price)
    );
  }, [products]);

  const value = useMemo(
    () => ({
      productIds,
      products,
      count,
      loading,
      hydrated,
      isInWishlist,
      toggle,
      remove,
      clear,
      refresh,
      saleAlerts,
    }),
    [
      productIds,
      products,
      count,
      loading,
      hydrated,
      isInWishlist,
      toggle,
      remove,
      clear,
      refresh,
      saleAlerts,
    ]
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist inside WishlistProvider');
  return ctx;
}
