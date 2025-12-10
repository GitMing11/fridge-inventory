"use client";

import React, { useEffect, useState } from "react";

interface HistoryItem {
  id: number;
  name: string;
  categoryName: string;
  quantity: number;
  unit: string;
  expiration: string;
  purchasedAt: string;
  consumedAt: string;
  status: "eaten" | "discarded";
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => {
        if (!res.ok) throw new Error("API 호출 실패");
        return res.json();
      })
      .then((data) => {
        setHistory(data);
        setError(null);
      })
      .catch((e) => {
        console.error(e);
        setError("기록을 불러오는 데 실패했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div
      style={{
        maxWidth: 650,
        margin: "2rem auto",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
        padding: "2rem",
        borderRadius: 8,
        border: "1px solid #ccc",
        color: "#333",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          marginBottom: "2rem",
          color: "#222",
          fontWeight: 500,
          fontSize: "1.75rem",
        }}
      >
        소비 / 폐기 히스토리
      </h1>

      {loading ? (
        <p style={{ textAlign: "center", color: "#666" }}>
          기록을 불러오는 중입니다...
        </p>
      ) : error ? (
        <p style={{ textAlign: "center", color: "red" }}>{error}</p>
      ) : history.length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          아직 기록이 없습니다.
        </p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.95rem",
            color: "#333",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={headerCellStyle}>이름</th>
              <th style={headerCellStyle}>카테고리</th>
              <th style={headerCellStyle}>수량</th>
              <th style={headerCellStyle}>단위</th>
              <th style={headerCellStyle}>상태</th>
              <th style={headerCellStyle}>소비/폐기일</th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={cellStyle}>{item.name}</td>
                <td style={cellStyle}>{item.categoryName}</td>
                <td style={cellStyle}>{item.quantity}</td>
                <td style={cellStyle}>{item.unit}</td>
                <td
                  style={{
                    ...cellStyle,
                    color: item.status === "eaten" ? "green" : "red",
                    fontWeight: 500,
                  }}
                >
                  {item.status === "eaten" ? "사용 완료" : "폐기"}
                </td>
                <td style={cellStyle}>
                  {new Date(item.consumedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const headerCellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "0.6rem",
  borderBottom: "1px solid #ccc",
  fontWeight: 500,
  color: "#000",
};

const cellStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "0.5rem",
};
