import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import "./creator.css";

export const metadata: Metadata = {
  title: "쏘빅툴 작가 안내",
  description:
    "쏘빅툴에 작품을 등록해 이용권을 판매하기까지의 과정입니다. 작품 확인 · 계약 · 판매 준비 · 정산 순서로 진행합니다.",
  alternates: { canonical: "https://www.ssobig.com/creator" },
  openGraph: {
    title: "쏘빅툴 작가 안내",
    description:
      "작품 확인 · 계약 · 판매 준비 · 정산. 쏘빅툴에서 작품을 판매하기까지의 과정을 안내합니다.",
    url: "https://www.ssobig.com/creator",
  },
};

type Step = { label: string; detail?: ReactNode };
type Path = { tag: string; title: string; desc: string; steps: Step[] };

const STAGES = [
  { name: "작품 확인", sub: "원고와 자료 검토" },
  { name: "계약", sub: "작품별 조건 협의, 계약 체결" },
  { name: "판매 준비", sub: "쏘빅툴 포팅, 테스트, 판매 시작" },
  { name: "정산", sub: "월말 마감, 다음 달 말일 지급" },
];

const PATHS: Path[] = [
  {
    tag: "이미 출시된 작품",
    title: "다른 곳에서 출시한 작품",
    desc: "해외 작품처럼 이미 출시된 작품을 쏘빅툴로 들여오는 경우입니다.",
    steps: [
      { label: "페이지 아래 '문의하기'로 연락" },
      { label: "작품과 자료 전달" },
      { label: "쏘빅툴로 옮길 수 있는지 확인" },
    ],
  },
  {
    tag: "작품 파일이 있는 경우",
    title: "작품 파일을 보내 주시는 작가님",
    desc: "원고·진행 규칙·그림 등 작품 파일을 보내 주시는 경우입니다. 형식은 상관없고, 여러 작품을 함께 보내셔도 됩니다.",
    steps: [
      { label: "작품 파일 전달", detail: <span className="copyable">team@ssobig.com</span> },
      { label: "쏘빅 라이터에 올리기" },
      { label: "코멘트로 함께 보기" },
      { label: "제작 주의 내용 검토" },
    ],
  },
  {
    tag: "쏘빅 라이터 작가님",
    title: "쏘빅 라이터에서 쓴 작품",
    desc: "쏘빅 라이터에서 작품을 쓰신 경우입니다. 원고가 이미 라이터에 있어서 따로 보내실 파일이 없습니다.",
    steps: [
      {
        label: "쏘빅 라이터에서 출품 신청",
        detail: (
          <>
            <a href="https://writer.ssobig.com" target="_blank" rel="noopener noreferrer">
              writer.ssobig.com
            </a>{" "}
            → 출력하기 → 출품하기. 7일 안에 답을 드립니다
          </>
        ),
      },
      { label: "코멘트로 함께 검수" },
      { label: "쏘빅툴로 1차 포팅" },
      { label: "작가님 확인" },
    ],
  },
];

