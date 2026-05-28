const fmt = (n) => n?.toLocaleString("ko-KR") ?? "-";

function Badge({ text, color = "info" }) {
  return (
    <span style={{
      display: "inline-block", padding: "2px 8px", borderRadius: 99,
      fontSize: 11, fontWeight: 500, marginRight: 6,
      background: `var(--color-background-${color})`,
      color: `var(--color-text-${color})`,
    }}>{text}</span>
  );
}

function Row({ label, val, color }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>{label}</div>
      <div style={{ fontWeight: 500, color: color ? `var(--color-text-${color})` : "var(--color-text-primary)" }}>{val}</div>
    </div>
  );
}

function RateRow({ label, val, highlight }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 500, color: highlight ? "var(--color-text-success)" : "var(--color-text-primary)" }}>{val}</div>
    </div>
  );
}

// ── 저축 카드 ─────────────────────────────────────────────

function SavingCard({ item }) {
  const s = item.savingSim;
  return (
    <div style={{
      border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)",
      padding: 20, background: "var(--color-background-primary)", opacity: item.eligible ? 1 : 0.55,
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{item.productName}</span>
          {!item.eligible && <Badge text="가입 불가" color="danger" />}
          {item.benefit   && <Badge text={item.benefit} color="success" />}
          {item.category  && <Badge text={item.category} color="info" />}
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>{item.institution}</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        padding: "14px 0", marginBottom: 16,
        borderTop: "1px solid var(--color-border-tertiary)",
        borderBottom: "1px solid var(--color-border-tertiary)",
      }}>
        <RateRow label="기본금리"  val={`${item.baseRate ?? "-"}%`}      highlight={false} />
        <RateRow label="최고금리"  val={`${item.bestRate ?? "-"}%`}      highlight={true}  />
        <RateRow label="저축 기간" val={`${item.termMonths ?? "-"}개월`} highlight={false} />
      </div>

      {s && (
        <div style={{
          background: "var(--color-background-secondary)",
          borderRadius: "var(--border-radius-md)", padding: "14px 16px", marginBottom: 12,
        }}>
          <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
            예상 만기 수령액 ({s.rateTypeNm})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Row label="총 납입액" val={`${fmt(s.totalDeposit)}원`} />
            <Row label="이자"      val={`+${fmt(s.bestInterest)}원`} />
            {s.govContribution > 0 && <Row label="정부기여금" val={`+${fmt(s.govContribution)}원`} color="success" />}
            <div style={{ gridColumn: "span 2", borderTop: "1px solid var(--color-border-tertiary)", paddingTop: 10, marginTop: 2 }}>
              <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>만기 수령 예상</div>
              <div style={{ fontSize: 22, fontWeight: 500, color: "var(--color-text-info)" }}>{fmt(s.bestFinalAmount)}원</div>
            </div>
          </div>
        </div>
      )}

      {item.note && <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{item.note}</p>}
      {item.applyUrl && item.eligible && (
        <a href={item.applyUrl} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "var(--color-text-info)", textDecoration: "none" }}>
          자세히 보기 →
        </a>
      )}
    </div>
  );
}

// ── 대출 카드 ─────────────────────────────────────────────

function LoanCard({ item }) {
  const l = item.loanSim;
  return (
    <div style={{
      border: "1px solid var(--color-border-tertiary)", borderRadius: "var(--border-radius-lg)",
      padding: 20, background: "var(--color-background-primary)", opacity: item.eligible ? 1 : 0.55,
    }}>
      <div style={{ marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
          <span style={{ fontSize: 16, fontWeight: 500 }}>{item.productName}</span>
          {!item.eligible && <Badge text="가입 불가"  color="danger"  />}
          {item.benefit   && <Badge text={item.benefit} color="success" />}
          {item.category  && <Badge text={item.category} color="warning" />}
        </div>
        <p style={{ fontSize: 13, color: "var(--color-text-secondary)", margin: 0 }}>{item.institution}</p>
      </div>

      <div style={{
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12,
        padding: "14px 0", marginBottom: 16,
        borderTop: "1px solid var(--color-border-tertiary)",
        borderBottom: "1px solid var(--color-border-tertiary)",
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
              <div key={label} style={{
                background: "var(--color-background-secondary)",
                borderRadius: "var(--border-radius-md)", padding: "14px 16px",
              }}>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 20, fontWeight: 500 }}>{fmt(val)}<span style={{ fontSize: 13 }}>원</span></div>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 2 }}>원리금균등</div>
              </div>
            ))}
          </div>

          <div style={{
            background: "var(--color-background-secondary)",
            borderRadius: "var(--border-radius-md)", padding: "14px 16px", marginBottom: 16,
          }}>
            <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 10 }}>
              총 상환 내역 (최저 {l.minRate}% 기준)
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <Row label="대출 원금" val={`${fmt(l.loanAmount)}원`} />
              <Row label="총 이자"   val={`+${fmt(l.totalInterestMin)}원`} color="danger" />
              <div style={{ gridColumn: "span 2", borderTop: "1px solid var(--color-border-tertiary)", paddingTop: 10, marginTop: 2 }}>
                <div style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginBottom: 3 }}>총 상환액</div>
                <div style={{ fontSize: 22, fontWeight: 500 }}>{fmt(l.totalPaymentMin)}원</div>
              </div>
            </div>
          </div>

          {l.schedule?.length > 0 && (
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: "var(--color-text-tertiary)", marginBottom: 8 }}>연도별 상환 스케줄 (최저금리 기준)</div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--color-border-tertiary)" }}>
                      {["연차", "원금 상환", "이자 납부", "잔여 원금"].map(h => (
                        <th key={h} style={{ padding: "6px 8px", textAlign: "right", color: "var(--color-text-tertiary)", fontWeight: 500 }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {l.schedule.map((row, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid var(--color-border-tertiary)", background: i % 2 === 0 ? "transparent" : "var(--color-background-secondary)" }}>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>{row.year}년차</td>
                        <td style={{ padding: "6px 8px", textAlign: "right" }}>{fmt(row.principalPaid)}</td>
                        <td style={{ padding: "6px 8px", textAlign: "right", color: "var(--color-text-danger)" }}>{fmt(row.interestPaid)}</td>
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

      {item.note && <p style={{ fontSize: 12, color: "var(--color-text-secondary)", margin: 0 }}>{item.note}</p>}
      {item.applyUrl && item.eligible && (
        <a href={item.applyUrl} target="_blank" rel="noreferrer"
          style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: "var(--color-text-info)", textDecoration: "none" }}>
          자세히 보기 →
        </a>
      )}
    </div>
  );
}

// ── 메인 ResultCards ───────────────────────────────────────

export default function ResultCards({ data, purpose }) {
  if (!data?.results?.length)
    return <p style={{ color: "var(--color-text-secondary)", textAlign: "center", padding: 40 }}>조건에 맞는 상품이 없습니다.</p>;

  const eligible = data.results.filter(r => r.eligible !== false);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
          {purpose === "저축" ? "추천 저축 상품" : "추천 대출 상품"} {eligible.length}건
        </h2>
        <span style={{ fontSize: 12, color: "var(--color-text-tertiary)" }}>
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

      <p style={{ fontSize: 11, color: "var(--color-text-tertiary)", marginTop: 20, lineHeight: 1.6 }}>
        ※ 예상 금액은 참고용이며 실제 금리·조건은 취급 금융기관에서 확인하세요.
        {purpose === "대출" && " 대출 시뮬레이션은 원리금균등상환 방식 기준입니다."}
      </p>
    </div>
  );
}
