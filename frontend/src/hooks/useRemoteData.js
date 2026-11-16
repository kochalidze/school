import { useEffect, useState } from 'react';
import { api } from '../api/client.js';
// backend-ის გარეშე ჩუმად იყენებს mock მონაცემებს
export function useRemoteData(path, fallback = []) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let alive = true;
    api(path).then((d) => alive && setData(d)).catch(() => {}).finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, [path]);
  return { data, loading };
}
