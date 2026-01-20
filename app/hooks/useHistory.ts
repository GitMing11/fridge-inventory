// hooks/useHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../../types';
import { getHistoryAction } from '../actions/historyActions';
import toast from 'react-hot-toast';

interface DbHistoryItem {
  id: number;
  name: string;
  categoryName: string;
  categoryColor: string;
  quantity: number;
  unit: string;
  expiration: Date;
  purchasedAt: Date;
  consumedAt: Date;
  status: string;
}

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

const fetchHistory = useCallback(async () => {
  setLoading(true);
  setError(null);
    try {
      // Server Action 호출
      const result = await getHistoryAction();

      if (result.success && result.data) {
        const dbData = result.data as DbHistoryItem[];
        const formattedHistory: HistoryItem[] = dbData.map((item) => ({
          ...item,
          
          categoryColor: item.categoryColor || 'gray',

          expiration: new Date(item.expiration).toISOString(),
          purchasedAt: new Date(item.purchasedAt).toISOString(),
          consumedAt: new Date(item.consumedAt).toISOString(),
          status: item.status as 'eaten' | 'discarded',
        }));
        setHistory(formattedHistory);
      } else {
        const errorMessage = result.error || '히스토리를 불러오지 못했습니다.';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error(error);
      setError('오류가 발생했습니다.');
      toast.error('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, error, refreshHistory: fetchHistory };
}