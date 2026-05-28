import { useState } from "react";

const FIELD = {
  width: "100%", padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff",
  color: "#111827",
  fontSize: 15, boxSizing: "border-box",
};

const LABEL = {
  display: "block", fontSize: 13, fontWeight: 500,
  color: "#6b7280", marginBottom: 6
};

const TERMS = [
  { label: "6개월", val: "6" }, { label: "12개월", val: "12" },
  { label: "24개월", val: "24" }, { label: "36개월", val: "36" },
  { label: "60개월 (5년)", val: "60" },
];

const TYPES = ["정기예금", "적금", "청년도약계좌"];

export default function SavingForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    age: "", annualIncome: "", monthlyDeposit: "",
    termMonths: "12", productTypes: ["적금", "청년도약계좌"],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (t) => setForm(f => ({
    ...f,
    productTypes: f.productTypes.includes(t)
      ? f.productTypes.filter(x => x !== t)
      : [...f.productTypes, t],
  }));

  // 기간 선택 버튼 스타일
  const termChip = (active) => ({
    padding: "7px 16px",
    borderRadius: "8px",
    border: active ? "2px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#dbeafe" : "#ffffff",
    color: active ? "#1d4ed8" : "#6b7280",
    fontWeight: active ? 600 : 400,
    cursor: "pointer", fontSize: 13,
  });

  // 상품 선택 버튼 스타일
  const typeChip = (active) => ({
    padding: "7px 16px",
    borderRadius: "8px",
    border: active ? "2px solid #16a34a" : "1px solid #d1d5db",
    background: active ? "#dcfce7" : "#ffffff",
    color: active ? "#15803d" : "#6b7280",
    fontWeight: active ? 600 : 400,
    cursor: "pointer", fontSize: 13,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      age:            Number(form.age),
      annualIncome:   Number(form.annualIncome.replace(/,/g, "")),
      monthlyDeposit: Number(form.monthlyDeposit.replace(/,/g, "")),
      termMonths:     Number(form.termMonths),
      productTypes:   form.productTypes,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#f9fafb",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: 24, marginBottom: 32,
    }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div>
          <label style={LABEL}>나이</label>
          <input type="number" min="19" max="65" required placeholder="예: 28"
            value={form.age} onChange={e => set("age", e.target.value)} style={FIELD} />
        </div>
        <div>
          <label style={LABEL}>연소득 (원)</label>
          <input type="text" required placeholder="예: 36,000,000"
            value={form.annualIncome} onChange={e => set("annualIncome", e.target.value)} style={FIELD} />
        </div>
        <div>
          <label style={LABEL}>월 납입 가능 금액 (원)</label>
          <input type="text" required placeholder="예: 500,000"
            value={form.monthlyDeposit} onChange={e => set("monthlyDeposit", e.target.value)} style={FIELD} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>희망 저축 기간</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TERMS.map(({ label, val }) => (
            <button key={val} type="button"
              onClick={() => set("termMonths", val)}
              style={termChip(form.termMonths === val)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <label style={LABEL}>관심 상품 (복수 선택)</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t} type="button"
              onClick={() => toggle(t)}
              style={typeChip(form.productTypes.includes(t))}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading} style={{
        width: "100%", padding: 12, border: "none",
        borderRadius: "8px",
        background: loading ? "#9ca3af" : "#111827",
        color: "#ffffff",
        fontSize: 15, fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
      }}>
        {loading ? "분석 중..." : "저축 상품 추천받기"}
      </button>
    </form>
  );
}
