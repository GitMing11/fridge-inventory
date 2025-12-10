import React from "react";

interface Category {
  id: number;
  name: string;
}

interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  category?: Category;
  quantity: number;
  unit: string;
  expiration: string;
  purchasedAt: string;
  createdAt: string;
}

interface Props {
  ingredients: Ingredient[];
  sortKey: "expiration" | "purchasedAt" | "category" | "name";
  sortOrder: "asc" | "desc";
  onSortKeyChange: (key: Props["sortKey"]) => void;
  onSortOrderChange: (order: Props["sortOrder"]) => void;
  onConsume: (id: number, status: "eaten" | "discarded") => void;
}

export default function IngredientList({
  ingredients,
  sortKey,
  sortOrder,
  onSortKeyChange,
  onSortOrderChange,
  onConsume,
}: Props) {
  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      onSortOrderChange(sortOrder === "asc" ? "desc" : "asc");
    } else {
      onSortKeyChange(key);
      onSortOrderChange("asc");
    }
  };

  const getSortIcon = (key: typeof sortKey) => {
    if (key !== sortKey)
      return <span style={{ marginLeft: 4, color: "#bbb" }}>⇅</span>;
    return (
      <span style={{ marginLeft: 4, color: "#333" }}>
        {sortOrder === "asc" ? "▲" : "▼"}
      </span>
    );
  };

  const sorted = [...ingredients].sort((a, b) => {
    let compare = 0;
    switch (sortKey) {
      case "expiration":
        compare =
          new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
        break;
      case "purchasedAt":
        compare =
          new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime();
        break;
      case "category":
        compare = (a.category?.name || "").localeCompare(
          b.category?.name || ""
        );
        break;
      case "name":
        compare = a.name.localeCompare(b.name);
        break;
    }
    return sortOrder === "asc" ? compare : -compare;
  });

  return (
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
          {[
            { key: "name", label: "이름" },
            { key: null, label: "수량" },
            { key: null, label: "단위" },
            { key: "category", label: "카테고리" },
            { key: "expiration", label: "유통기한" },
            { key: "purchasedAt", label: "구매일" },
            { key: null, label: "등록일" },
            { key: null, label: "처리" },
          ].map(({ key, label }) => (
            <th
              key={label}
              onClick={() => key && handleSort(key as Props["sortKey"])}
              style={{
                textAlign: "center",
                padding: "0.6rem",
                borderBottom: "1px solid #ccc",
                fontWeight: 500,
                cursor: key ? "pointer" : "default",
                userSelect: "none",
                color: key ? "#000" : "#666",
              }}
            >
              {label}
              {key && getSortIcon(key as Props["sortKey"])}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {sorted.map((i) => (
          <tr key={i.id} style={{ borderBottom: "1px solid #ddd" }}>
            <td style={{ textAlign: "center", padding: "0.5rem" }}>{i.name}</td>
            <td style={{ textAlign: "center" }}>{i.quantity}</td>
            <td style={{ textAlign: "center" }}>{i.unit}</td>
            <td style={{ textAlign: "center" }}>{i.category?.name}</td>
            <td style={{ textAlign: "center" }}>
              {new Date(i.expiration).toLocaleDateString()}
            </td>
            <td style={{ textAlign: "center" }}>
              {new Date(i.purchasedAt).toLocaleDateString()}
            </td>
            <td style={{ textAlign: "center", color: "#777" }}>
              {new Date(i.createdAt).toLocaleDateString()}
            </td>
            <td style={{ textAlign: "center" }}>
              <button
                onClick={() => onConsume(i.id, "eaten")}
                style={{
                  marginRight: "0.5rem",
                  backgroundColor: "#a5d6a7", // 부드러운 그린
                  color: "#2e7d32",
                  border: "1px solid #81c784",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#81c784";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#a5d6a7";
                }}
              >
                완료
              </button>

              <button
                onClick={() => onConsume(i.id, "discarded")}
                style={{
                  backgroundColor: "#ef9a9a", // 부드러운 레드
                  color: "#b71c1c",
                  border: "1px solid #e57373",
                  padding: "0.35rem 0.75rem",
                  borderRadius: "12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  cursor: "pointer",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = "#e57373";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = "#ef9a9a";
                }}
              >
                폐기
              </button>
            </td>
          </tr>
        ))}

        {ingredients.length === 0 && (
          <tr>
            <td
              colSpan={8}
              style={{ textAlign: "center", padding: "1rem", color: "#999" }}
            >
              등록된 재료가 없습니다.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
