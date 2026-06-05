const fmt = (n) => n?.toLocaleString("ko-KR") ?? "-";

// ── 저축 상품 요약 카드 ───────────────────────────────────────

function SavingCard({ item }) {
  const s = item.savingSim;
  const isYouth = item.category === "자산형성";

  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e5e7eb",
      borderRadius: "12px", padding: 20, opacity: item.eligible ? 1 : 0.5,
    }}>
      {/* 상품명 + 배지 */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
          {item.productName}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {!item.eligible && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#fee2e2", color: "#dc2626" }}>가입 불가</span>
          )}
          {item.benefit && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#dcfce7", color: "#15803d" }}>{item.benefit}</span>
          )}
          {item.allocatedAmount > 0 && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#ede9fe", color: "#6d28d9" }}>
              배분 {fmt(item.allocatedAmount)}원
            </span>
          )}
        </div>
      </div>

      {/* 시뮬레이션 결과 */}
      {s && item.eligible && (
        <div style={{ background: "#f9fafb", borderRadius: "8px", overflow: "hidden" }}>

          {/* 납입 기간 */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>납입 기간</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>
              {isYouth && s.note ? s.note : `${item.termMonths}개월`}
            </span>
          </div>

          {/* 총 납입액 */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>총 납입액</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>{fmt(s.totalDeposit)}원</span>
          </div>

          {/* 이자 + 정부기여금 */}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              {s.govContribution > 0 ? "이자 + 정부기여금" : "이자"}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#16a34a" }}>
              +{fmt(s.bestInterest + s.govContribution)}원
            </span>
          </div>

          {/* 만기 수령 예상 */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#f0fdf4" }}>
            <span style={{ fontSize: 13, color: "#15803d" }}>만기 수령 예상</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#15803d" }}>{fmt(s.bestFinalAmount)}원</span>
          </div>
        </div>
      )}

      {/* 가입 불가 안내 */}
      {!item.eligible && item.note && (
        <div style={{ fontSize: 12, color: "#dc2626", marginTop: 8 }}>{item.note}</div>
      )}

      {item.applyUrl && item.eligible && (
        <a href={item.applyUrl} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
          자세히 보기 →
        </a>
      )}
    </div>
  );
}

// ── 대출 상품 요약 카드 ───────────────────────────────────────

function LoanCard({ item }) {
  const l = item.loanSim;
  return (
    <div style={{
      background: "#ffffff", border: "1px solid #e5e7eb",
      borderRadius: "12px", padding: 20, opacity: item.eligible ? 1 : 0.5,
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: "#111827", marginBottom: 4 }}>
          {item.productName}
        </div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {!item.eligible && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#fee2e2", color: "#dc2626" }}>가입 불가</span>
          )}
          {item.benefit && (
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#dcfce7", color: "#15803d" }}>{item.benefit}</span>
          )}
          <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: "#fef3c7", color: "#b45309" }}>{item.category}</span>
        </div>
      </div>

      {l && item.eligible && (
        <div style={{ background: "#f9fafb", borderRadius: "8px", overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>대출 기간</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{item.termMonths}개월</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>금리 범위</span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{l.minRate}% ~ {l.maxRate}%</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>월 납입액 (최저금리)</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#16a34a" }}>{fmt(l.monthlyPaymentMin)}원</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>총 이자</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#dc2626" }}>+{fmt(l.totalInterestMin)}원</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px", background: "#fff7ed" }}>
            <span style={{ fontSize: 13, color: "#c2410c" }}>총 상환액</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: "#c2410c" }}>{fmt(l.totalPaymentMin)}원</span>
          </div>
        </div>
      )}

      {!item.eligible && item.note && (
        <div style={{ fontSize: 12, color: "#dc2626", marginTop: 8 }}>{item.note}</div>
      )}
      {item.applyUrl && item.eligible && (
        <a href={item.applyUrl} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
          자세히 보기 →
        </a>
      )}
    </div>
  );
}

// ── 포트폴리오 합산 카드 ──────────────────────────────────────

