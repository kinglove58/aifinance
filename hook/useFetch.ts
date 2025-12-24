import { useState } from "react";
import { toast } from "sonner";

type AsyncCallback<TArgs extends unknown[], TData> = (
  ...args: TArgs
) => Promise<TData>;

const useFetch = <TData, TArgs extends unknown[] = []>(
  cb: AsyncCallback<TArgs, TData>
) => {
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TData | null>(null);

  const fetchData = async (...args: TArgs) => {
    setLoading(true);
    setError(null);
    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
    } catch (error) {
      if (error instanceof Error) {
        setError(error);
        toast.error(error.message);
      } else {
        setError(new Error("An unknown error occurred"));
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    error,
    loading,
    fetchData,
    setData,
  };
};

export default useFetch;
