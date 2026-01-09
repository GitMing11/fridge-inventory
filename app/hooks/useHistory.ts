// hooks/useHistory.ts
import { useState, useEffect } from 'react';
import { HistoryItem } from '../../types';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/history')
      .then((res) => {
        if (!res.ok) throw new Error('API 호출 실패');
        return res.json();
      })
      .then((data) => {
        setHistory(data);
        setError(null);
      })
      .catch((e) => {
        console.error(e);
        setError('기록을 불러오는 데 실패했습니다.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { history, loading, error };
}