// components/IngredientForm.tsx
import React, { useState } from "react";

interface Category {
  id: number;
  name: string;
}

interface Ingredient {
  id: number;
  name: string;
  categoryId: number;
  quantity: number;
  unit: string;
  expiration: string;
  purchasedAt: string;
  createdAt: string;
}

interface Props {
  categories: Category[];
  setCategories: React.Dispatch<React.SetStateAction<Category[]>>;
  onAdd: (newItem: Ingredient) => void;
  onClose: () => void;
}
function getToday(): string {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function IngredientForm({
  categories,
  setCategories,
  onAdd,
  onClose,
}: Props) {
  const [newIngredient, setNewIngredient] = useState({
    name: "",
    categoryId: 0,
    quantity: 0,
    unit: "",
    expiration: getToday(),
    purchasedAt: getToday(),
  });

  const [newCategory, setNewCategory] = useState("");

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;

    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() }),
    });

    if (res.ok) {
      const created = await res.json();
      setCategories((prev) => [...prev, created]);
      setNewIngredient({ ...newIngredient, categoryId: created.id });
      setNewCategory("");
    } else {
      alert("카테고리 추가 실패");
    }
  };

  const handleSubmit = async () => {
    const { name, categoryId, quantity, unit, expiration, purchasedAt } =
      newIngredient;
    if (!name || !categoryId || !unit || !expiration || !purchasedAt) {
      alert("모든 필드를 채워주세요.");
      return;
    }

    const res = await fetch("/api/ingredients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIngredient),
    });

    if (res.ok) {
      const added = await res.json();
      onAdd(added);
      onClose();
    } else {
      alert("재료 추가 실패");
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 8,
          padding: "2rem",
          width: "100%",
          maxWidth: 600,
        }}
      >
        <h2 style={{ marginBottom: "1rem" }}>재료 추가</h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {/* 이름 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ width: 80 }}>이름</label>
            <input
              type="text"
              placeholder="예: 상추"
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, name: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          {/* 수량 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ width: 80 }}>수량</label>
            <input
              type="number"
              placeholder="예: 2"
              value={newIngredient.quantity}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  quantity: Number(e.target.value),
                })
              }
              style={inputStyle}
            />
          </div>

          {/* 단위 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ width: 80 }}>단위</label>
            <input
              type="text"
              placeholder="예: 개, g, ml"
              value={newIngredient.unit}
              onChange={(e) =>
                setNewIngredient({ ...newIngredient, unit: e.target.value })
              }
              style={inputStyle}
            />
          </div>

          {/* 카테고리 선택 + 새 카테고리 입력 + 추가 버튼 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ width: 80 }}>카테고리</label>

            <select
              value={newIngredient.categoryId}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  categoryId: Number(e.target.value),
                })
              }
              style={{
                ...inputStyle,
                flex: "0 0 120px", // 고정 너비 조금 작게 (120px)
                minWidth: 0,
                padding: "0.4rem 0.5rem", // 기존과 비슷하게 약간 줄임
                fontSize: "1rem",
              }}
            >
              <option value={0}>카테고리 선택</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="새 카테고리 입력"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              style={{
                ...inputStyle,
                flex: 1, // 남은 공간 전부 차지
                minWidth: 0,
              }}
            />
            <button
              onClick={handleAddCategory}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#666",
                color: "#fff",
                fontWeight: "bold",
                border: "none",
                borderRadius: 4,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              추가
            </button>
          </div>

          {/* 유통기한 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ width: 80 }}>유통기한</label>
            <input
              type="date"
              value={newIngredient.expiration}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  expiration: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* 구매일 */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <label style={{ width: 80 }}>구매일</label>
            <input
              type="date"
              value={newIngredient.purchasedAt}
              onChange={(e) =>
                setNewIngredient({
                  ...newIngredient,
                  purchasedAt: e.target.value,
                })
              }
              style={inputStyle}
            />
          </div>

          {/* 제출 버튼 */}
          <button
            onClick={handleSubmit}
            style={{
              marginTop: "1rem",
              padding: "0.75rem",
              backgroundColor: "#333",
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
      </div>
    </div>
  );
}

// 스타일 재사용
const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "0.5rem",
  fontSize: "1rem",
  border: "1px solid #bbb",
  borderRadius: 4,
  backgroundColor: "#fff",
  color: "#333",
};
