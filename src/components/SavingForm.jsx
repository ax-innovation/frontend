import { useState } from "react";
import { getRecommendations } from "../api/financeApi";

const FIELD = {
  width: "100%", padding: "10px 12px", borderRadius: "8px",
  border: "1px solid #d1d5db", background: "#ffffff",
  color: "#111827", fontSize: 15, boxSizing: "border-box",
};
const LABEL = { display: "block", fontSize: 13, fontWeight: 500, color: "#6b7280", marginBottom: 6 };
const TERMS  = [
  { label: "6개월", val: "6" }, { label: "12개월", val: "12" },
  { label: "24개월", val: "24" }, { label: "36개월", val: "36" },
  { label: "60개월 (5년)", val: "60" },
];
const TYPES = ["정기예금", "적금", "청년도약계좌"];

export default function SavingForm({ onSubmit, loading }) {
  const [step, setStep] = useState(1);   // 1: 기본정보 / 2: 상품선택 / 3: 결과
  const [form, setForm] = useState({
    age: "", annualIncome: "", monthlyDeposit: "",
    termMonths: "12", productTypes: ["적금", "청년도약계좌"],
    portfolioMode: false,
  });
  const [allocation, setAllocation]       = useState({});
  const [candidates, setCandidates]       = useState(null);  // 2단계 추천 후보
  const [selectedProducts, setSelected]   = useState({});    // 2단계 선택 결과
  const [step2Loading, setStep2Loading]   = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const toggle = (t) => setForm(f => ({
    ...f,
    productTypes: f.productTypes.includes(t)
      ? f.productTypes.filter(x => x !== t)
      : [...f.productTypes, t],
  }));

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

  const totalBudget    = Number(form.monthlyDeposit.replace(/,/g, "")) || 0;
  const totalAllocated = Object.values(allocation).reduce((s, v) => s + (Number(v) || 0), 0);
  const isOver         = totalAllocated > totalBudget;

  // ── 1단계 → 2단계: 후보 상품 조회 ──────────────────────────
  const goToStep2 = async () => {
    setStep2Loading(true);

    // 포트폴리오 모드: 청년도약계좌 자동 70만원 배분
    const age    = Number(form.age);
    const income = Number(form.annualIncome.replace(/,/g, ""));
    const total  = Number(form.monthlyDeposit.replace(/,/g, ""));
    const youthOk = age >= 19 && age <= 34 && income <= 75_000_000;

    const newAlloc = {};
    if (youthOk && form.productTypes.includes("청년도약계좌")) {
      newAlloc["청년도약계좌"] = Math.min(total, 700_000);
      const remaining  = total - newAlloc["청년도약계좌"];
      const otherTypes = form.productTypes.filter(t => t !== "청년도약계좌");
      if (otherTypes.length > 0 && remaining > 0) {
        const perType = Math.floor(remaining / otherTypes.length);
        otherTypes.forEach(t => { newAlloc[t] = perType; });
      }
    } else {
      form.productTypes.forEach(t => { newAlloc[t] = Math.floor(total / form.productTypes.length); });
    }
    setAllocation(newAlloc);

    // 후보 상품 조회 (선택 없이 전체 추천)
    try {
      const data = await getRecommendations({
        age:            Number(form.age),
        annualIncome:   Number(form.annualIncome.replace(/,/g, "")),
        monthlyDeposit: total,
        termMonths:     Number(form.termMonths),
        productTypes:   form.productTypes,
        portfolioMode:  true,
        allocation:     newAlloc,
        purpose:        "저축",
      });
      setCandidates(data.results);
      setStep(2);
    } catch {
      alert("추천 상품을 불러오지 못했습니다.");
    } finally {
      setStep2Loading(false);
    }
  };

  // ── 2단계 → 3단계: 선택한 상품으로 최종 시뮬레이션 ──────────
  const goToStep3 = () => {
    onSubmit({
      age:             Number(form.age),
      annualIncome:    Number(form.annualIncome.replace(/,/g, "")),
      monthlyDeposit:  Number(form.monthlyDeposit.replace(/,/g, "")),
      termMonths:      Number(form.termMonths),
      productTypes:    form.productTypes,
      portfolioMode:   true,
      allocation,
      selectedProducts,
      purpose:         "저축",
    });
  };

  // ── 일반 모드 바로 제출 ────────────────────────────────────
  const handleNormalSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      age:            Number(form.age),
      annualIncome:   Number(form.annualIncome.replace(/,/g, "")),
      monthlyDeposit: Number(form.monthlyDeposit.replace(/,/g, "")),
      termMonths:     Number(form.termMonths),
      productTypes:   form.productTypes,
      portfolioMode:  false,
      purpose:        "저축",
    });
  };

  // ── 상품 카드 (2단계에서 라디오 선택) ─────────────────────
  const ProductCard = ({ item }) => {
    const key      = item.category;
    const id       = item.category === "자산형성" ? item.institution : item.finPrdtCd;
    const isSelected = selectedProducts[key] === id;

    return (
      <div onClick={() => setSelected(s => ({ ...s, [key]: id }))}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderRadius: "8px", cursor: "pointer",
          marginBottom: 8,
          border: isSelected ? "1.5px solid #2563eb" : "0.5px solid #e5e7eb",
          background: isSelected ? "#eff6ff" : "#f9fafb",
        }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{item.productName}</div>
          <div style={{ fontSize: 12, color: isSelected ? "#2563eb" : "#9ca3af" }}>
            기본 {item.baseRate}% / 최고 {item.bestRate}%
          </div>
        </div>
        <div style={{
          width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
          border: isSelected ? "5px solid #2563eb" : "1.5px solid #d1d5db",
          background: "#ffffff",
        }} />
      </div>
    );
  };

  // ── 1단계 화면 ──────────────────────────────────────────────
  if (step === 1) return (
    <form onSubmit={form.portfolioMode ? (e) => { e.preventDefault(); goToStep2(); } : handleNormalSubmit}
      style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: 24, marginBottom: 32 }}>

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
            <button key={val} type="button" onClick={() => set("termMonths", val)} style={termChip(form.termMonths === val)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 관심 상품 */}
      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>관심 상품 (복수 선택)</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {TYPES.map(t => (
            <button key={t} type="button" onClick={() => toggle(t)} style={typeChip(form.productTypes.includes(t))}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* 투자 방식 선택 */}
      <div style={{ marginBottom: 24 }}>
        <label style={LABEL}>투자 방식</label>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>

          {/* 일반 모드 */}
          <div onClick={() => set("portfolioMode", false)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: "8px", cursor: "pointer",
            border: !form.portfolioMode ? "1.5px solid #111827" : "0.5px solid #d1d5db",
            background: !form.portfolioMode ? "#f3f4f6" : "#ffffff",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
              border: !form.portfolioMode ? "5px solid #111827" : "1.5px solid #d1d5db",
              background: "#ffffff",
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>일반 모드</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>월 납입 금액 전체로 상품 추천</div>
            </div>
          </div>

          {/* 포트폴리오 모드 */}
          <div onClick={() => set("portfolioMode", true)} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: "8px", cursor: "pointer",
            border: form.portfolioMode ? "1.5px solid #7c3aed" : "0.5px solid #d1d5db",
            background: form.portfolioMode ? "#faf5ff" : "#ffffff",
          }}>
            <div style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
              border: form.portfolioMode ? "5px solid #7c3aed" : "1.5px solid #d1d5db",
              background: "#ffffff",
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: form.portfolioMode ? "#6d28d9" : "#6b7280" }}>
                포트폴리오 모드
              </div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>
                월 납입 금액을 여러 상품에 나눠서 투자
              </div>
            </div>
          </div>

        </div>
      </div>

      <button type="submit" disabled={loading || step2Loading} style={{
        width: "100%", padding: 12, border: "none", borderRadius: "8px",
        background: (loading || step2Loading) ? "#9ca3af" : "#111827",
        color: "#ffffff", fontSize: 15, fontWeight: 500,
        cursor: (loading || step2Loading) ? "not-allowed" : "pointer",
      }}>
        {step2Loading ? "상품 조회 중..." :
         loading      ? "분석 중..." :
         form.portfolioMode ? "다음 단계 →" : "저축 상품 추천받기"}
      </button>
    </form>
  );

  // ── 2단계 화면 ──────────────────────────────────────────────
  if (step === 2 && candidates) {
    // 카테고리별로 후보 그룹핑
    const groups = {};
    candidates.forEach(item => {
      if (!item.eligible) return;
      const key = item.category;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });

    const allSelected = form.productTypes.every(type => {
      const matchKey = type === "청년도약계좌" ? "자산형성" : type;
      return selectedProducts[matchKey] !== undefined;
    });

    return (
      <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: "12px", padding: 24, marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#dbeafe", color: "#1d4ed8", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center" }}>2</div>
          <div style={{ fontSize: 15, fontWeight: 500 }}>상품별 금액 배분 + 추천 상품 선택</div>
        </div>

        {Object.entries(groups).map(([category, items]) => {
          const type = category === "자산형성" ? "청년도약계좌" : category;
          const isYouth = category === "자산형성";
          return (
            <div key={category} style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "#374151" }}>
                  {type}
                  {isYouth && <span style={{ fontSize: 11, color: "#9ca3af", marginLeft: 6 }}>최대 70만원</span>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>배분 금액:</span>
                  <input type="number" min="0"
                    max={isYouth ? 700000 : undefined}
                    value={allocation[type] || ""}
                    onChange={e => setAllocation(a => ({ ...a, [type]: Number(e.target.value) }))}
                    style={{ ...FIELD, width: 130, padding: "6px 10px", fontSize: 13 }}
                  />
                  <span style={{ fontSize: 12, color: "#6b7280" }}>원</span>
                </div>
              </div>

              {isYouth && (
                <div style={{ fontSize: 11, color: "#d97706", background: "#fef3c7", padding: "6px 10px", borderRadius: "6px", marginBottom: 8 }}>
                  ⚠️ 5년 만기 상품 · {form.termMonths}개월 납입 후 만기까지 유지 기준으로 계산
                </div>
              )}

              {items.map((item, i) => <ProductCard key={i} item={item} />)}
            </div>
          );
        })}

        {/* 배분 합계 */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid #e5e7eb", marginBottom: 16 }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>배분 합계</span>
          <span style={{ fontSize: 14, fontWeight: 600, color: isOver ? "#dc2626" : totalAllocated === totalBudget ? "#16a34a" : "#d97706" }}>
            {totalAllocated.toLocaleString()}원 / {totalBudget.toLocaleString()}원
            {isOver && " ⚠️ 초과"}
            {!isOver && totalAllocated === totalBudget && " ✅"}
            {!isOver && totalAllocated < totalBudget && ` (${(totalBudget - totalAllocated).toLocaleString()}원 미배분)`}
          </span>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button type="button" onClick={() => setStep(1)} style={{
            flex: 1, padding: 12, border: "1px solid #d1d5db", borderRadius: "8px",
            background: "#ffffff", fontSize: 15, fontWeight: 500, cursor: "pointer", color: "#374151",
          }}>← 이전</button>
          <button type="button" onClick={goToStep3} disabled={!allSelected || isOver || loading} style={{
            flex: 2, padding: 12, border: "none", borderRadius: "8px",
            background: (!allSelected || isOver || loading) ? "#9ca3af" : "#111827",
            color: "#ffffff", fontSize: 15, fontWeight: 500,
            cursor: (!allSelected || isOver || loading) ? "not-allowed" : "pointer",
          }}>
            {loading ? "분석 중..." : "시뮬레이션 →"}
          </button>
        </div>
      </div>
    );
  }

  return null;
}
