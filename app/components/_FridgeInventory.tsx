"use client";

import React, { useEffect, useState } from "react";

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

export default function FridgeInventory() {
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    categoryId: 0,
    quantity: 0,
    unit: "",
    expiration: "",
    purchasedAt: "",
  });
  const [newCategory, setNewCategory] = useState("");
  const [sortKey, setSortKey] = useState<
    "expiration" | "purchasedAt" | "category" | "name"
  >("expiration");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then(setCategories);
    fetch("/api/ingredients")
      .then((res) => res.json())
      .then(setIngredients);
  }, []);

  const handleAdd = async () => {
    if (
      !newIngredient.name ||
      newIngredient.categoryId === 0 ||
      !newIngredient.unit ||
      !newIngredient.expiration ||
      !newIngredient.purchasedAt
    ) {
      alert("모든 필드를 채워주세요");
      return;
    }
    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIngredient),
    });

    if (res.ok) {
      const added = await res.json();
      setIngredients([...ingredients, added]);
      setNewIngredient({
        name: "",
        categoryId: 0,
        quantity: 0,
        unit: "",
        expiration: "",
        purchasedAt: "",
      });
    } else {
      alert("추가 실패");
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    });

    if (res.ok) {
      const created = await res.json();
      setCategories([...categories, created]);
      setNewIngredient({ ...newIngredient, categoryId: created.id });
      setNewCategory("");
    } else {
      alert("카테고리 추가 실패 (중복 이름 등)");
    }
  };

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("asc");
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

  const sortedIngredients = [...ingredients].sort((a, b) => {
    let comparison = 0;

    switch (sortKey) {
      case "expiration":
        comparison =
          new Date(a.expiration).getTime() - new Date(b.expiration).getTime();
        break;
      case "purchasedAt":
        comparison =
          new Date(a.purchasedAt).getTime() - new Date(b.purchasedAt).getTime();
        break;
      case "category":
        comparison = (a.category?.name || "").localeCompare(
          b.category?.name || ""
        );
        break;
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleConsume = async (id: number, status: "eaten" | "discarded") => {
    const res = await fetch(`/api/ingredients/${id}/consume`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (res.ok) {
      setIngredients((prev) => prev.filter((i) => i.id !== id));
    } else {
      alert("처리 실패");
    }
  };

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
        냉장고 재고 관리
      </h1>
      <button
        onClick={() => setShowModal(true)}
        style={{
          padding: "0.65rem 1.25rem",
          backgroundColor: "#444",
          color: "#fff",
          fontWeight: 500,
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: "1.5rem",
          fontSize: "0.95rem",
          transition: "background-color 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#333";
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#444";
        }}
      >
        재료 추가
      </button>

      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)} // 바깥 클릭 시 닫힘
        >
          <div
            onClick={(e) => e.stopPropagation()} // 내부 클릭 시 닫힘 방지
            style={{
              backgroundColor: "#fff",
              padding: "2rem",
              borderRadius: 8,
              width: "100%",
              maxWidth: 600,
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              position: "relative",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: "1rem" }}>재료 추가</h2>

            <section
              style={{
                border: "1px solid #ddd",
                borderRadius: 6,
                padding: "1.5rem",
                marginBottom: "2rem",
                backgroundColor: "#fff",
              }}
            >
              <h2
                style={{
                  marginBottom: "1rem",
                  fontSize: "1.1rem",
                  color: "#444",
                }}
              >
                재료 추가
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {[
                  {
                    label: "이름",
                    type: "text",
                    value: newIngredient.name,
                    onChange: (v: string) =>
                      setNewIngredient({ ...newIngredient, name: v }),
                    placeholder: "예: 재료",
                  },
                  { label: "카테고리", isSelect: true },
                  {
                    label: "수량",
                    type: "number",
                    value: newIngredient.quantity,
                    onChange: (v: string) =>
                      setNewIngredient({
                        ...newIngredient,
                        quantity: Number(v),
                      }),
                    placeholder: "예: 2",
                  },
                  {
                    label: "단위",
                    type: "text",
                    value: newIngredient.unit,
                    onChange: (v: string) =>
                      setNewIngredient({ ...newIngredient, unit: v }),
                    placeholder: "예: 개, g, ml 등",
                  },
                  {
                    label: "유통기한",
                    type: "date",
                    value: newIngredient.expiration,
                    onChange: (v: string) =>
                      setNewIngredient({ ...newIngredient, expiration: v }),
                  },
                  {
                    label: "구매일",
                    type: "date",
                    value: newIngredient.purchasedAt,
                    onChange: (v: string) =>
                      setNewIngredient({ ...newIngredient, purchasedAt: v }),
                  },
                ].map((field, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <label style={{ width: "80px", fontWeight: 500 }}>
                      {field.label}
                    </label>

                    {field.isSelect ? (
                      <>
                        <select
                          value={newIngredient.categoryId}
                          onChange={(e) =>
                            setNewIngredient({
                              ...newIngredient,
                              categoryId: Number(e.target.value),
                            })
                          }
                          style={{
                            flex: 1,
                            padding: "0.5rem",
                            fontSize: "1rem",
                            border: "1px solid #bbb",
                            borderRadius: 4,
                            backgroundColor: "#fff",
                            color: "#333",
                          }}
                        >
                          <option value={0}>카테고리 선택</option>
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>

                        <div
                          style={{
                            display: "flex",
                            gap: "0.5rem",
                            marginTop: "0.5rem",
                            flex: 1,
                          }}
                        >
                          <input
                            type="text"
                            placeholder="새 카테고리 입력"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            style={{
                              flex: 1,
                              padding: "0.5rem",
                              fontSize: "1rem",
                              border: "1px solid #bbb",
                              borderRadius: 4,
                              backgroundColor: "#fff",
                              color: "#333",
                            }}
                          />
                          <button
                            onClick={handleAddCategory}
                            style={{
                              padding: "0.5rem 1rem",
                              backgroundColor: "#666",
                              color: "white",
                              fontWeight: "500",
                              border: "none",
                              borderRadius: 4,
                              cursor: "pointer",
                            }}
                          >
                            추가
                          </button>
                        </div>
                      </>
                    ) : (
                      <input
                        type={field.type}
                        value={field.value}
                        onChange={(e) => field.onChange?.(e.target.value)}
                        placeholder={field.placeholder}
                        style={{
                          flex: 1,
                          padding: "0.5rem",
                          fontSize: "1rem",
                          border: "1px solid #bbb",
                          borderRadius: 4,
                          backgroundColor: "#fff",
                          color: "#333",
                        }}
                      />
                    )}
                  </div>
                ))}

                <button
                  onClick={handleAdd}
                  style={{
                    padding: "0.75rem",
                    backgroundColor: "#333",
                    color: "white",
                    fontWeight: "500",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginTop: "1rem",
                  }}
                >
                  추가
                </button>
              </div>
            </section>
          </div>
        </div>
      )}

      <section>
        <h2 style={{ marginBottom: "1rem", fontSize: "1.1rem", color: "#444" }}>
          재료 목록
        </h2>
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
                  onClick={() => key && handleSort(key as typeof sortKey)}
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
                  {key && getSortIcon(key as typeof sortKey)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {sortedIngredients.map((i) => (
              <tr key={i.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ textAlign: "center", padding: "0.5rem" }}>
                  {i.name}
                </td>
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
                    onClick={() => handleConsume(i.id, "eaten")}
                    style={{ marginRight: "0.5rem", color: "green" }}
                  >
                    완료
                  </button>
                  <button
                    onClick={() => handleConsume(i.id, "discarded")}
                    style={{ color: "red" }}
                  >
                    폐기
                  </button>
                </td>
              </tr>
            ))}
            {ingredients.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    padding: "1rem",
                    color: "#999",
                  }}
                >
                  등록된 재료가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
