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
    <div className="max-w-2xl mx-auto my-6 p-6 bg-white rounded-xl border border-pink-200 shadow-lg font-sans">
      <h1 className="text-center text-3xl font-extrabold mb-10 text-pink-600 select-none">
        🥕 냉장고 재고 관리 🥒
      </h1>

      <button
        onClick={() => setShowModal(true)}
        className="mb-8 px-6 py-3 bg-pink-400 text-white font-semibold rounded-full shadow-md hover:bg-pink-500 transition duration-300 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-pink-300"
      >
        재료 추가하기
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
