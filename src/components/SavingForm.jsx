import { useState, useEffect } from "react";

const FIELD = {
  width: "100%", padding: "10px 12px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  background: "#ffffff", color: "#111827",
  fontSize: 15, boxSizing: "border-box",
};
const LABEL = {
  display: "block", fontSize: 13, fontWeight: 500,
  color: "#6b7280", marginBottom: 6
};
const TERMS  = [
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

  // 포트폴리오 배분 금액 (상품별)
  const [allocation, setAllocation] = useState({});
  // 포트폴리오 모드 여부
  const [portfolioMode, setPortfolioMode] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggle = (t) => {
    const next = form.productTypes.includes(t)
      ? form.productTypes.filter(x => x !== t)
      : [...form.productTypes, t];
    setForm(f => ({ ...f, productTypes: next }));
    // 상품 제거 시 배분 금액도 제거
    if (form.productTypes.includes(t)) {
      setAllocation(a => { const n = {...a}; delete n[t]; return n; });
    }
  };

  // 총 납입 가능 금액 변경 시 청년도약계좌 자동 배분
  useEffect(() => {
    if (!portfolioMode) return;
    const total = Number(form.monthlyDeposit.replace(/,/g, ""));
    if (!total) return;

    const age    = Number(form.age);
    const income = Number(form.annualIncome.replace(/,/g, ""));
    const youthOk = age >= 19 && age <= 34 && income <= 75_000_000;

    if (youthOk && form.productTypes.includes("청년도약계좌")) {
      const youthAmount = Math.min(total, 700_000);
      const remaining   = total - youthAmount;
      const newAlloc    = { "청년도약계좌": youthAmount };

      // 나머지 상품들에 균등 배분
      const otherTypes = form.productTypes.filter(t => t !== "청년도약계좌");
      if (otherTypes.length > 0 && remaining > 0) {
        const perType = Math.floor(remaining / otherTypes.length);
        otherTypes.forEach(t => { newAlloc[t] = perType; });
      }
      setAllocation(newAlloc);
    }
  }, [form.monthlyDeposit, form.age, form.annualIncome, portfolioMode, form.productTypes]);

  // 배분 금액 합계
  const totalAllocated = Object.values(allocation).reduce((s, v) => s + (v || 0), 0);
  const totalBudget    = Number(form.monthlyDeposit.replace(/,/g, "")) || 0;
  const isOver         = totalAllocated > totalBudget;
  const isUnder        = totalAllocated < totalBudget;

  const termChip = (active) => ({
    padding: "7px 16px", borderRadius: "8px",
    border: active ? "2px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#dbeafe" : "#ffffff",
    color: active ? "#1d4ed8" : "#6b7280",
    fontWeight: active ? 600 : 400, cursor: "pointer", fontSize: 13,
  });

  const typeChip = (active) => ({
    padding: "7px 16px", borderRadius: "8px",
    border: active ? "2px solid #16a34a" : "1px solid #d1d5db",
    background: active ? "#dcfce7" : "#ffffff",
    color: active ? "#15803d" : "#6b7280",
    fontWeight: active ? 600 : 400, cursor: "pointer", fontSize: 13,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (portfolioMode && isOver) {
      alert("배분 합계가 월 납입 가능 금액을 초과했습니다.");
      return;
    }
    onSubmit({
      age:            Number(form.age),
      annualIncome:   Number(form.annualIncome.replace(/,/g, "")),
      monthlyDeposit: Number(form.monthlyDeposit.replace(/,/g, "")),
      termMonths:     Number(form.termMonths),
      productTypes:   form.productTypes,
      allocation:     portfolioMode ? allocation : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} style={{
      background: "#f9fafb", border: "1px solid #e5e7eb",
      borderRadius: "12px", padding: 24, marginBottom: 32,
    }}>
      {/* 기본 정보 */}
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
          <input type="text" required placeholder="예: 1,000,000"
            value={form.monthlyDeposit} onChange={e => set("monthlyDeposit", e.target.value)} style={FIELD} />
        </div>
      </div>

      {/* 저축 기간 */}
      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>희망 저축 기간</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TERMS.map(({ label, val }) => (
            <button key={val} type="button" onClick={() => set("termMonths", val)}
              style={termChip(form.termMonths === val)}>{label}</button>
          ))}
        </div>
      </div>

      {/* 관심 상품 */}
      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>관심 상품 (복수 선택)</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t} type="button" onClick={() => toggle(t)}
              style={typeChip(form.productTypes.includes(t))}>{t}</button>
          ))}
        </div>
      </div>

      {/* 포트폴리오 모드 토글 */}
      {form.productTypes.length >= 2 && (
        <div style={{ marginBottom: 20 }}>
          <button type="button"
            onClick={() => setPortfolioMode(p => !p)}
            style={{
              padding: "8px 16px", borderRadius: "8px", cursor: "pointer",
              border: portfolioMode ? "2px solid #7c3aed" : "1px solid #d1d5db",
              background: portfolioMode ? "#ede9fe" : "#ffffff",
              color: portfolioMode ? "#6d28d9" : "#6b7280",
              fontWeight: portfolioMode ? 600 : 400, fontSize: 13,
            }}>
            {portfolioMode ? "✅ 포트폴리오 모드 ON" : "💼 포트폴리오 모드로 금액 배분하기"}
          </button>
        </div>
      )}

      {/* 포트폴리오 배분 UI */}
      {portfolioMode && form.productTypes.length >= 2 && (
        <div style={{
          background: "#ffffff", border: "1px solid #e5e7eb",
          borderRadius: "8px", padding: 16, marginBottom: 20,
        }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#374151", marginBottom: 12 }}>
            💼 상품별 월 납입 금액 배분
          </div>

          {form.productTypes.map(type => (
            <div key={type} style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 10,
            }}>
              <div style={{
                width: 120, fontSize: 13, fontWeight: 500,
                color: type === "청년도약계좌" ? "#6d28d9" : "#374151",
              }}>
                {type}
                {type === "청년도약계좌" && (
                  <div style={{ fontSize: 11, color: "#9ca3af" }}>최대 70만원</div>
                )}
              </div>
              <input
                type="number"
                min="0"
                max={type === "청년도약계좌" ? 700000 : undefined}
                placeholder="0"
                value={allocation[type] || ""}
                onChange={e => setAllocation(a => ({
                  ...a, [type]: Number(e.target.value)
                }))}
                style={{ ...FIELD, width: 160 }}
              />
              <span style={{ fontSize: 13, color: "#6b7280" }}>원</span>
            </div>
          ))}

          {/* 합계 표시 */}
          <div style={{
            marginTop: 12, paddingTop: 12,
            borderTop: "1px solid #e5e7eb",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>배분 합계</span>
            <span style={{
              fontSize: 15, fontWeight: 600,
              color: isOver ? "#dc2626" : isUnder ? "#d97706" : "#16a34a",
            }}>
              {totalAllocated.toLocaleString()}원 / {totalBudget.toLocaleString()}원
              {isOver  && " ⚠️ 초과"}
              {isUnder && ` (${(totalBudget - totalAllocated).toLocaleString()}원 미배분)`}
              {!isOver && !isUnder && totalBudget > 0 && " ✅"}
            </span>
          </div>
        </div>
      )}

      <button type="submit" disabled={loading} style={{
        width: "100%", padding: 12, border: "none", borderRadius: "8px",
        background: loading ? "#9ca3af" : "#111827",
        color: "#ffffff", fontSize: 15, fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
      }}>
        {loading ? "분석 중..." : portfolioMode ? "포트폴리오 시뮬레이션" : "저축 상품 추천받기"}
      </button>
    </form>
  );
}
