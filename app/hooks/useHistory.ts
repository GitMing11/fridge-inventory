// hooks/useHistory.ts
import { useState, useEffect, useCallback } from 'react';
import { HistoryItem } from '../../types';
import { getHistoryAction } from '../actions/historyActions';
import toast from 'react-hot-toast';

export function useHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  
const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      // Server Action 호출
      const result = await getHistoryAction();

      if (result.success && result.data) {
        // DB의 Date 객체를 프론트엔드용 string으로 변환
        const formattedHistory: HistoryItem[] = result.data.map((item) => ({
          ...item,
          expiration: new Date(item.expiration).toISOString(),
          purchasedAt: new Date(item.purchasedAt).toISOString(),
          consumedAt: new Date(item.consumedAt).toISOString(),
          status: item.status as 'eaten' | 'discarded',
        }));
        setHistory(formattedHistory);
      } else {
        toast.error(result.error || '히스토리를 불러오지 못했습니다.');
      }
    } catch (error) {
      console.error(error);
      toast.error('오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  return { history, loading, refreshHistory: fetchHistory };
}