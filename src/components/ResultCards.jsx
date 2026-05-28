const fmt = (n) => n?.toLocaleString("ko-KR") ?? "-";

function Badge({ text, color = "info" }) {
  const colors = {
    info:    { bg: "#dbeafe", text: "#1d4ed8" },
    success: { bg: "#dcfce7", text: "#15803d" },
    danger:  { bg: "#fee2e2", text: "#dc2626" },
    warning: { bg: "#fef3c7", text: "#b45309" },
    purple:  { bg: "#ede9fe", text: "#6d28d9" },
  };
  const c = colors[color] || colors.info;
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 99,
      fontSize: 11, fontWeight: 500, marginRight: 6,
      background: c.bg, color: c.text,
    }}>{text}</span>
  );
}

function Row({ label, val, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "#9ca3af" }}>{label}</div>
      <div style={{ fontWeight: 500, color: color || "#111827" }}>{val}</div>
    </div>
  );
}

function RateRow({ label, val, highlight }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: highlight ? "#16a34a" : "#111827" }}>{val}</div>
    </div>
  );
}

// ── 포트폴리오 합산 카드 ──────────────────────────────────────

function PortfolioSummaryCard({ data }) {
  if (!data.isPortfolio || !data.totalFinalAmount) return null;

  return (
    <div style={{
      border: "2px solid #7c3aed",
      borderRadius: "12px", padding: 20, marginBottom: 24,
      background: "#faf5ff",
    }}>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#6d28d9", marginBottom: 16 }}>
        💼 포트폴리오 합산 결과
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 16 }}>
        <div style={{ background: "#ffffff", borderRadius: "8px", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>총 납입액</div>
          <div style={{ fontSize: 16, fontWeight: 500 }}>{fmt(data.totalDeposit)}원</div>
        </div>
        <div style={{ background: "#ffffff", borderRadius: "8px", padding: "12px 16px" }}>
          <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>총 이자</div>
          <div style={{ fontSize: 16, fontWeight: 500, color: "#16a34a" }}>+{fmt(data.totalInterest)}원</div>
        </div>
        {data.totalGovContribution > 0 && (
          <div style={{ background: "#ffffff", borderRadius: "8px", padding: "12px 16px" }}>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>총 정부기여금</div>
            <div style={{ fontSize: 16, fontWeight: 500, color: "#16a34a" }}>+{fmt(data.totalGovContribution)}원</div>
          </div>
        )}
      </div>

      <div style={{
        background: "#ffffff", borderRadius: "8px", padding: "16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
      }}>
        <span style={{ fontSize: 14, color: "#6b7280" }}>합산 만기 수령 예상</span>
        <span style={{ fontSize: 26, fontWeight: 700, color: "#6d28d9" }}>
          {fmt(data.totalFinalAmount)}원
        </span>
      </div>
    </div>
  );
}

// ── 저축 카드 ─────────────────────────────────────────────────

function SavingCard({ item }) {
  const s = item.savingSim;
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: "12px",
      padding: 20, background: "#ffffff",
      opacity: item.eligible ? 1 : 0.55,
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{item.productName}</span>
          {!item.eligible && <Badge text="가입 불가" color="danger" />}
          {item.benefit   && <Badge text={item.benefit} color="success" />}
          {item.category  && <Badge text={item.category} color="info" />}
          {item.allocatedAmount > 0 && (
            <Badge text={`배분: ${fmt(item.allocatedAmount)}원`} color="purple" />
          )}
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{item.institution}</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        padding: "14px 0", marginBottom: 16,
        borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb",
      }}>
        <RateRow label="기본금리"  val={`${item.baseRate ?? "-"}%`}      highlight={false} />
        <RateRow label="최고금리"  val={`${item.bestRate ?? "-"}%`}      highlight={true}  />
        <RateRow label="저축 기간" val={`${item.termMonths ?? "-"}개월`} highlight={false} />
      </div>

      {s && (
        <div style={{
          background: "#f9fafb", borderRadius: "8px", padding: "14px 16px", marginBottom: 12,
        }}>
          <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
            예상 만기 수령액 ({s.rateTypeNm})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Row label="총 납입액" val={`${fmt(s.totalDeposit)}원`} />
            <Row label="이자"      val={`+${fmt(s.bestInterest)}원`} color="#16a34a" />
            {s.govContribution > 0 && (
              <Row label="정부기여금" val={`+${fmt(s.govContribution)}원`} color="#16a34a" />
            )}
            <div style={{ gridColumn: "span 2", borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 2 }}>
              <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>만기 수령 예상</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "#2563eb" }}>{fmt(s.bestFinalAmount)}원</div>
            </div>
          </div>
        </div>
      )}

      {item.note && <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{item.note}</p>}
      {item.applyUrl && item.eligible && (
        <a href={item.applyUrl} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
          자세히 보기 →
        </a>
      )}
    </div>
  );
}

