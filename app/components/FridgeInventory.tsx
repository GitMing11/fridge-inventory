// components/FridgeInventory.tsx
"use client";

import React, { useEffect, useState } from "react";
import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";

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
  const [categories, setCategories] = useState<Category[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [showModal, setShowModal] = useState(false);
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
        margin: "1rem auto",
        padding: "1rem",
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
        border: "1px solid #ccc",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "1.75rem",
          marginBottom: "2rem",
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
          border: "1px solid #ccc",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: "1.5rem",
        }}
      >
        재료 추가
      </button>

      <IngredientList
        ingredients={ingredients}
        sortKey={sortKey}
        sortOrder={sortOrder}
        onSortKeyChange={setSortKey}
        onSortOrderChange={setSortOrder}
        onConsume={handleConsume}
      />

      {showModal && (
        <IngredientForm
          categories={categories}
          setCategories={setCategories}
          onAdd={(newItem) => setIngredients([...ingredients, newItem])}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
