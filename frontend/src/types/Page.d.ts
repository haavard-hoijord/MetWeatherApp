export type Page = {
  setError: (error: string) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean;
  apiUrl: string;
};
