"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { BrandData } from "@/lib/types";
import { MOCK_BRANDS } from "@/lib/mock-data";
import { getUserBrandsAction } from "@/app/actions/brand-actions";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface BrandContextType {
  currentBrand: BrandData;
  setCurrentBrand: (brand: BrandData) => void;
  brands: BrandData[];
  isLoading: boolean;
  refreshBrands: () => Promise<void>;
  updateActiveBrand: (brand: BrandData) => void;
  selectBrandById: (brandId: string) => void;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

// Internal inner provider to safely consume search params
function BrandStateConsumer({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [brands, setBrands] = useState<BrandData[]>(MOCK_BRANDS);
  const [currentBrand, setCurrentBrandState] = useState<BrandData>(MOCK_BRANDS[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Sync active brand with ?brand=id query parameter
  const syncWithUrl = useCallback(
    (brandList: BrandData[], urlBrandId: string | null) => {
      if (!brandList || brandList.length === 0) return;

      if (urlBrandId) {
        const found = brandList.find((b) => b.id === urlBrandId);
        if (found) {
          setCurrentBrandState(found);
          return;
        }
      }

      // Check if currentBrand is still valid in list
      setCurrentBrandState((prev) => {
        const existing = brandList.find((b) => b.id === prev.id);
        return existing || brandList[0];
      });
    },
    []
  );

  // Initial fetch of user brands from DB/server action
  const loadBrands = useCallback(async () => {
    try {
      setIsLoading(true);
      const userBrands = await getUserBrandsAction();
      const list = userBrands && userBrands.length > 0 ? userBrands : MOCK_BRANDS;
      setBrands(list);

      const urlParam = searchParams.get("brand");
      syncWithUrl(list, urlParam);
    } catch (err) {
      console.warn("Could not load brands from server:", err);
      setBrands(MOCK_BRANDS);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams, syncWithUrl]);

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  // When search parameter changes externally (e.g. browser back/forward)
  useEffect(() => {
    const brandParam = searchParams.get("brand");
    if (brandParam && brandParam !== currentBrand.id) {
      const match = brands.find((b) => b.id === brandParam);
      if (match) {
        setCurrentBrandState(match);
      }
    }
  }, [searchParams, brands, currentBrand.id]);

  // Updates current brand and syncs ?brand=id into URL
  const setCurrentBrand = useCallback(
    (brand: BrandData) => {
      setCurrentBrandState(brand);

      // Update URL search parameters without full reload
      if (typeof window !== "undefined") {
        const currentUrl = new URL(window.location.href);
        currentUrl.searchParams.set("brand", brand.id);
        window.history.replaceState(null, "", currentUrl.toString());
      }
    },
    []
  );

  const selectBrandById = useCallback(
    (brandId: string) => {
      const brand = brands.find((b) => b.id === brandId);
      if (brand) {
        setCurrentBrand(brand);
      }
    },
    [brands, setCurrentBrand]
  );

  // Directly update active brand data in memory (e.g. after editing profile)
  const updateActiveBrand = useCallback((updatedBrand: BrandData) => {
    setCurrentBrandState(updatedBrand);
    setBrands((prev) =>
      prev.map((b) => (b.id === updatedBrand.id ? updatedBrand : b))
    );
  }, []);

  return (
    <BrandContext.Provider
      value={{
        currentBrand,
        setCurrentBrand,
        brands,
        isLoading,
        refreshBrands: loadBrands,
        updateActiveBrand,
        selectBrandById,
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export function BrandProvider({ children }: { children: ReactNode }) {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50" />}>
      <BrandStateConsumer>{children}</BrandStateConsumer>
    </React.Suspense>
  );
}

export function useBrand() {
  const context = useContext(BrandContext);
  if (!context) {
    throw new Error("useBrand must be used within a BrandProvider");
  }
  return context;
}
