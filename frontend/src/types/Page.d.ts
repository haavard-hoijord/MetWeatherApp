export type Page = {
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  apiUrl: string;
};