const TERMS: { name: string; chips: { text: string; on?: boolean }[]; desc: string }[] = [
  {
    name: "이용 방식",
    chips: [{ text: "독점" }, { text: "비독점" }],
    desc: "비독점이면 다른 판매처에서도 작품을 판매하실 수 있습니다.",
  },
  {
    name: "등록 언어",
    chips: [{ text: "한국어" }, { text: "일본어" }, { text: "영어" }],
    desc: "쏘빅툴에서 판매할 언어판입니다. 번역은 작가님 동의를 받아 진행합니다.",
  },
  {
    name: "판매 채널",
    chips: [{ text: "쏘빅툴" }, { text: "텀블벅" }, { text: "기타" }],
    desc: "텀블벅 같은 크라우드펀딩은 대략 1달 동안 판매하며, 이 계약이 아니라 별도 특약을 따릅니다.",
  },
  {
    name: "가격",
    chips: [{ text: "텀블벅 ○○○○원" }, { text: "쏘빅툴 이용권 ○○토큰" }],
    desc: "보통 텀블벅 가격을 기준으로 쏘빅툴 토큰 가격을 맞춥니다. 최종 가격은 작가님과 협의해 작품마다 정하며, 작가님과 쏘빅 모두의 수익이 커지는 쪽으로 정합니다.",
  },
  {
    name: "수익 배분율",
    chips: [{ text: "작가 10%" }, { text: "작가 30% · 기본", on: true }, { text: "작가 50%" }],
    desc: "기본은 30%이고, 10~50% 사이에서 조정합니다. 이미 완성도가 높고 작가님이 테스트 플레이를 많이 해 본 작품일수록 올라가고, BGM·일러스트·멀티 뷰 같은 장치와 기믹 등 쏘빅이 만드는 부분이 많을수록 내려갑니다.",
  },
  {
    name: "계약 기간",
    chips: [{ text: "1년" }, { text: "2년" }, { text: "5년" }],
    desc: "판매개시일부터 정한 기간마다 갱신합니다. 변경 요청이 없으면 같은 조건으로 자동 갱신합니다. 변경을 협의해도 합의가 되지 않으면 갱신일부터 신규 판매를 끝냅니다.",
  },
];

const PREPARE: [string, string, string][] = [
  [
    "쏘빅툴로 옮기기",
    "자료 정리 · 번역 · 디지털 구현 중 정한 일을 맡고, 화면 · 정보 공개 순서 · 분기 · 연출을 구성합니다",
    "—",
  ],
  [
    "테스트 플레이",
    "기본으로 쏘빅이 테스터를 모아 플레이 테스트를 하고 결과를 공유합니다. 원하시면 작가님께도 테스트 링크를 드립니다",
    "결과를 보시고 의견을 주세요. 테스트 링크를 받으시면 혼자 또는 지인들과 직접 플레이해 보실 수도 있습니다",
  ],
  ["보완", "의견을 반영해 고칩니다", "줄거리·결말을 바꿔야 할 때는 동의 여부를 정해 주세요"],
  [
    "판매 페이지 준비",
    "판매 페이지와 구매 안내를 준비하고, 쏘빅 채널 · SNS · 관련 커뮤니티에서 작품을 소개합니다",
    "소개 문구를 확인해 주세요",
  ],
  [
    "판매 시작",
    "판매개시일에 판매를 시작합니다. 구매자 문의는 쏘빅이 받아 답하고 환불도 처리합니다. 작품 내용과 관련된 문의는 작가님께 연락드려 함께 답합니다. 오류 수정과 업데이트도 반영합니다",
    "작품 내용 관련 문의로 연락드리면 답변을 함께 정해 주세요. 그 밖의 문의와 환불은 따로 하실 일이 없습니다",
  ],
];

const BARS = [
  { m: "1월", v: 12, h: "35%" },
  { m: "2월", v: 18, h: "53%" },
  { m: "3월", v: 25, h: "74%" },
  { m: "4월", v: 21, h: "62%" },
  { m: "5월", v: 30, h: "88%" },
  { m: "6월", v: 34, h: "100%", now: true },
];

function Flow({ items }: { items: string[] }) {
  return (
    <div className="flow">
      {items.map((t, i) => (
        <span key={t} className="flow-item">
          {i > 0 && <i aria-hidden="true">→</i>}
          <span className={i === items.length - 1 ? "flow-step last" : "flow-step"}>{t}</span>
        </span>
      ))}
    </div>
  );
}

function SecHead({ small, title, desc }: { small: string; title: string; desc: string }) {
  return (
    <div className="sec-head">
      <small>{small}</small>
      <h2>{title}</h2>
      <p>{desc}</p>
    </div>
  );
}

