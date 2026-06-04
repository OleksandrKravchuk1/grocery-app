export const ROUTES = {
  HOME: "/",
  CATEGORIES: {
    ROOT: "/categories",
    ITEM: (id: string) => `/categories/${id}`,
  },
  FAVOURITE: {
    ROOT: "/favourite",
    ITEM: (id: string) => `/favourite/${id}`,
  },
  ORDERS: {
    ROOT: "/orders",
    ITEM: (id: string) => `/orders/${id}`,
  },
  PRODUCTS: {
    ROOT: "/products",
    ITEM: (id: string) => `/products/${id}`,
  },
  CART: {
    ROOT: "/cart",
  },
  CHECKOUT: {
    ROOT: "/checkout",
    STEP: (step: string) => `/checkout/${step}`,
  },
  PROFILE: {
    ROOT: "/profile",
  },
  SEARCH: {
    ROOT: "/search",
    RESULTS: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : "/search"),
  },
} as const;

export type Routes = typeof ROUTES;