import { useState } from "react";
import SavingForm from "./components/SavingForm";
import LoanForm from "./components/LoanForm";
import ResultCards from "./components/ResultCards";
import { getRecommendations } from "./api/financeApi";

const TAB = (active) => ({
  padding: "10px 28px", fontSize: 15,
  fontWeight: active ? 500 : 400, cursor: "pointer",
  border: "none",
  borderBottom: active
    ? "2px solid var(--color-text-primary)"
    : "2px solid transparent",
  background: "transparent",
  color: active ? "var(--color-text-primary)" : "var(--color-text-tertiary)",
});

export default function App() {
  const [tab,     setTab]     = useState("저축");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const handleTabChange = (next) => { setTab(next); setResults(null); setError(null); };

  const handleSubmit = async (formData) => {
    setLoading(true); setError(null); setResults(null);
    try {
      const data = await getRecommendations({ ...formData, purpose: tab });
      setResults(data);
    } catch {
      setError("데이터를 불러오지 못했습니다. Spring Boot 서버가 실행 중인지 확인해 주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2rem 1rem" }}>
      <h1 style={{ fontSize: 22, fontWeight: 500, marginBottom: 4 }}>청년·직장인 금융상품 추천</h1>
      <p style={{ color: "var(--color-text-secondary)", fontSize: 14, marginBottom: 24 }}>
        조건을 입력하면 신청 가능한 상품과 예상 수령액·상환 내역을 알려드립니다.
      </p>

      <div style={{ display: "flex", borderBottom: "1px solid var(--color-border-tertiary)", marginBottom: 28 }}>
        <button onClick={() => handleTabChange("저축")} style={TAB(tab === "저축")}>저축·적금</button>
        <button onClick={() => handleTabChange("대출")} style={TAB(tab === "대출")}>대출</button>
      </div>

      {tab === "저축"
        ? <SavingForm onSubmit={handleSubmit} loading={loading} />
        : <LoanForm   onSubmit={handleSubmit} loading={loading} />
      }

      {error   && <p style={{ color: "var(--color-text-danger)", marginTop: 12 }}>{error}</p>}
      {results && <ResultCards data={results} purpose={tab} />}
    </div>
  );
}