// ── 대출 카드 ─────────────────────────────────────────────────

function LoanCard({ item }) {
  const l = item.loanSim;
  return (
    <div style={{
      border: "1px solid #e5e7eb", borderRadius: "12px",
      padding: 20, background: "#ffffff",
      opacity: item.eligible ? 1 : 0.55,
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{item.productName}</span>
          {!item.eligible && <Badge text="가입 불가"  color="danger"  />}
          {item.benefit   && <Badge text={item.benefit} color="success" />}
          {item.category  && <Badge text={item.category} color="warning" />}
        </div>
        <p style={{ fontSize: 13, color: "#6b7280", margin: 0 }}>{item.institution}</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        padding: "14px 0", marginBottom: 16,
        borderTop: "1px solid #e5e7eb", borderBottom: "1px solid #e5e7eb",
      }}>
        <RateRow label="최저 금리" val={`${item.baseRate ?? "-"}%`}      highlight={true}  />
        <RateRow label="최고 금리" val={`${item.bestRate ?? "-"}%`}      highlight={false} />
        <RateRow label="대출 기간" val={`${item.termMonths ?? "-"}개월`} highlight={false} />
      </div>

      {l && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
            {[
              { label: `월 납입액 (최저 ${l.minRate}%)`, val: l.monthlyPaymentMin },
              { label: `월 납입액 (최고 ${l.maxRate}%)`, val: l.monthlyPaymentMax },
            ].map(({ label, val }) => (
              <div key={label} style={{ background: "#f9fafb", borderRadius: "8px", padding: "14px 16px" }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{fmt(val)}<span style={{ fontSize: 13 }}>원</span></div>
                <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>원리금균등</div>
              </div>
            ))}
          </div>

          <div style={{ background: "#f9fafb", borderRadius: "8px", padding: "14px 16px", marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
              총 상환 내역 (최저 {l.minRate}% 기준)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Row label="대출 원금" val={`${fmt(l.loanAmount)}원`} />
              <Row label="총 이자"   val={`+${fmt(l.totalInterestMin)}원`} color="#dc2626" />
              <div style={{ gridColumn: "span 2", borderTop: "1px solid #e5e7eb", paddingTop: 10, marginTop: 2 }}>
                <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 3 }}>총 상환액</div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{fmt(l.totalPaymentMin)}원</div>
              </div>
            </div>
          </div>

          {l.schedule?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 8 }}>연도별 상환 스케줄 (최저금리 기준)</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #e5e7eb" }}>
                      {["연차", "원금 상환", "이자 납부", "잔여 원금"].map(h => (
                        <th key={h} style={{ padding: "6px 8px", textAlign: "right", color: "#9ca3af", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {l.schedule.map((row, i) => (
                      <tr key={i} style={{
                        borderBottom: "1px solid #e5e7eb",
                        background: i % 2 === 0 ? "transparent" : "#f9fafb",
                      }}>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>{row.year}년차</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(row.principalPaid)}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right", color: "#dc2626" }}>{fmt(row.interestPaid)}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(row.remainingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {item.note && <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>{item.note}</p>}
      {item.applyUrl && item.eligible && (
        <a href={item.applyUrl} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "#2563eb", textDecoration: "none" }}>
          자세히 보기 →
        </a>
      )}
    </div>
  );
}

// ── 메인 ResultCards ───────────────────────────────────────────

export default function ResultCards({ data, purpose }) {
  if (!data?.results?.length)
    return <p style={{ color: "#6b7280", textAlign: "center", padding: 40 }}>조건에 맞는 상품이 없습니다.</p>;

  const eligible = data.results.filter(r => r.eligible !== false);

  return (
    <div>
      {/* 포트폴리오 합산 카드 (포트폴리오 모드일 때만 표시) */}
      <PortfolioSummaryCard data={data} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
          {data.isPortfolio
            ? `포트폴리오 구성 상품 ${eligible.length}건`
            : purpose === "저축" ? `추천 저축 상품 ${eligible.length}건`
            : `추천 대출 상품 ${eligible.length}건`}
        </h2>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          {purpose === "저축" ? "만기 수령액 기준 정렬" : "월 납입액 낮은 순"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {data.results.map((item, i) =>
          item.purpose === "대출" || item.loanSim
            ? <LoanCard   key={i} item={item} />
            : <SavingCard key={i} item={item} />
        )}
      </div>

      <p style={{ fontSize: 11, color: "#9ca3af", marginTop: 20, lineHeight: 1.6 }}>
        ※ 예상 금액은 참고용이며 실제 금리·조건은 취급 금융기관에서 확인하세요.
        {purpose === "대출" && " 대출 시뮬레이션은 원리금균등상환 방식 기준입니다."}
      </p>
    </div>
  );
}
