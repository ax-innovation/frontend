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

const PRODUCT_GROUPS = [
  {
    label: "시중 은행 대출", desc: "금감원 비교공시 기준 실시간 금리",
    types: ["주택담보대출", "전세자금대출", "개인신용대출"],
    activeStyle: { border: "2px solid #d97706", background: "#fef3c7", color: "#b45309" },
  },
  {
    label: "정책 대출 (정부지원)", desc: "소득·나이 조건 있음, 저금리 혜택",
    types: ["디딤돌대출", "버팀목전세자금"],
    activeStyle: { border: "2px solid #16a34a", background: "#dcfce7", color: "#15803d" },
  },
];

const TERM_LONG = [{ label: "10년", val: "120" }, { label: "20년", val: "240" }, { label: "30년", val: "360" }];
const TERM_MID  = [{ label: "1년", val: "12" }, { label: "2년", val: "24" }, { label: "3년", val: "36" }, { label: "5년", val: "60" }];

function getTermOptions(types) {
  const hasLong = types.some(t => ["주택담보대출", "디딤돌대출"].includes(t));
  const hasMid  = types.some(t => ["전세자금대출", "개인신용대출", "버팀목전세자금"].includes(t));
  if (hasLong && hasMid) return [...TERM_MID, ...TERM_LONG];
  if (hasLong) return TERM_LONG;
  return TERM_MID;
}

export default function LoanForm({ onSubmit, loading }) {
  const [form, setForm] = useState({
    age: "", annualIncome: "", loanAmount: "",
    loanTermMonths: "120",
    productTypes: ["주택담보대출", "디딤돌대출"],
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const toggle = (type) => {
    const next = form.productTypes.includes(type)
      ? form.productTypes.filter(t => t !== type)
      : [...form.productTypes, type];
    const terms = getTermOptions(next).map(o => o.val);
    setForm(f => ({
      ...f,
      productTypes: next,
      loanTermMonths: terms.includes(f.loanTermMonths) ? f.loanTermMonths : terms[0]
    }));
  };

  const termChip = (active) => ({
    padding: "7px 16px", borderRadius: "8px",
    border: active ? "2px solid #2563eb" : "1px solid #d1d5db",
    background: active ? "#dbeafe" : "#ffffff",
    color: active ? "#1d4ed8" : "#6b7280",
    fontWeight: active ? 600 : 400,
    cursor: "pointer", fontSize: 13,
  });

  const productChip = (active, activeStyle) => ({
    padding: "7px 14px", borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#ffffff",
    color: "#6b7280",
    fontWeight: 400,
    cursor: "pointer", fontSize: 13,
    ...(active ? activeStyle : {}),
  });

  const termOptions = getTermOptions(form.productTypes);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.productTypes.length === 0) { alert("상품을 1개 이상 선택해주세요."); return; }
    onSubmit({
      age:            Number(form.age),
      annualIncome:   Number(form.annualIncome.replace(/,/g, "")),
      loanAmount:     Number(form.loanAmount.replace(/,/g, "")),
      loanTermMonths: Number(form.loanTermMonths),
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
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
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
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>대출 희망 금액 (원)</label>
        <input type="text" required placeholder="예: 200,000,000 (2억)"
          value={form.loanAmount} onChange={e => set("loanAmount", e.target.value)} style={FIELD} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>관심 상품 (복수 선택)</label>
        {PRODUCT_GROUPS.map(group => (
          <div key={group.label} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 6 }}>
              {group.label} — {group.desc}
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {group.types.map(t => (
                <button key={t} type="button" onClick={() => toggle(t)}
                  style={productChip(form.productTypes.includes(t), group.activeStyle)}>
                  {t}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={LABEL}>대출 기간</label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {termOptions.map(({ label, val }) => (
            <button key={val} type="button" onClick={() => set("loanTermMonths", val)}
              style={termChip(form.loanTermMonths === val)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{
        fontSize: 12, color: "#6b7280",
        background: "#ffffff", border: "1px solid #e5e7eb",
        borderRadius: "8px", padding: "10px 14px", marginBottom: 20, lineHeight: 1.7,
      }}>
        시중 대출: 금감원 비교공시 기준 실시간 금리 (원리금균등상환 기준 계산)
        <br />디딤돌: 주택 구입용 (5억 이하 주택, 부부합산 6,000만원 이하)
        <br />버팀목: 전세자금 (5,000만원 이하, 청년 우대금리 별도 적용)
      </div>

      <button type="submit" disabled={loading} style={{
        width: "100%", padding: 12, border: "none",
        borderRadius: "8px",
        background: loading ? "#9ca3af" : "#111827",
        color: "#ffffff",
        fontSize: 15, fontWeight: 500,
        cursor: loading ? "not-allowed" : "pointer",
      }}>
        {loading ? "분석 중..." : "대출 조건 조회하기"}
      </button>
    </form>
  );
}