export default function CreatorPage() {
  return (
    <div className="creator-page">
      <div className="wrap">
        <header className="cover">
          <div className="eyebrow">쏘빅툴 작가 안내</div>
          <h1>
            작품을 쏘빅툴에서
            <br />
            판매하기까지
          </h1>
          <p>
            쏘빅툴에 작품을 등록해 이용권을 판매하기까지의 과정입니다.{" "}
            <b>작품 확인 · 계약 · 판매 준비 · 정산</b> 순서로 진행하며, 작품 확인 방법만 경로에 따라
            다릅니다.
          </p>
          <ol className="stages" aria-label="네 단계">
            {STAGES.map((s, i) => (
              <li key={s.name}>
                <small>{i + 1}단계</small>
                <b>{s.name}</b>
                <span>{s.sub}</span>
              </li>
            ))}
          </ol>
        </header>

        <section id="check">
          <SecHead
            small="1단계 · 원고와 자료 검토"
            title="작품 확인"
            desc="작품은 세 가지 경로로 받습니다. 경로마다 확인 방법이 다릅니다."
          />
          <div className="paths">
            {PATHS.map((p) => (
              <article className="path" key={p.title}>
                <span className="tag">{p.tag}</span>
                <h3>{p.title}</h3>
                <p>{p.desc}</p>
                <ol>
                  {p.steps.map((s, i) => (
                    <li key={s.label}>
                      <em>{i + 1}</em>
                      <span>
                        {s.label}
                        {s.detail && <small>{s.detail}</small>}
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            ))}
          </div>
          <div className="note">
            작품에 쓰는 그림·음원 같은 자료는 작가님이 쓸 권리를 확보해 주세요. 확인을 마치면 계약
            단계로 넘어갑니다.
          </div>
        </section>

        <section id="contract">
          <SecHead
            small="2단계 · 작품별 조건 협의, 계약 체결"
            title="계약"
            desc="작품 확인 결과를 바탕으로 쏘빅이 작품별 조건표를 제안하고, 작가님과 협의해 정합니다."
          />
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th>항목</th>
                  <th>선택지</th>
                  <th>설명</th>
                </tr>
              </thead>
              <tbody>
                {TERMS.map((t) => (
                  <tr key={t.name}>
                    <td>{t.name}</td>
                    <td className="chips-cell">
                      <div className="chips">
                        {t.chips.map((c) => (
                          <span key={c.text} className={c.on ? "chip on" : "chip"}>
                            {c.text}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h3>계약 순서</h3>
          <Flow items={["조건 제안", "계약서 초안 검토", "조정·반영", "기본계약 동의", "작품 등록·계약 성립"]} />
          <ul className="plain">
            <li>
              <b>저작권은 작가님께 그대로 있습니다.</b> 쏘빅툴에서 작품을 제공하는 데 필요한 범위만
              이용을 허락하시는 방식입니다.
            </li>
            <li>
              계약서 초안을 검토하실 때는 쏘빅이 맡을 일, 이용권 한 건이 팔리면 얼마를 정산받는지 같은
              것을 확인하실 수 있습니다.
            </li>
            <li>기본계약은 처음 한 번만 동의하시고, 작품은 한 편씩 등록을 신청하시면 됩니다.</li>
            <li>쏘빅이 확정 조건과 판매개시일을 안내하고, 보관하실 계약본을 드립니다.</li>
          </ul>
        </section>

        <section id="prepare">
          <SecHead
            small="3단계 · 쏘빅툴 포팅, 테스트, 판매 시작"
            title="판매 준비"
            desc="계약을 마치면 쏘빅이 작품을 쏘빅툴로 옮기고, 테스트와 보완을 거쳐 판매를 시작합니다."
          />
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th>순서</th>
                  <th>쏘빅이 하는 일</th>
                  <th>작가님이 하시는 일</th>
                </tr>
              </thead>
              <tbody>
                {PREPARE.map(([step, ssobig, author]) => (
                  <tr key={step}>
                    <td>{step}</td>
                    <td>{ssobig}</td>
                    <td>{author}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="settle">
          <SecHead
            small="4단계 · 월말 마감, 다음 달 말일 지급"
            title="정산"
            desc="작가님 몫은 할인 전 정가를 기준으로 계산합니다. 작가님이 부담하시는 비용은 없습니다."
          />
          <div className="calc">
            <div className="big">
              <small>작가님 몫</small>
              <b>정가(토큰) × 100원 × 수익 배분율</b>
              <p>할인해서 팔려도 정가로 계산합니다. 할인 금액과 결제 수수료는 쏘빅이 부담합니다.</p>
            </div>
            <div className="ex">
              <small>예시 · 정가 50토큰, 수익 배분율 30%</small>
              <div className="eq">50 × 100원 × 30% = 1,500원</div>
              <p>할인가로 팔려도 1,500원이 그대로 작가님 몫입니다(세전 금액).</p>
            </div>
          </div>

          <h3>정산 일정</h3>
          <Flow items={["월말 마감", "정산 명세서 발송", "원천징수 반영", "다음 달 말일까지 지급"]} />
          <ul className="plain">
            <li>판매 현황은 매달 보내 드리는 정산 명세서로 확인하실 수 있습니다.</li>
            <li>원천징수 대상이면 세금을 떼고 지급합니다.</li>
            <li>
              일본 계좌는 엔화로 보내 드립니다. 그 밖의 나라 계좌는 첫 지급 전에 지급 통화를 정합니다.
              해외 송금 수수료는 쏘빅이 부담합니다.
            </li>
            <li>
              판매를 그만두고 싶으시면 요청하신 날부터 30일 안에 작품을 숨김 처리해 더 팔리지 않게
              합니다. 작품을 지우는 것이 아니라서 이미 구매한 분은 계속 이용할 수 있고, 남은 작가님
              몫도 정산해 드립니다.
            </li>
          </ul>

          <h3>보내 드리는 자료</h3>
          <div className="report">
            <div className="rcard">
              <div className="rhead">
                <b>정산 명세서</b>
                <span className="ex-tag">예시</span>
              </div>
              <div className="rsub">○월분 · 작품명</div>
              <dl className="stmt">
                {[
                  ["판매 이용권", "○○건"],
                  ["정가 합계", "○○토큰"],
                  ["환불 조정", "○○원"],
                  ["수익 배분율", "○○%"],
                  ["작가님 몫 (세전)", "○○원"],
                  ["원천징수", "○○원"],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
                <div className="total">
                  <dt>지급 금액</dt>
                  <dd>○○원</dd>
                </div>
              </dl>
            </div>
            <div className="rcard">
              <div className="rhead">
                <b>판매 결과 공유</b>
                <span className="ex-tag">예시</span>
              </div>
              <div className="rsub">월별 판매 이용권 · 예시 숫자</div>
              <div
                className="bars"
                role="img"
                aria-label="월별 판매 이용권 예시 막대그래프. 1월 12건, 2월 18건, 3월 25건, 4월 21건, 5월 30건, 6월 34건"
              >
                {BARS.map((b) => (
                  <div
                    key={b.m}
                    className={b.now ? "bar now" : "bar"}
                    style={{ "--h": b.h } as CSSProperties}
                  >
                    <span>{b.v}</span>
                    <i>{b.m}</i>
                  </div>
                ))}
              </div>
              <div className="rstats">
                <div>
                  <small>플레이 현황</small>
                  <b>○○회</b>
                </div>
                <div>
                  <small>후기</small>
                  <b>○○건</b>
                </div>
              </div>
              <p className="rnote">판매 실적, 집계할 수 있는 플레이 현황, 후기를 모아 공유해 드립니다.</p>
            </div>
          </div>
        </section>

        <footer className="creator-footer">쏘빅툴 작가 안내 · 주식회사 쏘빅</footer>
      </div>
    </div>
  );
}
