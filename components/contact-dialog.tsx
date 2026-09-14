'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
export default function ContactDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
 const ref = useRef<HTMLDialogElement>(null);
 const [sent, setSent] = useState(false);
 useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) { setSent(false); dialog.showModal(); } else if (!open && dialog.open) dialog.close(); }, [open]);
 function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
 return <dialog ref={ref} className="contact-dialog" onCancel={onClose} onClose={onClose} aria-labelledby="contact-title" onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}>
  <div className="dialog-inner"><button className="close-button" onClick={onClose} aria-label="견적 문의 닫기">×</button>
  {sent ? <div className="success-state" role="status"><span className="eyebrow">THANK YOU</span><h2 id="contact-title">상담 내용을<br />작성해 주셔서 감사합니다.</h2><p>견적 신청 시연이 완료되었습니다.<br />입력하신 정보는 저장되거나 전송되지 않습니다.</p><button className="button dark" onClick={onClose}>공간 더 둘러보기 <span>↗</span></button></div> : <>
   <span className="eyebrow">START YOUR PROJECT</span><h2 id="contact-title">리모델링 상담 신청</h2><p className="dialog-lead">시공할 공간과 계획을 알려주세요. 상담에 필요한 정보를 받습니다.</p>
   <form onSubmit={submit} className="contact-form">
    <label>이름<input name="name" autoComplete="name" required maxLength={40} placeholder="성함을 입력해 주세요" /></label>
    <label>연락처<input name="phone" type="tel" autoComplete="tel" required pattern={"[0-9\\s\\-]{9,20}"} title="숫자와 하이픈으로 연락처를 입력해 주세요" placeholder="010-0000-0000" /></label>
    <label>시공 지역<input name="location" autoComplete="address-level2" required maxLength={100} placeholder="예: 서울 서초구 반포동" /></label>
    <label>공간 유형<select name="type" required defaultValue=""><option value="" disabled>선택해 주세요</option><option>아파트</option><option>단독주택 / 빌라</option><option>기타 주거 공간</option></select></label>
    <label>면적 (평)<input name="area" type="number" min={1} max={1000} required placeholder="예: 48" /></label>
    <label>예산 범위<select name="budget" required defaultValue=""><option value="" disabled>선택해 주세요</option><option>5천만 원 미만</option><option>5천만 ~ 1억 원</option><option>1억 ~ 2억 원</option><option>2억 원 이상</option><option>상담 후 결정</option></select></label>
    <label className="form-wide">희망 일정<select name="schedule" required defaultValue=""><option value="" disabled>선택해 주세요</option><option>3개월 이내</option><option>3 ~ 6개월 이내</option><option>6개월 이후</option><option>일정 협의</option></select></label>
    <label className="form-wide">요청 사항 <span className="optional">선택</span><textarea name="message" rows={3} maxLength={2000} placeholder="바꾸고 싶은 구조, 선호하는 소재, 생활 방식을 적어주세요." /></label>
    <label className="consent form-wide"><input type="checkbox" required /><span>포트폴리오 시연용 폼이며, 입력 정보가 전송되지 않음을 확인했습니다.</span></label>
    <button className="button bronze form-wide" type="submit">무료 견적 신청 <span>↗</span></button>
   </form>
  </>}
  </div>
 </dialog>;
}
