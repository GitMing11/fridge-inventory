// app/hooks/useSort.ts
import { useState, useMemo } from 'react';

type SortOrder = 'asc' | 'desc';

export function useSort<T>(
  data: T[],
  initialKey: keyof T | 'category',
  initialOrder: SortOrder = 'asc'
) {
  const [sortKey, setSortKey] = useState(initialKey);
  const [sortOrder, setSortOrder] = useState<SortOrder>(initialOrder);

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a: any, b: any) => {
      let compare = 0;
      
      // 특수 케이스: 카테고리 (객체 내부 속성 접근)
      if (sortKey === 'category') {
        compare = (a.category?.name || '').localeCompare(b.category?.name || '');
      } 
      // 일반 케이스: 문자열/숫자/날짜 비교
      else if (['expiration', 'purchasedAt'].includes(String(sortKey))) {
        compare = new Date(a[sortKey]).getTime() - new Date(b[sortKey]).getTime();
      } else if (typeof a[sortKey] === 'string') {
        compare = a[sortKey].localeCompare(b[sortKey]);
      } else {
        compare = a[sortKey] - b[sortKey];
      }

      return sortOrder === 'asc' ? compare : -compare;
    });
  }, [data, sortKey, sortOrder]);

  return { sortedData, sortKey, sortOrder, handleSort, setSortKey, setSortOrder };
}