function PortfolioSummaryCard({ data }) {
    console.log("전체 results:", JSON.stringify(data.results?.map(r => ({
    name: r.productName,
    eligible: r.eligible,
    hasSavingSim: !!r.savingSim
  }))));
  // 저축 상품이 2개 이상이면 합산 카드 표시
  const savingItems = data.results?.filter(
    r => r.eligible && r.savingSim
  ) || [];

  if (savingItems.length < 2) return null;

  // 합산 계산
  const totalFinalAmount     = savingItems.reduce((s, i) => s + i.savingSim.bestFinalAmount, 0);
  const totalDeposit         = savingItems.reduce((s, i) => s + i.savingSim.totalDeposit, 0);
  const totalInterest        = savingItems.reduce((s, i) => s + i.savingSim.bestInterest, 0);
  const totalGovContribution = savingItems.reduce((s, i) => s + i.savingSim.govContribution, 0);

  return (
    <div style={{
      background: "#faf5ff", border: "2px solid #7c3aed",
      borderRadius: "12px", padding: 20, marginBottom: 16,
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: "#6d28d9", marginBottom: 14 }}>
        💼 포트폴리오 합산
      </div>
      <div style={{ background: "#ffffff", borderRadius: "8px", overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>총 납입액</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{fmt(totalDeposit)}원</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
          <span style={{ fontSize: 13, color: "#6b7280" }}>총 이자</span>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#16a34a" }}>+{fmt(totalInterest)}원</span>
        </div>
        {totalGovContribution > 0 && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", borderBottom: "1px solid #f3f4f6" }}>
            <span style={{ fontSize: 13, color: "#6b7280" }}>총 정부기여금</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: "#16a34a" }}>+{fmt(totalGovContribution)}원</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 14px", background: "#ede9fe" }}>
          <span style={{ fontSize: 14, color: "#6d28d9", fontWeight: 500 }}>합산 만기 수령 예상</span>
          <span style={{ fontSize: 24, fontWeight: 700, color: "#6d28d9" }}>{fmt(totalFinalAmount)}원</span>
        </div>
      </div>
    </div>
  );
}

// ── 메인 ResultPage ───────────────────────────────────────────

export default function ResultPage({ data, purpose, onBack }) {
  if (!data?.results?.length) return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2rem 1rem", textAlign: "center" }}>
      <p style={{ color: "#6b7280" }}>조건에 맞는 상품이 없습니다.</p>
      <button onClick={onBack} style={{
        marginTop: 16, padding: "10px 24px", borderRadius: "8px",
        border: "1px solid #d1d5db", background: "#ffffff",
        fontSize: 14, cursor: "pointer",
      }}>← 다시 조회</button>
    </div>
  );

  const eligible = data.results.filter(r => r.eligible !== false);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: "2rem 1rem" }}>

      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 600, color: "#111827", margin: 0 }}>
            {data.isPortfolio ? "포트폴리오 시뮬레이션 결과"
              : purpose === "저축" ? "저축 상품 추천 결과"
              : "대출 상품 추천 결과"}
          </h1>
          <p style={{ fontSize: 13, color: "#9ca3af", margin: "4px 0 0" }}>
            {eligible.length}개 상품
          </p>
        </div>
        <button onClick={onBack} style={{
          padding: "8px 16px", borderRadius: "8px",
          border: "1px solid #d1d5db", background: "#ffffff",
          fontSize: 13, cursor: "pointer", color: "#374151",
        }}>← 다시 조회</button>
      </div>

      {/* 포트폴리오 합산 */}
      <PortfolioSummaryCard data={data} />

      {/* 상품 카드 목록 */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {data.results.map((item, i) =>
          item.purpose === "대출" || item.loanSim
            ? <LoanCard   key={i} item={item} />
            : <SavingCard key={i} item={item} />
        )}
      </div>

      {/* 안내 문구 */}
      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 20, lineHeight: 1.7 }}>
        ※ 예상 금액은 참고용이며 실제 금리·조건은 취급 금융기관에서 확인하세요.
      </p>

      {/* 하단 버튼 */}
      <div style={{ textAlign: "center", marginTop: 16 }}>
        <button onClick={onBack} style={{
          padding: "12px 40px", borderRadius: "8px",
          border: "none", background: "#111827",
          fontSize: 15, fontWeight: 500, cursor: "pointer", color: "#ffffff",
        }}>← 다시 조회하기</button>
      </div>
    </div>
  );
}
