import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const TableSkeleton = ({ rows = 5, columns = 5 }) => {
  return (
    <>
      {[...Array(rows)].map((_, i) => (
        <tr key={i} className="animate-pulse">
          {[...Array(columns)].map((_, j) => (
            <td key={j} className="px-6 py-4">
              <Skeleton height={20} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default TableSkeleton;
