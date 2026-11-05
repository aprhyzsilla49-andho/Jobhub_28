const CANDIDATE_PROFILE_KEY='jobhub-candidate-public-profiles';
const CANDIDATE_DRAFT_KEY='jobhub-candidate-profile-draft';
const candidateWizardStepNames=[
  'Foto profil','Data pribadi','Posisi yang dicari','Tentang saya','Pendidikan',
  'Pengalaman kerja','Skill','Bahasa','Sertifikat','Upload CV','Portfolio',
  'Media sosial','Preferensi kerja','Dokumen tambahan','Preview profil'
];
const candidateWizardStepIcons=[
  'fa-camera','fa-user','fa-briefcase','fa-file-lines','fa-graduation-cap',
  'fa-building','fa-star','fa-language','fa-certificate','fa-file-arrow-up',
  'fa-images','fa-share-nodes','fa-sliders','fa-folder-open','fa-eye'
];
let candidateWizardStep=0;
let candidateWizardData={};
let candidateWizardFiles={};
let currentCandidateProfile=null;
let candidateProfileLoaded=false;
let candidateProfileLoading=false;
let candidateSearchCache=[];
let candidateSearchProfilesLoaded=false,candidateSearchRequestId=0,candidateSearchTimer=0,candidateSearchDataVersion=0,candidateSearchLoadPromise=null;
let candidateQuickEdit=false;
let pendingCandidateQuickEdit=null;
let candidateQuickEditFocus=null;
let candidateProfileInviteChannel=null;
let candidateSearchChannel=null;
let candidatePublicProfileChannel=null;
let candidatePublicProfileChannelKey='';
let candidatePublicProfileRequestId=0;
const candidateViewedProfiles=new Set();

function getLocalCandidateProfiles() {
  try {
    const value=JSON.parse(localStorage.getItem(CANDIDATE_PROFILE_KEY)||'[]');
    return Array.isArray(value)?value:[];
  } catch {
    return [];
  }
}
function saveLocalCandidateProfiles(profiles) {
  try {
    localStorage.setItem(CANDIDATE_PROFILE_KEY,JSON.stringify(profiles));
  } catch(error) {
    throw new Error('Profil tidak tersimpan di perangkat. Periksa ruang penyimpanan browser dan coba lagi.',{cause:error});
  }
}
function currentCandidateOwnerId() {
  return supabaseSession?.user?.id||'demo-candidate';
}
function candidateAge(date) {
  if(typeof date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(date))return '';
  const [year,month,day]=date.split('-').map(Number);
  const birth=new Date(year,month-1,day);
  if(birth.getFullYear()!==year||birth.getMonth()!==month-1||birth.getDate()!==day)return '';
  const now=new Date();
  if(birth>now)return '';
  let age=now.getFullYear()-birth.getFullYear();
  if(now.getMonth()<birth.getMonth()||(now.getMonth()===birth.getMonth()&&now.getDate()<birth.getDate()))age--;
  return age>=0?age:'';
}
function calculateCandidateExperienceYears(rows=[]) {
  if(!Array.isArray(rows))return 0;
  const intervals=rows.filter(row=>row&&typeof row==='object'&&row.startDate).map((row,index)=>{
    const start=new Date(row.startDate);
    const end=row.endDate?new Date(row.endDate):candidateWizardData.currentlyWorking&&index===rows.length-1?new Date():start;
    return Number.isNaN(start.getTime())||Number.isNaN(end.getTime())?null:[start.getTime(),Math.max(start.getTime(),end.getTime())];
  }).filter(Boolean).sort((left,right)=>left[0]-right[0]);
  let total=0,lastEnd=0;
  for(const [start,end] of intervals) {
    total+=Math.max(0,end-Math.max(start,lastEnd));
    lastEnd=Math.max(lastEnd,end);
  }
  return Math.floor(total/(365.25*24*60*60*1000));
}
function candidateSafeHttpUrl(value) {
  try {
    const url=new URL(String(value||''));
    return ['http:','https:'].includes(url.protocol)&&!url.username&&!url.password?url.href:'';
  } catch {
    return '';
  }
}
function candidateSharedContact(data={}) {
  return data?.shareContact===true&&data.contact&&typeof data.contact==='object'?data.contact:{};
}
function candidateArray(value) {
  return Array.isArray(value)?value:[];
}
function candidateSafeImageUrl(value) {
  const source=String(value||'');
  return /^data:image\/(?:jpeg|png);base64,/i.test(source)?source:candidateSafeHttpUrl(source);
}
function candidateCvDownloadUrl(value,name='CV.pdf') {
  const safeUrl=candidateSafeHttpUrl(value);
  if(!safeUrl)return '';
  try {
    const url=new URL(safeUrl);
    if(url.pathname.includes('/storage/v1/object/public/'))url.searchParams.set('download',name||'CV.pdf');
    return url.href;
  } catch {
    return safeUrl;
  }
}
function renderCandidateCvActions(url,name='CV.pdf') {
  const safeUrl=candidateSafeHttpUrl(url);
  if(!safeUrl)return '';
  return `<div class="candidate-cv-actions"><a class="btn btn-outline btn-small" href="${escapeHtml(safeUrl)}" target="_blank" rel="noopener"><i class="fa-solid fa-eye" aria-hidden="true"></i> Lihat CV</a><a class="btn btn-outline btn-small" href="${escapeHtml(candidateCvDownloadUrl(safeUrl,name))}" download="${escapeHtml(name||'CV.pdf')}"><i class="fa-solid fa-download" aria-hidden="true"></i> Download CV</a></div>`;
}
function candidateResumeDate(value) {
  if(!value)return '';
  const date=new Date(/^\d{4}$/.test(value)?`${value}-01-01T00:00:00`:/^\d{4}-\d{2}$/.test(value)?`${value}-01T00:00:00`:/^\d{4}-\d{2}-\d{2}$/.test(value)?`${value}T00:00:00`:value);
  return Number.isNaN(date.getTime())?String(value):new Intl.DateTimeFormat('id-ID',{month:'short',year:'numeric'}).format(date);
}
function generateCandidateResume(profile) {
  const resumeWindow=window.open('','_blank');
  if(!resumeWindow) {
    toast('Resume tidak dapat dibuka. Izinkan pop-up untuk situs ini, lalu coba lagi.');
    return;
  }
  const data=profile.publicData||profile.public_data||{};
  const experience=Array.isArray(data.experience)?data.experience:[];
  const education=Array.isArray(data.education)?data.education:[];
  const skills=Array.isArray(profile.skills)?profile.skills:Array.isArray(data.skills)?data.skills:[];
  const languages=Array.isArray(data.languages)?data.languages:[];
  const certificates=Array.isArray(data.certificates)?data.certificates:[];
  const contact=candidateSharedContact(data);
  const links=(data.portfolio||[]).map(item=>{
    const url=candidateSafeHttpUrl(item.url);
    return url?`<li><a href="${escapeHtml(url)}">${escapeHtml(item.label||'Portfolio')}</a></li>`:'';
  }).filter(Boolean).join('');
  const contactDetails=[contact.email?escapeHtml(contact.email):'',contact.whatsapp?escapeHtml(contact.whatsapp):''].filter(Boolean).join(' · ');
  const section=(title,content)=>content?`<section><h2>${title}</h2>${content}</section>`:'';
  const experienceContent=experience.map(item=>{
    const range=[candidateResumeDate(item.startDate),item.endDate?candidateResumeDate(item.endDate):data.currentlyWorking?'Sekarang':''].filter(Boolean).join(' – ');
    return `<article><h3>${escapeHtml(item.position||'Pengalaman kerja')}</h3><p class="meta">${escapeHtml(item.company||'')}${item.location?` · ${escapeHtml(item.location)}`:''}${range?` · ${escapeHtml(range)}`:''}</p>${item.description?`<p>${escapeHtml(item.description)}</p>`:''}</article>`;
  }).join('');
  const educationContent=education.map(item=>{
    const range=[item.startYear,item.endYear|| (data.educationStillStudying?'Saat ini':'')].filter(Boolean).join(' – ');
    return `<article><h3>${escapeHtml(item.level||'Pendidikan')}</h3><p class="meta">${escapeHtml(item.school||'')}${item.major?` · ${escapeHtml(item.major)}`:''}${range?` · ${escapeHtml(range)}`:''}</p>${item.gpa?`<p>IPK: ${escapeHtml(item.gpa)}</p>`:''}</article>`;
  }).join('');
  const languageContent=languages.map(item=>`<li>${escapeHtml(item.language||'')}${item.level?` — ${escapeHtml(item.level)}`:''}</li>`).join('');
  const certificateContent=certificates.map(item=>`<li>${escapeHtml(item.name||'Sertifikat')}${item.issuer?` — ${escapeHtml(item.issuer)}`:''}</li>`).join('');
  const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Resume ${escapeHtml(profile.full_name||'Kandidat')}</title><style>
    *{box-sizing:border-box}body{margin:0;background:#eef2ef;color:#1d302c;font:15px/1.65 Arial,sans-serif}.resume{max-width:850px;margin:32px auto;padding:54px 64px;background:#fff;box-shadow:0 10px 40px #10251b18}header{border-bottom:3px solid #126c58;padding-bottom:24px}h1{font-size:34px;line-height:1.15;margin:0 0 8px}header h2{color:#126c58;font-size:20px;margin:0 0 8px}header p,.meta{color:#596c65;margin:4px 0}section{margin-top:27px}section h2{font-size:17px;text-transform:uppercase;letter-spacing:1px;color:#126c58;border-bottom:1px solid #dce7df;padding-bottom:7px;margin:0 0 12px}article{margin:0 0 17px}h3{font-size:16px;margin:0 0 3px}article p{margin:5px 0;white-space:pre-line}ul{padding-left:20px;margin:6px 0}a{color:#126c58;overflow-wrap:anywhere}.print-action{display:block;margin:18px auto 32px;padding:11px 18px;border:0;border-radius:7px;background:#126c58;color:#fff;font-size:15px;font-weight:700;cursor:pointer}@media(max-width:600px){.resume{margin:0;padding:30px 22px}h1{font-size:28px}}@media print{body{background:#fff;font-size:11pt}.resume{max-width:none;margin:0;padding:0;box-shadow:none}.print-action{display:none}section,article{break-inside:avoid}a{color:inherit;text-decoration:none}}
    </style></head><body><button class="print-action" onclick="window.print()">Cetak / Simpan sebagai PDF</button><main class="resume"><header><h1>${escapeHtml(profile.full_name||'Nama kandidat')}</h1><h2>${escapeHtml(profile.main_position||'Posisi yang dicari')}</h2><p>${escapeHtml(profile.location||'')}</p>${contactDetails?`<p>${contactDetails}</p>`:''}<p>${escapeHtml(profile.experience_years?`${profile.experience_years} tahun pengalaman`:data.workStatus==='Fresh Graduate'?'Fresh Graduate':'')}</p></header>
    ${section('Ringkasan profesional',profile.about?`<p>${escapeHtml(profile.about)}</p>`:'')}
    ${section('Keahlian',skills.length?`<ul>${skills.map(skill=>`<li>${escapeHtml(skill)}</li>`).join('')}</ul>`:'')}
    ${section('Pengalaman kerja',experienceContent)}
    ${section('Pendidikan',educationContent)}
    ${section('Bahasa',languageContent?`<ul>${languageContent}</ul>`:'')}
    ${section('Sertifikat',certificateContent?`<ul>${certificateContent}</ul>`:'')}
    ${section('Portfolio',links?`<ul>${links}</ul>`:'')}
    </main><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),300));</script></body></html>`;
  resumeWindow.document.open();
  resumeWindow.document.write(html);
  resumeWindow.document.close();
  resumeWindow.focus();
}
const resumeStudioFonts={
  georgia:'Georgia, serif',
  garamond:'Garamond, Georgia, serif',
  trebuchet:'Trebuchet MS, sans-serif',
  verdana:'Verdana, sans-serif',
  system:'system-ui, sans-serif'
};
const resumeStudioTemplates=['executive','editorial','modern','creative','minimal','nordic','corporate','compact','elegant','bold','letter-classic','letter-modern','letter-corporate','letter-elegant','letter-minimal'];
const resumeLetterTemplates=['letter-classic','letter-modern','letter-corporate','letter-elegant','letter-minimal'];
let resumeStudioSelectionRange=null;
let resumeStudioActiveEditor=null;
function resumeStudioKey() {
  return `jobhub-resume-studio-${currentCandidateOwnerId()}`;
}
function saveResumeStudioState(state) {
  try {
    const serialized=JSON.stringify(state);
    if(new Blob([serialized]).size>3*1024*1024)throw new Error('Resume melebihi batas penyimpanan lokal.');
    localStorage.setItem(resumeStudioKey(),serialized);
    return true;
  } catch(error) {
    toast('Resume belum tersimpan. Penyimpanan browser penuh atau tidak tersedia; data sebelumnya tetap dipertahankan.');
    console.warn('Resume studio state could not be saved:',error.name||'StorageError');
    return false;
  }
}
function resumeStudioBase(profile) {
  const data=profile.publicData||profile.public_data||{};
  const contact=candidateSharedContact(data);
  const skills=Array.isArray(profile.skills)?profile.skills:candidateArray(data.skills);
  const experience=candidateArray(data.experience).filter(item=>item&&typeof item==='object').map(item=>{
    const range=[candidateResumeDate(item.startDate),item.endDate?candidateResumeDate(item.endDate):data.currentlyWorking?'Sekarang':''].filter(Boolean).join(' - ');
    return [item.position,item.company,range,item.description].filter(Boolean).join(' | ');
  }).join('\n\n');
  const education=candidateArray(data.education).filter(item=>item&&typeof item==='object').map(item=>[item.level,item.school,item.major,[item.startYear,item.endYear].filter(Boolean).join(' - ')].filter(Boolean).join(' | ')).join('\n');
  return {
    template:'executive',documentMode:'resume',font:'georgia',fontSize:'13',accent:'#b58a45',
    fullName:profile.full_name||'',position:profile.main_position||'',location:profile.location||'',
    email:contact.email||'',phone:contact.whatsapp||'',
    summary:profile.about||'Tambahkan ringkasan profesional dan pencapaian utama Anda.',skills:skills.join(', ')||'Tambahkan keahlian utama Anda',
    experience:experience||'Tambahkan posisi, perusahaan, periode, dan pencapaian Anda.',education:education||'Tambahkan jenjang pendidikan, institusi, jurusan, dan tahun.',
    certificates:(data.certificates||[]).map(item=>[item.name,item.issuer].filter(Boolean).join(' - ')).join('\n')||'Tambahkan sertifikasi, penerbit, atau penghargaan.',
    portfolio:(data.portfolio||[]).map(item=>[item.label,item.url].filter(Boolean).join(' - ')).join('\n')||'Tambahkan proyek atau tautan portfolio.',
    photo:profile.profile_image_url||data.profileImageUrl||'',certificateUploads:[],
    documentTitle:'CURRICULUM VITAE',extraSections:[],
    letterDate:new Intl.DateTimeFormat('id-ID',{dateStyle:'long'}).format(new Date()),letterRecipient:'HRD / Tim Rekrutmen',letterCompany:'Nama Perusahaan',letterCompanyAddress:'Alamat Perusahaan',letterSubject:`Lamaran Kerja - ${profile.main_position||'Posisi yang Dilamar'}`,letterOpening:'Dengan hormat,',letterBody:profile.about||'Melalui surat ini, saya mengajukan lamaran untuk posisi yang tersedia. Saya memiliki pengalaman dan keterampilan yang relevan untuk berkontribusi pada perusahaan.',letterClosing:'Saya berharap mendapat kesempatan untuk menjelaskan kualifikasi saya lebih lanjut. Terima kasih atas waktu dan pertimbangannya.',letterSignoff:'Hormat saya,',letterSignature:profile.full_name||'',
    summaryListStyle:'plain',skillsListStyle:'bullet',experienceListStyle:'bullet',educationListStyle:'bullet',certificatesListStyle:'check',portfolioListStyle:'bullet'
  };
}
function readResumeStudioState(profile) {
  const base=resumeStudioBase(profile);
  try {
    const saved=JSON.parse(localStorage.getItem(resumeStudioKey())||'{}');
    if(!saved||typeof saved!=='object'||Array.isArray(saved))return base;
    const extraSections=Array.isArray(saved.extraSections)?saved.extraSections.filter(item=>item&&typeof item==='object'&&typeof item.id==='string').slice(0,30):base.extraSections;
    const certificateUploads=Array.isArray(saved.certificateUploads)?saved.certificateUploads.filter(item=>item&&typeof item==='object'&&typeof item.name==='string').slice(0,12):base.certificateUploads;
    return {...base,...saved,documentMode:['resume','cover-letter'].includes(saved.documentMode)?saved.documentMode:base.documentMode,template:resumeStudioTemplates.includes(saved.template)?saved.template:base.template,font:resumeStudioFonts[saved.font]?saved.font:base.font,fontSize:String(Math.min(36,Math.max(9,Number(saved.fontSize)||13))),accent:/^#[0-9a-f]{6}$/i.test(saved.accent||'')?saved.accent:base.accent,extraSections,certificateUploads};
  } catch {
    return base;
  }
}
function resumeStudioLines(value) {
  return String(value||'').split('\n').map(item=>item.replace(/^\s*(?:[•●▪✓✔☑*-]|\d+[.)])\s*/,'').trim()).filter(Boolean);
}
function resumeStudioList(value,style='bullet') {
  const items=resumeStudioLines(value);
  if(!items.length)return '';
  const safeStyle=['plain','bullet','check'].includes(style)?style:'bullet';
  if(safeStyle==='plain')return items.map(item=>`<p>${escapeHtml(item)}</p>`).join('');
  return `<ul class="resume-list resume-list-${safeStyle}">${items.map(item=>`<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}
function resumeStudioSafeMarkup(value) {
  const parsed=new DOMParser().parseFromString(String(value||''),'text/html');
  const allowed=new Set(['B','STRONG','I','EM','U','S','SPAN','P','DIV','BR','UL','OL','LI']);
  const clean=node=>{
    for(const child of [...node.children]) {
      clean(child);
      if(!allowed.has(child.tagName))child.replaceWith(...child.childNodes);
      else {
        const sourceStyle=['SPAN','DIV','P','LI'].includes(child.tagName)?child.getAttribute('style')||'':'';
        const sourceClass=child.tagName==='UL'?String(child.getAttribute('class')||'').split(/\s+/).filter(name=>['resume-list','resume-list-bullet','resume-list-check'].includes(name)):[];
        for(const attribute of [...child.attributes])child.removeAttribute(attribute.name);
        if(sourceClass.length)child.setAttribute('class',sourceClass.join(' '));
        if(sourceStyle) {
          const style=document.createElement('span').style;
          style.cssText=sourceStyle;
          const kept=[];
          if(/^(?:#[0-9a-f]{3,8}|rgba?\([\d\s.,%/]+\))$/i.test(style.color))kept.push(`color:${style.color}`);
          if(/^(?:\d{1,2}(?:px|pt|em|rem))$/.test(style.fontSize))kept.push(`font-size:${style.fontSize}`);
          if(['left','center','right','justify'].includes(style.textAlign))kept.push(`text-align:${style.textAlign}`);
          if(['bold','normal','600','700','800','900'].includes(style.fontWeight))kept.push(`font-weight:${style.fontWeight}`);
          if(style.fontStyle==='italic')kept.push('font-style:italic');
          if(style.textDecorationLine==='underline'||style.textDecoration==='underline')kept.push('text-decoration:underline');
          if(kept.length)child.setAttribute('style',kept.join(';'));
        }
      }
    }
  };
  clean(parsed.body);
  return parsed.body.innerHTML;
}
function resumeStudioSection(state,key,title,value,listStyle='bullet',suffix='') {
  const content=state[`${key}Html`]||resumeStudioList(value,listStyle);
  const titleContent=state[`${key}TitleHtml`]||escapeHtml(state[`${key}Title`]||title);
  return `<section class="resume-paper-section"><h2 contenteditable="true" role="textbox" aria-label="Judul bagian ${escapeHtml(title)}" data-resume-inline-title="${escapeHtml(key)}" spellcheck="false">${resumeStudioSafeMarkup(titleContent)}</h2><div class="resume-editable-content" contenteditable="true" role="textbox" aria-label="Isi bagian ${escapeHtml(title)}" data-resume-inline-content="${escapeHtml(key)}">${resumeStudioSafeMarkup(content)}</div>${suffix}</section>`;
}
function renderCoverLetterPreview(state) {
  const preview=$('#resumeStudioPreview');
  if(!preview)return;
  const field=(key,value,label,tag='div')=>`<${tag} contenteditable="true" role="textbox" aria-label="${label}" data-resume-inline="${key}" spellcheck="false">${resumeStudioSafeMarkup(state[`${key}Html`]||escapeHtml(value||''))}</${tag}>`;
  preview.innerHTML=`<article class="resume-paper resume-letter-paper resume-template-${state.template}" style="--resume-accent:${state.accent};--resume-font:${resumeStudioFonts[state.font]};--resume-size:${Number(state.fontSize)||13}px">
    <header class="resume-letter-sender"><div>${field('fullName',state.fullName||'Nama Kandidat','Nama pengirim','h1')}${field('position',state.position||'Posisi yang dilamar','Posisi pelamar','p')}</div><div class="resume-letter-contact">${state.email?`<span><i class="fa-regular fa-envelope" aria-hidden="true"></i>${field('email',state.email,'Email pengirim')}</span>`:''}${state.phone?`<span><i class="fa-solid fa-phone" aria-hidden="true"></i>${field('phone',state.phone,'Telepon pengirim')}</span>`:''}${state.location?`<span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${field('location',state.location,'Lokasi pengirim')}</span>`:''}</div></header>
    <main class="resume-letter-body"><p class="resume-letter-date">${field('letterDate',state.letterDate,'Tanggal surat')}</p><div class="resume-letter-recipient"><p>Kepada Yth.</p>${field('letterRecipient',state.letterRecipient,'Penerima surat')}<p>${field('letterCompany',state.letterCompany,'Nama perusahaan')}</p><p>${field('letterCompanyAddress',state.letterCompanyAddress,'Alamat perusahaan')}</p></div><p class="resume-letter-subject"><strong>Perihal:</strong> ${field('letterSubject',state.letterSubject,'Perihal surat')}</p><p>${field('letterOpening',state.letterOpening,'Salam pembuka')}</p><div class="resume-letter-content">${field('letterBody',state.letterBody,'Isi surat')}</div><p>${field('letterClosing',state.letterClosing,'Penutup surat')}</p><div class="resume-letter-signature"><p>${field('letterSignoff',state.letterSignoff,'Salam penutup')}</p><div class="resume-letter-signature-space"></div>${field('letterSignature',state.letterSignature||state.fullName,'Nama tanda tangan')}</div></main>
  </article>`;
}
function resumeStudioCertificateRows(items=[]) {
  return items.length?items.map((item,index)=>`<div><i class="fa-${item.preview?'regular':'solid'} ${item.preview?'fa-image':'fa-file-pdf'}" aria-hidden="true"></i><span>${escapeHtml(item.name)}</span><button type="button" data-resume-remove-certificate="${index}" aria-label="Hapus ${escapeHtml(item.name)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>`).join(''):'<small class="form-note">Belum ada sertifikat diunggah.</small>';
}
async function resumeCertificateEntry(file) {
  if(!(file instanceof File)||!file.size||file.size>5*1024*1024)throw new Error('Sertifikat harus berukuran maksimal 5 MB.');
  if(!['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type))throw new Error('Sertifikat harus PDF, JPG, PNG, atau WEBP.');
  if(file.type==='application/pdf') {
    if(!window.pdfjsLib?.getDocument)return {name:file.name,preview:'',type:'pdf'};
    window.pdfjsLib.GlobalWorkerOptions.workerSrc='https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
    const pdfDocument=await window.pdfjsLib.getDocument({data:new Uint8Array(await file.arrayBuffer())}).promise;
    const page=await pdfDocument.getPage(1);
    const viewport=page.getViewport({scale:1});
    const scale=Math.min(1,700/viewport.width,900/viewport.height);
    const scaled=page.getViewport({scale});
    const canvas=document.createElement('canvas');canvas.width=Math.round(scaled.width);canvas.height=Math.round(scaled.height);
    const context=canvas.getContext('2d');if(!context)return {name:file.name,preview:'',type:'pdf'};
    await page.render({canvasContext:context,viewport:scaled}).promise;
    return {name:file.name,preview:canvas.toDataURL('image/jpeg',.72),type:'pdf'};
  }
  const source=await new Promise((resolve,reject)=>{
    const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Gambar sertifikat tidak dapat dibaca.'));reader.readAsDataURL(file);
  });
  const preview=await new Promise((resolve,reject)=>{
    const image=new Image();
    image.onload=()=>{
      const scale=Math.min(1,700/image.width,900/image.height);
      const canvas=document.createElement('canvas');canvas.width=Math.round(image.width*scale);canvas.height=Math.round(image.height*scale);
      const context=canvas.getContext('2d');if(!context)return reject(new Error('Preview sertifikat tidak dapat dibuat.'));
      context.drawImage(image,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.72));
    };
    image.onerror=()=>reject(new Error('Gambar sertifikat tidak dapat diproses.'));
    image.src=source;
  });
  return {name:file.name,preview,type:'image'};
}
function renderResumeStudioPreview(state) {
  const preview=$('#resumeStudioPreview');
  if(!preview)return;
  if(state.documentMode==='cover-letter') {
    renderCoverLetterPreview(state);
    return;
  }
  const photo=candidateSafeImageUrl(state.photo);
  const skills=String(state.skills||'').split(/[\n,]/).map(item=>item.replace(/^\s*(?:[•●▪✓✔☑*-]|\d+[.)])\s*/,'').trim()).filter(Boolean).join('\n');
  const contact=[['fa-location-dot','location'],['fa-envelope','email'],['fa-phone','phone']].filter(([,key])=>state[key]).map(([icon,key])=>`<span><i class="fa-solid ${icon}" aria-hidden="true"></i><span contenteditable="true" role="textbox" aria-label="Edit ${key}" data-resume-inline="${key}" spellcheck="false">${escapeHtml(state[key])}</span></span>`).join('');
  const uploadedCertificates=(state.certificateUploads||[]).map(item=>item.preview?`<figure class="resume-certificate-preview"><img src="${escapeHtml(item.preview)}" alt="${escapeHtml(item.name)}"><figcaption>${escapeHtml(item.name)}</figcaption></figure>`:`<p class="resume-certificate-file"><i class="fa-regular fa-file-pdf" aria-hidden="true"></i>${escapeHtml(item.name)}</p>`).join('');
  const custom=(state.extraSections||[]).map(item=>{
    const key=`extra_${item.id}`;
    state[key]=item.content;
    state[`${key}Html`]=item.contentHtml||'';
    state[`${key}Title`]=item.title;
    state[`${key}TitleHtml`]=item.titleHtml||'';
    return {item,key};
  });
  const renderCustom=column=>custom.filter(({item})=>item.column===column).map(({item,key})=>resumeStudioSection(state,key,item.title,item.content,item.listStyle||'bullet')).join('');
  preview.innerHTML=`<article class="resume-paper resume-template-${state.template}" style="--resume-accent:${state.accent};--resume-font:${resumeStudioFonts[state.font]};--resume-size:${Number(state.fontSize)||13}px">
    <header class="resume-paper-header">${photo?`<img class="resume-paper-photo" src="${escapeHtml(photo)}" alt="Foto ${escapeHtml(state.fullName||'kandidat')}">`:''}<div><span class="resume-paper-kicker" contenteditable="true" role="textbox" aria-label="Judul resume" data-resume-inline="documentTitle" spellcheck="false">${resumeStudioSafeMarkup(state.documentTitleHtml||escapeHtml(state.documentTitle||'CURRICULUM VITAE'))}</span><h1 contenteditable="true" role="textbox" aria-label="Nama kandidat" data-resume-inline="fullName" spellcheck="false">${resumeStudioSafeMarkup(state.fullNameHtml||escapeHtml(state.fullName||'Nama Kandidat'))}</h1><p class="resume-paper-position" contenteditable="true" role="textbox" aria-label="Posisi kandidat" data-resume-inline="position" spellcheck="false">${resumeStudioSafeMarkup(state.positionHtml||escapeHtml(state.position||'Posisi yang dituju'))}</p><div class="resume-paper-contact">${contact}</div></div></header>
    <div class="resume-paper-body"><main>${resumeStudioSection(state,'summary','Profil',state.summary,state.summaryListStyle)}${resumeStudioSection(state,'experience','Pengalaman',state.experience,state.experienceListStyle)}${renderCustom('left')}</main><aside>${resumeStudioSection(state,'skills','Keahlian',skills,state.skillsListStyle)}${resumeStudioSection(state,'education','Pendidikan',state.education,state.educationListStyle)}${resumeStudioSection(state,'certificates','Sertifikasi',state.certificates,state.certificatesListStyle,uploadedCertificates)}${resumeStudioSection(state,'portfolio','Portfolio',state.portfolio,state.portfolioListStyle)}${renderCustom('right')}</aside></div>
  </article>`;
}
function downloadResumeStudio() {
  const paper=$('#resumeStudioPreview .resume-paper');
  if(!paper)return;
  const state=readResumeStudioState(getCurrentCandidateProfile()||{});
  const documentLabel=state.documentMode==='cover-letter'?'surat-lamaran':'resume';
  const filename=String(state.fullName||documentLabel).toLocaleLowerCase('id-ID').normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||documentLabel;
  const html=`<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${state.documentMode==='cover-letter'?'Surat Lamaran':'Resume'} ${escapeHtml(state.fullName||'Kandidat')}</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"><style>
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#e9eeeb;color:#25312d;font-family:${resumeStudioFonts[state.font]};font-size:${Number(state.fontSize)||13}px;line-height:1.55}.resume-paper{width:210mm;min-height:297mm;margin:0 auto;padding:19mm 18mm;background:#fff;box-shadow:0 12px 36px #14251d20}.resume-paper-header{display:flex;align-items:center;gap:20px;padding-bottom:20px;border-bottom:2px solid ${state.accent}}.resume-paper-photo{width:92px;height:108px;object-fit:cover}.resume-paper-kicker,.resume-paper-section h2{color:${state.accent};font-family:Arial,sans-serif;font-size:11px;font-weight:700}.resume-paper h1{margin:5px 0;font-size:30px}.resume-paper-position{color:${state.accent};font-size:17px;font-weight:700}.resume-paper-contact{display:flex;flex-wrap:wrap;gap:6px 14px;font:10px Arial,sans-serif}.resume-paper-contact span{display:inline-flex;gap:5px}.resume-paper-body{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(130px,.8fr);gap:24px;padding-top:20px}.resume-paper-section{margin:0 0 22px;overflow-wrap:anywhere}.resume-paper-section h2{padding-bottom:5px;border-bottom:1px solid #dce2dd;text-transform:uppercase}.resume-paper-section p{white-space:pre-line}.resume-list-bullet{padding:0;list-style:none}.resume-list-bullet li{position:relative;padding-left:16px}.resume-list-bullet li:before{position:absolute;left:0;color:${state.accent};content:'•'}.resume-list-check{padding:0;list-style:none}.resume-list-check li{position:relative;padding-left:19px}.resume-list-check li:before{position:absolute;left:0;color:${state.accent};content:'✓'}.resume-paper-contact i{color:${state.accent}}.resume-certificate-preview{display:inline-block;width:46%;margin:6px 4px 0 0;vertical-align:top}.resume-certificate-preview img{width:100%;max-height:110px;object-fit:contain}.resume-certificate-preview figcaption,.resume-certificate-file{font:9px Arial,sans-serif;overflow-wrap:anywhere}.resume-template-executive .resume-paper-header{margin:-19mm -18mm 0;padding:19mm 18mm 17px;background:#163b36;color:#fff}.resume-template-executive .resume-paper-kicker,.resume-template-executive .resume-paper-position,.resume-template-executive .resume-paper-contact{color:#fff}.resume-template-editorial .resume-paper-body,.resume-template-minimal .resume-paper-body{grid-template-columns:1fr}.resume-template-editorial .resume-paper-header{border-bottom-width:5px}.resume-template-modern .resume-paper-body aside,.resume-template-creative .resume-paper-body aside{padding:15px;background:#f0f4f1}.resume-template-creative .resume-paper-header{margin:-19mm -18mm 0;padding:19mm 18mm 22px;background:linear-gradient(125deg,#a83f32,#d3734d 62%,#e6ae78);color:#fff}.resume-template-creative .resume-paper-kicker,.resume-template-creative .resume-paper-position,.resume-template-creative .resume-paper-contact{color:#fff}.resume-template-creative .resume-paper-photo{border:3px solid #ffffffbd;border-radius:50%}.resume-template-minimal .resume-paper-header{border:0}.resume-template-minimal .resume-paper-section h2{border:0;border-left:3px solid ${state.accent};padding-left:9px}@page{size:A4;margin:0}@media print{body{padding:0;background:#fff}.resume-paper{margin:0;box-shadow:none;print-color-adjust:exact;-webkit-print-color-adjust:exact}}@media(max-width:760px){body{padding:0}.resume-paper{width:100%;min-height:0;padding:24px}.resume-paper-body,.resume-template-creative .resume-paper-body{grid-template-columns:1fr}}
    </style><style>.resume-template-nordic .resume-paper-header{margin:-19mm -18mm 0;padding:19mm 18mm 22px;background:#e6f0ed;border:0}.resume-template-nordic .resume-paper-body{grid-template-columns:1fr 1fr;gap:34px}.resume-template-corporate .resume-paper-header{margin:-19mm -18mm 0;padding:19mm 18mm 22px;background:#214e73;color:#fff}.resume-template-corporate .resume-paper-kicker,.resume-template-corporate .resume-paper-position,.resume-template-corporate .resume-paper-contact,.resume-template-corporate .resume-paper-contact i{color:#fff}.resume-template-corporate .resume-paper-body aside{padding:15px;background:#edf3f7}.resume-template-compact{padding:13mm 14mm}.resume-template-compact .resume-paper-header{padding-bottom:11px}.resume-template-compact .resume-paper-body{gap:14px;padding-top:13px}.resume-template-compact .resume-paper-section{margin-bottom:13px}.resume-template-elegant .resume-paper-header{flex-direction:column;align-items:center;text-align:center}.resume-template-elegant .resume-paper-photo{width:86px;height:86px;border:2px solid ${state.accent};border-radius:50%}.resume-template-elegant .resume-paper-contact{justify-content:center}.resume-template-elegant .resume-paper-body{grid-template-columns:1fr}.resume-template-elegant .resume-paper-section h2{text-align:center;border:0}.resume-template-bold .resume-paper-header{margin:-19mm -18mm 0;padding:19mm 18mm 22px;background:#202c35;border-bottom:8px solid ${state.accent};color:#fff}.resume-template-bold .resume-paper-kicker,.resume-template-bold .resume-paper-position,.resume-template-bold .resume-paper-contact,.resume-template-bold .resume-paper-contact i{color:#fff}.resume-template-bold .resume-paper-body{grid-template-columns:minmax(0,1.4fr) minmax(145px,.8fr)}.resume-template-bold .resume-paper-body aside{padding:14px;background:#f2f3f2}@media print{.resume-template-nordic .resume-paper-header,.resume-template-corporate .resume-paper-header,.resume-template-bold .resume-paper-header{margin:-19mm -18mm 0;padding:19mm 18mm 22px}}</style><style>.resume-letter-paper{font-size:${Number(state.fontSize)||13}px}.resume-letter-sender{display:flex;justify-content:space-between;gap:24px;padding-bottom:20px;border-bottom:2px solid ${state.accent}}.resume-letter-sender h1{margin:0 0 4px;font-size:23px}.resume-letter-sender p{margin:0;color:${state.accent};font-weight:700}.resume-letter-contact{display:grid;justify-items:end;gap:5px;font:10px/1.5 Arial,sans-serif}.resume-letter-contact>span{display:flex;gap:5px}.resume-letter-contact i{color:${state.accent}}.resume-letter-body{padding-top:25px;line-height:1.75}.resume-letter-body p{margin:0 0 13px}.resume-letter-date{text-align:right;margin-bottom:24px!important}.resume-letter-recipient{margin:0 0 20px}.resume-letter-recipient p{margin:0 0 3px}.resume-letter-subject{margin-bottom:18px!important}.resume-letter-content{min-height:100px;white-space:pre-line}.resume-letter-signature{margin-top:22px}.resume-letter-signature-space{height:48px}.resume-template-letter-modern .resume-letter-sender{border-left:6px solid ${state.accent};padding:6px 0 18px 16px}.resume-template-letter-corporate .resume-letter-sender{margin:-19mm -18mm 0;padding:19mm 18mm 20px;background:#214e73;color:#fff}.resume-template-letter-corporate .resume-letter-sender p,.resume-template-letter-corporate .resume-letter-contact i{color:#fff}.resume-template-letter-elegant .resume-letter-sender{display:block;text-align:center}.resume-template-letter-elegant .resume-letter-contact{display:flex;justify-content:center;flex-wrap:wrap;margin-top:10px}.resume-template-letter-minimal .resume-letter-sender{border:0}.resume-template-letter-minimal .resume-letter-body{border-top:1px solid #d7dcda;padding-top:20px}@media print{.resume-template-letter-corporate .resume-letter-sender{margin:-19mm -18mm 0;padding:19mm 18mm 20px}}</style></head><body>${paper.outerHTML}</body></html>`;
  const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=`${filename}-${documentLabel}.html`;document.body.append(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
  toast(`${state.documentMode==='cover-letter'?'Surat lamaran':'Resume'} berhasil diunduh. Gunakan Cetak / Simpan PDF untuk versi PDF.`);
}
function setResumeStudioLoading(active,label='Memproses dokumen...') {
  const loader=$('#resumeStudioLoading');
  if(!loader)return;
  $('#resumeStudioLoadingLabel').textContent=label;
  loader.hidden=!active;
  loader.setAttribute('aria-busy',String(active));
}
async function renderCandidateResumeStudio() {
  if(!getCurrentCandidateProfile()&&supabaseClient&&isCandidateSession()) {
    setResumeStudioLoading(true,'Memuat profil kandidat...');
    try {await loadOwnCandidateProfile();}
    finally {setResumeStudioLoading(false);}
  }
  const profile=getCurrentCandidateProfile();
  const controls=$('#resumeStudioControls');
  if(!profile) {
    controls.innerHTML='<div class="empty-state"><strong>Profil kandidat belum tersedia</strong>Lengkapi profil terlebih dahulu untuk mengisi resume.<br><button class="btn btn-small" type="button" data-route="candidate-create-profile">Lengkapi profil</button></div>';
    $('#resumeStudioPreview').innerHTML='';
    return;
  }
  const state=readResumeStudioState(profile);
  const letterMode=state.documentMode==='cover-letter';
  $('#resumeStudioTitle').textContent=letterMode?'Studio Surat Lamaran':'Studio Resume';
  $('#resumeStudioDescription').textContent=letterMode?'Pilih desain surat formal, sesuaikan perusahaan dan posisi, lalu edit langsung pada kertas.':'Atur tampilan, foto, dan isi resume. Perubahan tersimpan otomatis di perangkat ini.';
  $('#resumeDocumentModeControl').querySelectorAll('[data-resume-mode]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.resumeMode===state.documentMode)));
  const templates=letterMode
    ?[['letter-classic','Surat Klasik'],['letter-modern','Surat Modern'],['letter-corporate','Surat Korporat'],['letter-elegant','Surat Elegan'],['letter-minimal','Surat Minimal']]
    :[['executive','Executive'],['editorial','Editorial'],['modern','Modern'],['creative','Creative'],['minimal','Minimal'],['nordic','Nordic'],['corporate','Corporate'],['compact','Compact'],['elegant','Elegant'],['bold','Bold']];
  const listControl=(field,value)=>`<label class="resume-list-control">List<select data-resume-field="${field}ListStyle"><option value="bullet" ${value==='bullet'?'selected':''}>• Titik</option><option value="check" ${value==='check'?'selected':''}>✓ Centang</option><option value="plain" ${value==='plain'?'selected':''}>Tanpa simbol</option></select></label>`;
  const certificateUploads=Array.isArray(state.certificateUploads)?state.certificateUploads:[];
  const extraSections=Array.isArray(state.extraSections)?state.extraSections:[];
  const educationLevels=['Tidak bersekolah','SD','SMP','SMA','SMK','D1','D2','D3','D4','S1','S2','S3','Profesi','Lainnya'];
  if(letterMode) {
    controls.innerHTML=`<div class="resume-control-group"><h2>Template surat lamaran</h2><div class="resume-template-picker" role="group" aria-label="Pilih template surat lamaran">${templates.map(([value,label])=>`<button type="button" data-resume-template="${value}" aria-pressed="${state.template===value}"><span class="resume-template-swatch resume-swatch-${value}" aria-hidden="true"></span>${label}</button>`).join('')}</div></div>
      <div class="resume-control-group"><h2>Identitas pengirim</h2><label>Nama<input data-resume-field="fullName" value="${escapeHtml(state.fullName)}" maxlength="120"></label><label>Posisi dilamar<input data-resume-field="position" value="${escapeHtml(state.position)}" maxlength="120"></label><label>Lokasi<input data-resume-field="location" value="${escapeHtml(state.location)}" maxlength="120"></label><label>Email<input data-resume-field="email" value="${escapeHtml(state.email)}" maxlength="254"></label><label>Telepon<input data-resume-field="phone" value="${escapeHtml(state.phone)}" maxlength="40"></label></div>
      <div class="resume-control-group"><h2>Tujuan surat</h2><label>Tanggal<input data-resume-field="letterDate" value="${escapeHtml(state.letterDate)}"></label><label>Kepada<input data-resume-field="letterRecipient" value="${escapeHtml(state.letterRecipient)}" maxlength="120"></label><label>Perusahaan<input data-resume-field="letterCompany" value="${escapeHtml(state.letterCompany)}" maxlength="160"></label><label>Alamat perusahaan<input data-resume-field="letterCompanyAddress" value="${escapeHtml(state.letterCompanyAddress)}" maxlength="240"></label><label>Perihal<input data-resume-field="letterSubject" value="${escapeHtml(state.letterSubject)}" maxlength="160"></label></div>
      <div class="resume-control-group"><h2>Isi surat</h2><label>Pembuka<textarea data-resume-field="letterOpening" rows="2" maxlength="500">${escapeHtml(state.letterOpening)}</textarea></label><label>Isi dan alasan melamar<textarea data-resume-field="letterBody" rows="9" maxlength="3500">${escapeHtml(state.letterBody)}</textarea></label><label>Penutup<textarea data-resume-field="letterClosing" rows="4" maxlength="1200">${escapeHtml(state.letterClosing)}</textarea></label><label>Salam penutup<input data-resume-field="letterSignoff" value="${escapeHtml(state.letterSignoff)}" maxlength="80"></label><label>Nama tanda tangan<input data-resume-field="letterSignature" value="${escapeHtml(state.letterSignature||state.fullName)}" maxlength="120"></label></div>`;
    renderResumeStudioPreview(state);return;
  }
  controls.innerHTML=`<div class="resume-control-group"><h2>Template</h2><div class="resume-template-picker" role="group" aria-label="Pilih template resume">${templates.map(([value,label])=>`<button type="button" data-resume-template="${value}" aria-pressed="${state.template===value}"><span class="resume-template-swatch resume-swatch-${value}" aria-hidden="true"></span>${label}</button>`).join('')}</div></div>
    <div class="resume-control-group"><h2>Gaya</h2><div class="resume-control-grid"><label>Font<select data-resume-field="font"><option value="georgia" ${state.font==='georgia'?'selected':''}>Georgia</option><option value="garamond" ${state.font==='garamond'?'selected':''}>Garamond</option><option value="trebuchet" ${state.font==='trebuchet'?'selected':''}>Trebuchet MS</option><option value="verdana" ${state.font==='verdana'?'selected':''}>Verdana</option><option value="system" ${state.font==='system'?'selected':''}>Sans Serif</option></select></label><label>Ukuran teks <input type="range" min="11" max="18" value="${Number(state.fontSize)||13}" data-resume-field="fontSize"></label></div><label class="resume-color-label">Warna aksen <input type="color" value="${state.accent}" data-resume-field="accent"></label></div>
    <div class="resume-control-group"><h2>Foto profil</h2><label class="resume-photo-upload"><i class="fa-regular fa-image" aria-hidden="true"></i> Pilih foto<input type="file" id="resumeStudioPhoto" accept="image/jpeg,image/png,image/webp"></label><small class="form-note">JPG, PNG, atau WEBP. Maksimal 5 MB.</small></div>
    <div class="resume-control-group"><h2>Profil profesional</h2><label>Nama<input data-resume-field="fullName" value="${escapeHtml(state.fullName)}" maxlength="120"></label><label>Posisi<input data-resume-field="position" value="${escapeHtml(state.position)}" maxlength="120"></label><label>Lokasi<input data-resume-field="location" value="${escapeHtml(state.location)}" maxlength="120"></label><label>Email<input data-resume-field="email" value="${escapeHtml(state.email)}" maxlength="254"></label><label>Telepon<input data-resume-field="phone" value="${escapeHtml(state.phone)}" maxlength="40"></label><label>Ringkasan<textarea data-resume-field="summary" rows="4" maxlength="2000">${escapeHtml(state.summary)}</textarea></label>${listControl('summary',state.summaryListStyle)}</div>
    <div class="resume-control-group"><h2>Keahlian</h2><label>Keahlian <small>Pisahkan dengan koma atau baris baru</small><textarea data-resume-field="skills" rows="4">${escapeHtml(state.skills)}</textarea></label>${listControl('skills',state.skillsListStyle)}</div>
    <div class="resume-control-group"><h2>Pengalaman</h2><label>Posisi, perusahaan, periode, pencapaian <small>Satu poin per baris</small><textarea data-resume-field="experience" rows="6">${escapeHtml(state.experience)}</textarea></label>${listControl('experience',state.experienceListStyle)}</div>
    <div class="resume-control-group"><h2>Pendidikan</h2><div class="resume-education-builder"><label>Jenjang<select data-resume-field="educationLevel"><option value="">Pilih jenjang</option>${educationLevels.map(level=>`<option value="${level}" ${state.educationLevel===level?'selected':''}>${level}</option>`).join('')}</select></label><label>Sekolah / universitas<input data-resume-field="educationSchool" value="${escapeHtml(state.educationSchool||'')}" maxlength="150"></label><label>Jurusan<input data-resume-field="educationMajor" value="${escapeHtml(state.educationMajor||'')}" maxlength="120"></label><div class="resume-education-years"><label>Tahun masuk<input data-resume-field="educationStart" value="${escapeHtml(state.educationStart||'')}" inputmode="numeric" maxlength="4"></label><label>Tahun lulus<input data-resume-field="educationEnd" value="${escapeHtml(state.educationEnd||'')}" inputmode="numeric" maxlength="4"></label></div><button class="btn btn-outline btn-small" type="button" data-resume-add-education><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah pendidikan</button></div><label>Daftar pendidikan<textarea data-resume-field="education" rows="4">${escapeHtml(state.education)}</textarea></label>${listControl('education',state.educationListStyle)}</div>
    <div class="resume-control-group"><h2>Sertifikasi</h2><label>Nama sertifikat / penerbit<textarea data-resume-field="certificates" rows="3">${escapeHtml(state.certificates)}</textarea></label>${listControl('certificates',state.certificatesListStyle)}<label class="resume-photo-upload"><i class="fa-solid fa-file-arrow-up" aria-hidden="true"></i> Upload sertifikat<input type="file" id="resumeCertificateFiles" accept="application/pdf,image/jpeg,image/png,image/webp" multiple></label><small class="form-note">PDF, JPG, PNG, atau WEBP. Maksimal 5 MB per file.</small><div class="resume-uploaded-certificates" id="resumeCertificateUploadList">${resumeStudioCertificateRows(certificateUploads)}</div></div>
    <div class="resume-control-group"><h2>Portfolio</h2><label>Proyek atau tautan<textarea data-resume-field="portfolio" rows="3">${escapeHtml(state.portfolio)}</textarea></label>${listControl('portfolio',state.portfolioListStyle)}</div>
    <div class="resume-control-group"><h2>Tambah bagian / kolom</h2><label>Nama bagian<input id="resumeNewSectionTitle" maxlength="60" placeholder="Contoh: Organisasi"></label><label>Isi bagian<textarea id="resumeNewSectionContent" rows="3" placeholder="Ketik isi bagian baru"></textarea></label><div class="resume-control-grid"><label>Letak kolom<select id="resumeNewSectionColumn"><option value="left">Kolom kiri</option><option value="right">Kolom kanan</option></select></label><label>Penanda<select id="resumeNewSectionListStyle"><option value="bullet">• Titik</option><option value="check">✓ Centang</option><option value="plain">Tanpa simbol</option></select></label></div><button class="btn btn-small" type="button" data-resume-add-section><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah ke layout</button>${extraSections.length?`<div class="resume-extra-section-list">${extraSections.map(item=>`<div><span>${escapeHtml(item.title)}</span><select data-resume-section-column="${escapeHtml(item.id)}" aria-label="Posisi ${escapeHtml(item.title)}"><option value="left" ${item.column==='left'?'selected':''}>Kiri</option><option value="right" ${item.column!=='left'?'selected':''}>Kanan</option></select><button type="button" data-resume-remove-section="${escapeHtml(item.id)}" aria-label="Hapus bagian ${escapeHtml(item.title)}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button></div>`).join('')}</div>`:''}</div>`;
  renderResumeStudioPreview(state);
}
function renderCandidateInlineCard(profile) {
  const rawData=profile.publicData||profile.public_data||{};
  const data={
    ...rawData,
    education:candidateArray(rawData.education).filter(item=>item&&typeof item==='object'),
    experience:candidateArray(rawData.experience).filter(item=>item&&typeof item==='object'),
    skills:Array.isArray(profile.skills)?profile.skills:candidateArray(rawData.skills),
    languages:candidateArray(rawData.languages).filter(item=>item&&typeof item==='object'),
    certificates:candidateArray(rawData.certificates).filter(item=>item&&typeof item==='object'),
    portfolio:candidateArray(rawData.portfolio).filter(item=>item&&typeof item==='object'),
    socialLinks:candidateArray(rawData.socialLinks).filter(item=>item&&typeof item==='object'),
    portfolioFiles:candidateArray(rawData.portfolioFiles).filter(item=>item&&typeof item==='object'),
    certificateFiles:candidateArray(rawData.certificateFiles).filter(item=>item&&typeof item==='object'),
    jobTypes:candidateArray(rawData.jobTypes),
    preferences:rawData.preferences&&typeof rawData.preferences==='object'?rawData.preferences:{}
  };
  profile={...profile,skills:data.skills};
  const candidateLocation=String(profile.location||'');
  if(candidateLocation&&candidateLocation===candidateLocation.toLocaleUpperCase('id-ID')) {
    profile={...profile,location:candidateLocation.toLocaleLowerCase('id-ID').replace(/(^|\s)\p{L}/gu,letter=>letter.toLocaleUpperCase('id-ID'))};
  }
  const category=profile.category||(typeof candidateFrontendCategory==='function'?candidateFrontendCategory(profile):'');
  const photo=candidateSafeImageUrl(profile.profile_image_url||data.profileImageUrl);
  const coverPhoto=candidateSafeImageUrl(profile.cover_image_url||data.coverImageUrl||data.cover_image_url||data.spotlight?.coverUrl);
  const cvUrl='';
  const education=candidateArray(data.education).filter(item=>item&&typeof item==='object');
  const experience=candidateArray(data.experience).filter(item=>item&&typeof item==='object');
  const skills=Array.isArray(profile.skills)?profile.skills:candidateArray(data.skills);
  const contact=candidateSharedContact(data);
  const contactLinks=[contact.email?`<a href="mailto:${encodeURIComponent(contact.email)}">Email</a>`:'',contact.whatsapp?`<a href="https://wa.me/${String(contact.whatsapp).replace(/\D/g,'')}" target="_blank" rel="noopener">WhatsApp</a>`:''].filter(Boolean).join('');
  const whatsappDigits=String(contact.whatsapp||'').replace(/\D/g,'');
  const contactSummary=contact.email||whatsappDigits?`<div class="candidate-feed-contact">${whatsappDigits?`<a href="https://wa.me/${whatsappDigits}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i><span>${escapeHtml(contact.whatsapp)}</span></a>`:''}${contact.email?`<a href="mailto:${encodeURIComponent(contact.email)}"><i class="fa-regular fa-envelope" aria-hidden="true"></i><span>${escapeHtml(contact.email)}</span></a>`:''}</div>`:'<p class="candidate-feed-contact-private"><i class="fa-solid fa-lock" aria-hidden="true"></i> Kontak belum dibagikan</p>';
  const salaryMinValue=Number(profile.salary_min);
  const salaryMaxValue=Number(profile.salary_max);
  const salaryMin=Number.isFinite(salaryMinValue)&&salaryMinValue>=100000?salaryMinValue:0;
  const salaryMax=Number.isFinite(salaryMaxValue)&&salaryMaxValue>=100000?salaryMaxValue:0;
  const formatCandidateSalary=value=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
  const salarySummary=`<p class="candidate-feed-salary"><i class="fa-solid fa-money-bill-wave" aria-hidden="true"></i><span><strong>Ekspektasi gaji</strong>${salaryMin&&salaryMax?`${formatCandidateSalary(salaryMin)} – ${formatCandidateSalary(salaryMax)}`:salaryMin?`Mulai ${formatCandidateSalary(salaryMin)}`:salaryMax?`Maks. ${formatCandidateSalary(salaryMax)}`:'Belum dicantumkan'}</span></p>`;
  const jobTypes=candidateArray(data.jobTypes?.length?data.jobTypes:profile.job_types).filter(Boolean);
  const links=[...candidateArray(data.portfolio),...candidateArray(data.socialLinks)].map(item=>{
    const url=candidateSafeHttpUrl(item.url);
    return url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.label||'Portfolio')}</a>`:'';
  }).filter(Boolean).join('');
  const portfolioFiles=candidateArray(data.portfolioFiles).map(item=>{
    const url=candidateSafeHttpUrl(item.url);
    if(!url)return '';
    if(/\.(mp4)$/i.test(item.name||''))return `<video controls preload="metadata" src="${escapeHtml(url)}" aria-label="${escapeHtml(item.name||'Video portfolio')}"></video>`;
    if(/\.(jpe?g|png|webp)$/i.test(item.name||''))return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener"><img class="candidate-feed-media" src="${escapeHtml(url)}" alt="${escapeHtml(item.name||'Foto portfolio')}" loading="lazy"></a>`;
    return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.name||'Lihat portfolio')}</a>`;
  }).filter(Boolean).join('');
  const certificateFiles=candidateArray(data.certificateFiles).map(item=>{
    const url=candidateSafeHttpUrl(item.url);
    return url?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.name||'Lihat sertifikat')}</a>`:'';
  }).filter(Boolean).join('');
  const preferences=[...jobTypes,...candidateArray(data.preferences?.workHours),...candidateArray(data.preferences?.workModes)];
  const profileButton=profile.username?`<button class="candidate-profile-open" type="button" data-candidate-profile="${escapeHtml(profile.username)}"><i class="fa-regular fa-message" aria-hidden="true"></i> Lihat Profil <i class="fa-solid fa-chevron-right" aria-hidden="true"></i></button>`:'';
  const nationality=String(data.nationality||profile.nationality||'').trim();
  const nationalityMark=nationality.toLocaleLowerCase('id-ID')==='indonesia'?'<span class="candidate-feed-flag" aria-hidden="true"></span>':'<i class="fa-solid fa-flag" aria-hidden="true"></i>';
  const salaryText=salaryMin&&salaryMax?`${formatCandidateSalary(salaryMin)} – ${formatCandidateSalary(salaryMax)}`:salaryMin?`Mulai ${formatCandidateSalary(salaryMin)}`:salaryMax?`Maks. ${formatCandidateSalary(salaryMax)}`:'Belum dicantumkan';
  const verifiedBadge=profile.verified_candidate?'<span class="candidate-feed-verified"><i class="fa-solid fa-circle-check" aria-hidden="true"></i> Terverifikasi</span>':'';
  const isOpenToWork=String(data.workStatus||profile.work_status||'').trim().toLocaleLowerCase('id-ID')==='open to work';
  const availabilityIndicator=isOpenToWork?'<span class="candidate-feed-availability-dot" role="img" aria-label="Terbuka untuk peluang kerja"></span>':'';
  const isOwnCandidateProfile=Boolean(isCandidateSession()&&(profile.user_id===supabaseSession?.user?.id||profile.userId===supabaseSession?.user?.id));
  const canManageCandidateProfile=typeof canManageCandidates==='function'&&canManageCandidates();
  const hrdActions=canManageCandidateProfile?`<div class="candidate-detail-hrd-actions" aria-label="Aksi HRD"><button class="btn" type="button" data-candidate-invite-chat="${escapeHtml(profile.id)}"><i class="fa-regular fa-paper-plane" aria-hidden="true"></i> Undang chat</button><button class="btn btn-outline" type="button" data-bookmark-candidate="${escapeHtml(profile.id)}"><i class="fa-regular fa-bookmark" aria-hidden="true"></i> Simpan kandidat</button><button class="btn btn-outline" type="button" data-talent-candidate="${escapeHtml(profile.id)}"><i class="fa-solid fa-users" aria-hidden="true"></i> Talent Pool</button><button class="btn btn-outline" type="button" data-candidate-rank="${escapeHtml(profile.id)}"><i class="fa-solid fa-star" aria-hidden="true"></i> Beri peringkat</button></div>`:!isOwnCandidateProfile?`<div class="candidate-detail-hrd-actions" aria-label="Hubungi kandidat"><button class="btn" type="button" data-chat-candidate="${escapeHtml(profile.id)}"><i class="fa-regular fa-comments" aria-hidden="true"></i> Chat kandidat</button></div>`:'';
  const opportunityDetails=`<section class="candidate-detail-opportunity" aria-label="Informasi kandidat"><div><i class="fa-solid fa-briefcase" aria-hidden="true"></i><span><small>Posisi yang dicari</small><strong>${escapeHtml(profile.main_position||'Belum dicantumkan')}</strong></span></div><div><i class="fa-solid fa-location-dot" aria-hidden="true"></i><span><small>Lokasi</small><strong>${escapeHtml(profile.location||'Belum dicantumkan')}</strong></span></div><div><i class="fa-solid fa-wallet" aria-hidden="true"></i><span><small>Ekspektasi gaji</small><strong>${escapeHtml(salaryText)}</strong></span></div></section>`;
  const details=`<section><h4>Tentang saya</h4><p>${escapeHtml(profile.about||'Belum ada deskripsi.')}</p></section><section><h4>Keahlian</h4><div class="skill-list">${(profile.skills||data.skills||[]).map(skill=>`<span>${escapeHtml(skill)}</span>`).join('')||'<span>Belum dicantumkan</span>'}</div></section><div class="candidate-feed-details"><section><h4>Pendidikan</h4>${education.map(item=>`<p><strong>${escapeHtml(item.level||'')}</strong>${item.school?` · ${escapeHtml(item.school)}`:''}${item.major?` · ${escapeHtml(item.major)}`:''}</p>`).join('')||`<p>${escapeHtml(profile.education_level||'Belum dicantumkan')}</p>`}</section><section><h4>Pengalaman kerja</h4>${experience.map(item=>`<p><strong>${escapeHtml(item.position||'')}</strong>${item.company?` · ${escapeHtml(item.company)}`:''}${item.location?` · ${escapeHtml(item.location)}`:''}${item.description?`<br>${escapeHtml(item.description)}`:''}</p>`).join('')||'<p>Belum dicantumkan</p>'}</section></div>${data.languages?.length?`<section><h4>Bahasa</h4><p>${data.languages.map(item=>`${escapeHtml(item.language||'')} · ${escapeHtml(item.level||'')}`).join(' · ')}</p></section>`:''}${data.certificates?.length?`<section><h4>Sertifikat</h4><p>${data.certificates.map(item=>escapeHtml(item.name||item.issuer||'Sertifikat')).join(' · ')}</p></section>`:''}${certificateFiles?`<section><h4>Berkas sertifikat</h4><div class="candidate-feed-links">${certificateFiles}</div></section>`:''}${preferences.length?`<section><h4>Preferensi kerja</h4><p>${preferences.map(escapeHtml).join(' · ')}</p></section>`:''}${links||portfolioFiles?`<section><h4>Portfolio dan tautan</h4><div class="candidate-feed-links">${links}${portfolioFiles}</div></section>`:''}${contactLinks?`<section><h4>Kontak yang dibagikan</h4><div class="candidate-feed-links">${contactLinks}</div></section>`:''}`;
  return `<article class="candidate-feed-card" ${profile.username?`data-open-candidate="${escapeHtml(profile.username)}" tabindex="0" aria-label="Buka detail profil ${escapeHtml(profile.full_name||'kandidat')}; ${escapeHtml(profile.main_position||'posisi kandidat')}"`:''} data-cover-image="${escapeHtml(coverPhoto)}"><header class="candidate-feed-head">${photo?`<span class="candidate-feed-avatar"><img class="candidate-feed-photo" src="${escapeHtml(photo)}" alt="Foto ${escapeHtml(profile.full_name||'kandidat')}" loading="eager">${availabilityIndicator}</span>`:`<span class="candidate-feed-avatar"><span class="candidate-feed-photo candidate-placeholder" aria-hidden="true"><i class="fa-solid fa-user"></i></span>${availabilityIndicator}</span>`}<div class="candidate-feed-summary"><span class="candidate-feed-position-pill"><i class="fa-solid fa-code" aria-hidden="true"></i>${escapeHtml(profile.main_position||'Posisi belum dicantumkan')}</span><div class="candidate-feed-name-line"><h3>${escapeHtml(profile.full_name||'Kandidat')}</h3>${verifiedBadge}</div><p class="candidate-feed-about">${escapeHtml(profile.about||'Ringkasan profil belum ditambahkan.')}</p><div class="candidate-feed-badges">${jobTypes.slice(0,2).map(type=>`<span class="candidate-work-type"><i class="fa-regular fa-clock" aria-hidden="true"></i>${escapeHtml(type)}</span>`).join('')}${nationality?`<span class="candidate-feed-nationality">${nationalityMark}${escapeHtml(nationality)}</span>`:''}</div></div></header><span class="candidate-feed-divider" aria-hidden="true"></span><section class="candidate-feed-facts" aria-label="Informasi kandidat"><div class="candidate-feed-fact"><i class="fa-solid fa-location-dot" aria-hidden="true"></i><div><span class="candidate-feed-fact-label">Lokasi</span><strong class="candidate-feed-location-value">${escapeHtml(profile.location||'Belum dicantumkan')}</strong></div></div><div class="candidate-feed-fact"><i class="fa-solid fa-briefcase" aria-hidden="true"></i><div><span class="candidate-feed-fact-label">Ekspektasi Gaji</span><strong>${escapeHtml(salaryText)}</strong></div></div></section><div class="candidate-feed-action"><div class="candidate-feed-illustration" aria-hidden="true"><span class="candidate-feed-laptop"><i class="fa-solid fa-laptop-code"></i></span><span class="candidate-feed-code-mark"><i class="fa-solid fa-code"></i></span></div>${profileButton}</div><template class="candidate-feed-detail-template">${opportunityDetails}${hrdActions}<div class="candidate-feed-body">${details}</div></template></article>`;
}
let activeCandidateCard=null;
function openCandidateFeedDetail(card) {
  const backdrop=$('#candidateDetailBackdrop');
  const drawer=$('#candidateDetailDrawer');
  const content=$('#candidateDetailDrawerContent');
  const title=$('#candidateDetailDrawerTitle');
  const template=card?.querySelector('.candidate-feed-detail-template');
  const head=card?.querySelector('.candidate-feed-head');
  if(!backdrop||!drawer||!content||!template||!head)return;
  activeCandidateCard=card;
  const cover=document.createElement('div');
  cover.className='candidate-detail-cover';
  if(card.dataset.coverImage) {
    const image=document.createElement('img');
    image.src=card.dataset.coverImage;
    image.alt=`Foto sampul ${card.querySelector('.candidate-feed-summary h3')?.textContent||'kandidat'}`;
    cover.append(image);
  }
  const detailHead=head.cloneNode(true);
  detailHead.querySelector('.candidate-feed-about')?.remove();
  const detailContent=template.content.cloneNode(true);
  const opportunity=detailContent.querySelector('.candidate-detail-opportunity');
  const overview=document.createElement('div');
  overview.className='candidate-detail-overview';
  overview.append(detailHead);
  if(opportunity)overview.append(opportunity);
  content.replaceChildren(cover,overview,detailContent);
  if(title)title.textContent=card.querySelector('.candidate-feed-summary h3')?.textContent||'Detail kandidat';
  backdrop.hidden=false;
  document.body.classList.add('candidate-detail-open');
  drawer.focus({preventScroll:true});
}
function closeCandidateFeedDetail() {
  const backdrop=$('#candidateDetailBackdrop');
  if(!backdrop||backdrop.hidden)return;
  backdrop.hidden=true;
  document.body.classList.remove('candidate-detail-open');
  $('#candidateDetailDrawerContent')?.replaceChildren();
  if(activeCandidateCard?.isConnected)activeCandidateCard.focus({preventScroll:true});
  activeCandidateCard=null;
}
async function inviteCandidateProfileToChat(postId) {
  if(!supabaseClient||!isHrdSession()||!canManageCandidates()) {
    toast('Masuk sebagai HRD untuk mengirim ajakan kepada kandidat.');
    if(!supabaseSession)openAuthModal(false);
    return;
  }
  const profile=candidateSearchCache.find(item=>item.id===postId)||candidateProfilesCache.find(item=>item.id===postId)||await getPublicProfileById(postId);
  if(!profile)throw new Error('Profil kandidat tidak ditemukan.');
  openModal(`Undang ${profile.full_name} untuk chat`,`<form><p class="form-note">Pesan ini akan masuk ke inbox Spotlight kandidat. Cantumkan detail perusahaan dan jalur balasan yang dapat dihubungi.</p><div class="form-row"><label for="candidateChatInviteMessage">Pesan undangan</label><textarea id="candidateChatInviteMessage" name="message" rows="5" maxlength="1500" required placeholder="Halo, kami tertarik dengan profil Anda dan ingin berdiskusi tentang peluang kerja..."></textarea></div><button class="btn" type="submit"><i class="fa-regular fa-paper-plane" aria-hidden="true"></i> Kirim undangan chat</button></form>`,async data=>{
    const message=String(data.get('message')||'').trim();
    if(!message)return toast('Tulis pesan undangan untuk kandidat.');
    const companyName=currentCompanyProfile()?.company_name||supabaseSession.user.user_metadata?.company_name||supabaseSession.user.email;
    const {error}=await supabaseClient.from('candidate_post_contacts').insert({candidate_post_id:postId,company_user_id:supabaseSession.user.id,company_name:companyName,message});
    if(error)throw error;
    closeModal();
    toast('Undangan chat terkirim ke inbox Spotlight kandidat.');
  });
}
async function rateCandidatePrivately(postId) {
  if(!supabaseClient||!isHrdSession()||!canManageCandidates()) {
    toast('Masuk sebagai HRD untuk memberi peringkat privat.');
    if(!supabaseSession)openAuthModal(false);
    return;
  }
  const profile=candidateSearchCache.find(item=>item.id===postId)||candidateProfilesCache.find(item=>item.id===postId)||await getPublicProfileById(postId);
  if(!profile)throw new Error('Profil kandidat tidak ditemukan.');
  const companyId=billingCompanyId();
  const {data:existing,error}=await supabaseClient.from('candidate_company_ratings').select('rating,note').eq('candidate_post_id',postId).eq('company_id',companyId).maybeSingle();
  if(error)throw new Error(`${error.message||'Peringkat gagal dimuat.'} Pastikan migration supabase/candidate-company-ratings.sql sudah dijalankan.`);
  openModal(`Peringkat privat · ${profile.full_name}`,`<form><p class="form-note">Nilai ini hanya terlihat oleh HRD di perusahaan Anda, tidak tampil di profil publik kandidat.</p><fieldset class="candidate-rating-fieldset"><legend>Peringkat kandidat</legend><div class="candidate-rating-options" role="radiogroup" aria-label="Peringkat kandidat">${[1,2,3,4,5].map(rating=>`<label><input type="radio" name="rating" value="${rating}" ${Number(existing?.rating||0)===rating?'checked':''} required><span><i class="fa-solid fa-star" aria-hidden="true"></i> ${rating}</span></label>`).join('')}</div></fieldset><div class="form-row"><label for="candidatePrivateRatingNote">Catatan internal</label><textarea id="candidatePrivateRatingNote" name="note" rows="4" maxlength="1000" placeholder="Alasan penilaian atau catatan tindak lanjut">${escapeHtml(existing?.note||'')}</textarea></div><button class="btn" type="submit"><i class="fa-solid fa-floppy-disk" aria-hidden="true"></i> Simpan peringkat</button></form>`,async data=>{
    const rating=Number(data.get('rating'));
    if(!Number.isInteger(rating)||rating<1||rating>5)return toast('Pilih peringkat 1 sampai 5.');
    const {error:saveError}=await supabaseClient.from('candidate_company_ratings').upsert({candidate_post_id:postId,company_id:companyId,rating,note:String(data.get('note')||'').trim(),rated_by:supabaseSession.user.id,updated_at:new Date().toISOString()},{onConflict:'candidate_post_id,company_id'});
    if(saveError)throw new Error(`${saveError.message||'Peringkat tidak dapat disimpan.'} Pastikan migration supabase/candidate-company-ratings.sql sudah dijalankan.`);
    closeModal();
    toast('Peringkat kandidat tersimpan secara privat untuk perusahaan Anda.');
  });
}
$('#closeCandidateDetail').addEventListener('click',closeCandidateFeedDetail);
$('#candidateDetailBackdrop').addEventListener('click',event=>{
  if(event.target.id==='candidateDetailBackdrop')closeCandidateFeedDetail();
});
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!$('#candidateDetailBackdrop').hidden) {
    closeCandidateFeedDetail();
    return;
  }
  const card=event.target.closest?.('[data-open-candidate]');
  if(card&&(event.key==='Enter'||event.key===' ')&&!event.target.closest('a,button,input,textarea,select,video')) {
    event.preventDefault();
    openCandidateFeedDetail(card);
  }
});
function getCurrentCandidateProfile() {
  const ownerId=currentCandidateOwnerId();
  const local=getLocalCandidateProfiles().find(item=>item.userId===ownerId);
  const profile=local||currentCandidateProfile;
  return profile&&(profile.userId===ownerId||!supabaseClient)?profile:null;
}
function candidateProfileCompletionState(profile) {
  const data=profile?.publicData||profile?.public_data||{};
  const education=candidateArray(data.education).filter(item=>item&&typeof item==='object');
  const experience=candidateArray(data.experience).filter(item=>item&&typeof item==='object');
  const skills=Array.isArray(profile?.skills)?profile.skills:Array.isArray(data.skills)?data.skills:[];
  const checks=[
    {label:'Foto profil',complete:Boolean(profile?.profile_image_url||data.profileImageUrl)},
    {label:'Tentang saya',complete:Boolean(String(profile?.about||'').trim())},
    {label:'Pendidikan',complete:Boolean(profile?.education_level||education.some(item=>item.school||item.level))},
    {label:'Minimal 3 skill',complete:skills.length>=3},
    {label:'Pengalaman atau Fresh Graduate',complete:experience.some(item=>item.company&&item.position)||profile?.work_status==='Fresh Graduate'||data.workStatus==='Fresh Graduate'},
    {label:'CV',complete:Boolean(profile?.cvPath||profile?.privateData?.cv_path)}
  ];
  const completed=checks.filter(item=>item.complete).length;
  return {checks,completed,total:checks.length,percent:Math.round(completed/checks.length*100),complete:completed===checks.length};
}
function candidateWizardStrengthProfile() {
  const data=candidateWizardData;
  const education=(Array.isArray(data.education)?data.education:[]).filter(item=>item&&typeof item==='object');
  return {
    full_name:data.fullName||'',
    profile_image_url:data.photoData||'',
    cvPath:data.cvPath||'',
    main_position:data.mainPosition||'',
    location:[data.city,data.province].filter(Boolean).join(', '),
    about:data.about||'',
    skills:Array.isArray(data.skills)?data.skills:[],
    education_level:education.filter(item=>item.school).at(-1)?.level||'',
    work_status:data.workStatus||'',
    job_types:Array.isArray(data.jobTypes)?data.jobTypes:[],
    publicData:buildCandidatePublicData()
  };
}
function renderCandidateWizardStrength() {
  const container=$('#candidateWizardStrength');
  if(!container)return;
  const state=getCandidateProfileStrengthState(candidateWizardStrengthProfile());
  const stateClass=state.complete?'is-complete':'is-incomplete';
  container.className=`candidate-strength-panel ${stateClass}`;
  container.innerHTML=`<div class="candidate-strength-heading"><span>Kekuatan profil</span><strong>${state.percent}% ${state.complete?'Kuat':'Belum lengkap'}</strong></div><div class="candidate-strength-track"><span style="width:${state.percent}%"></span></div><ul>${state.checks.map(check=>`<li class="${check.complete?'is-complete':'is-incomplete'}"><i class="fa-solid ${check.complete?'fa-circle-check':'fa-circle-xmark'}" aria-hidden="true"></i>${escapeHtml(check.label)}</li>`).join('')}</ul>`;
}
async function getCandidateProfileCompletion() {
  let profile=getCurrentCandidateProfile();
  if(supabaseClient&&isCandidateSession()) {
    const {data,error}=await supabaseClient.from('candidate_posts')
      .select('id,user_id,username,full_name,main_position,category,location,job_types,salary_min,salary_max,profile_image_url,about,education_level,skills,work_status,experience_years,public_data,is_published')
      .eq('user_id',currentCandidateOwnerId()).maybeSingle();
    if(error)throw error;
    if(data) {
      const {data:privateRow,error:privateError}=await supabaseClient.from('candidate_post_private')
        .select('private_data').eq('user_id',currentCandidateOwnerId()).maybeSingle();
      if(privateError)throw privateError;
      let privateData=privateRow?.private_data||{};
      let cvPath=privateData.cv_path||'';
      if(!cvPath) {
        const {data:cvData,error:cvError}=await supabaseClient.functions.invoke('candidate-cv-access',{body:{candidatePostId:data.id}});
        if(!cvError&&cvData?.cvPath) {
          cvPath=cvData.cvPath;
          privateData={...privateData,cv_path:cvPath,cv_name:cvData.fileName||privateData.cv_name||''};
        }
      }
      profile={...data,userId:currentCandidateOwnerId(),publicData:data.public_data||{},privateData,cvPath,cvName:privateData.cv_name||''};
    } else profile=null;
    if(profile)currentCandidateProfile=profile;
  }
  return {profile,...candidateProfileCompletionState(profile)};
}
async function renderCandidateCompletionPanel() {
  const panel=$('#candidateCompletionPanel');
  if(!panel)return;
  if(!isCandidateSession()) {
    panel.hidden=true;
    return;
  }
  const state=await getCandidateProfileCompletion();
  panel.hidden=false;
  panel.innerHTML=`<div class="section-head"><div><span class="eyebrow">Profil pencari kerja</span><h2>Kelengkapan profil ${state.percent}%</h2><p>Lengkapi enam bagian ini sebelum melamar pekerjaan.</p></div><button class="btn btn-outline btn-small" type="button" data-route="candidate-create-profile">Lengkapi profil</button></div><div class="candidate-wizard-progress-track"><span style="width:${state.percent}%"></span></div><ul class="profile-completion-checklist">${state.checks.map(item=>`<li class="${item.complete?'complete':''}"><i class="fa-solid ${item.complete?'fa-circle-check':'fa-circle'}" aria-hidden="true"></i>${escapeHtml(item.label)}</li>`).join('')}</ul>${state.complete?'<p class="form-note">Profil siap digunakan untuk melamar pekerjaan.</p>':'<p class="form-note">Tombol lamaran akan aktif setelah seluruh bagian wajib selesai.</p>'}`;
}
function isCandidateProfilePublished() {
  return Boolean(getCurrentCandidateProfile()?.is_published);
}
function candidateInput(label,name,value='',type='text',options='') {
  const required=options.includes('required')?'required':'';
  const extra=options.replace('required','');
  const icon={'GitHub':'fa-brands fa-github','Website':'fa-solid fa-globe','Behance':'fa-brands fa-behance','Dribbble':'fa-brands fa-dribbble','LinkedIn':'fa-brands fa-linkedin','Instagram':'fa-brands fa-instagram','Facebook':'fa-brands fa-facebook','Website pribadi':'fa-solid fa-globe'}[label];
  return `<div class="form-row"><label for="candidate-${name}">${icon?`<i class="${icon}" aria-hidden="true"></i> `:''}${label}</label><input id="candidate-${name}" name="${name}" type="${type}" value="${escapeHtml(value||'')}" ${required} ${extra}></div>`;
}
function candidateSelect(label,name,values,value='') {
  return `<div class="form-row"><label for="candidate-${name}">${label}</label><select id="candidate-${name}" name="${name}"><option value="">Pilih ${escapeHtml(label.toLowerCase())}</option>${values.map(item=>`<option value="${escapeHtml(item)}" ${item===value?'selected':''}>${escapeHtml(item)}</option>`).join('')}</select></div>`;
}
const candidateCountries=['Indonesia','Afghanistan','Australia','Bangladesh','Brunei Darussalam','Filipina','India','Jepang','Jerman','Kanada','Malaysia','Singapura','Thailand','Timor-Leste','Tiongkok','United Kingdom','United States','Vietnam','Lainnya'];
function renderCandidateListRows(key,fields,emptyRow={}) {
  const rows=Array.isArray(candidateWizardData[key])&&candidateWizardData[key].length?candidateWizardData[key]:[emptyRow];
  return `<div class="candidate-repeat-list" data-list="${key}">${rows.map((row,index)=>`<article class="candidate-repeat-row" data-list-row="${key}"><div class="candidate-repeat-heading"><strong>${escapeHtml(key==='education'?'Pendidikan':key==='experience'?'Pengalaman kerja':key==='languages'?'Bahasa':key==='certificates'?'Sertifikat':'Item')} ${index+1}</strong><button class="text-link" data-remove-row type="button" aria-label="Hapus item">Hapus</button></div><div class="candidate-repeat-fields">${fields.map(field=>field.type==='select'?`<div class="form-row"><label>${escapeHtml(field.label)}</label><select data-field="${field.name}" ${field.required?'required':''}><option value="">Pilih</option>${field.options.map(option=>`<option ${row[field.name]===option?'selected':''}>${escapeHtml(option)}</option>`).join('')}</select></div>`:field.type==='textarea'?`<div class="form-row candidate-repeat-wide"><label>${escapeHtml(field.label)}</label><textarea data-field="${field.name}" data-bullet-list rows="${field.rows||8}" maxlength="${field.maxlength||8000}" placeholder="${escapeHtml(field.placeholder||'Tulis tanggung jawab dan pencapaian Anda. Tekan Enter untuk menambahkan poin berikutnya.')}">${escapeHtml(row[field.name]||'• ')}</textarea><small class="form-note">Gunakan satu poin untuk setiap tanggung jawab atau pencapaian. Tekan Enter untuk membuat poin baru.</small></div>`:`<div class="form-row"><label>${escapeHtml(field.label)}</label><input data-field="${field.name}" type="${field.type||'text'}" value="${escapeHtml(row[field.name]||'')}" ${field.required?'required':''}></div>`).join('')}</div></article>`).join('')}</div><button class="btn btn-outline btn-small" type="button" data-add-row="${key}"><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah</button>`;
}
function candidateWizardStepContent(step) {
  const d=candidateWizardData;
  if(step===0)return `<div class="candidate-step-intro"><h2>Foto profil <span class="form-note">(wajib untuk melamar)</span></h2><p>Tambahkan foto profil untuk menyelesaikan profil kandidat. Gunakan JPG/PNG maksimal 5 MB.</p></div><div class="candidate-photo-editor"><div class="candidate-photo-preview" id="candidatePhotoPreview">${d.photoData?`<img src="${d.photoData}" alt="Preview foto profil" style="transform:scale(${Number(d.photoZoom)||1})">`:'<i class="fa-solid fa-user" aria-hidden="true"></i><span>Belum ada foto</span>'}</div><label class="btn btn-outline btn-small" for="candidatePhotoFile">Pilih / ganti foto</label><input id="candidatePhotoFile" type="file" accept="image/jpeg,image/png,.jpg,.jpeg,.png"><label for="candidatePhotoZoom">Zoom foto</label><input id="candidatePhotoZoom" type="range" min="1" max="2.5" step=".05" value="${Number(d.photoZoom)||1}"><button class="text-link" type="button" data-remove-photo ${d.photoData?'':'disabled'}>Hapus foto</button></div>`;
  if(step===1)return `<div class="candidate-step-intro"><h2>Data pribadi</h2><p>Isi data kontak dan alamat. Detail alamat tetap privat dan hanya digunakan untuk proses rekrutmen.</p></div><div class="candidate-form-grid">${candidateInput('Nama lengkap','fullName',d.fullName,'text','required maxlength="120"')}${candidateInput('Nama panggilan','nickname',d.nickname)}${candidateSelect('Jenis kelamin','gender',['Laki-laki','Perempuan'],d.gender)}${candidateInput('Tanggal lahir','birthDate',d.birthDate,'date')}<div class="form-row"><label>Umur</label><output id="candidateAge">${candidateAge(d.birthDate)||'Otomatis dihitung'}</output></div>${candidateSelect('Status pernikahan','maritalStatus',['Belum Menikah','Menikah','Cerai Hidup','Cerai Mati'],d.maritalStatus)}${candidateSelect('Agama (opsional)','religion',['Islam','Kristen','Katolik','Hindu','Buddha','Konghucu','Kepercayaan Terhadap Tuhan Yang Maha Esa'],d.religion)}${candidateSelect('Kewarganegaraan','nationality',candidateCountries,d.nationality||'Indonesia')}${candidateSelect('Hak bekerja di Indonesia','workAuthorization',['Berhak bekerja di Indonesia','Memerlukan izin kerja / sponsor'],d.workAuthorization)}<div class="form-row" id="candidate-nationality-other-wrap" ${d.nationality==='Lainnya'?'':'hidden'}><label for="candidate-nationalityOther">Sebutkan kewarganegaraan</label><input id="candidate-nationalityOther" name="nationalityOther" value="${escapeHtml(d.nationalityOther||'')}" maxlength="80"></div>${candidateInput('Nomor WhatsApp','whatsapp',d.whatsapp,'tel','required maxlength="30"')}${candidateInput('Email','email',d.email||supabaseSession?.user?.email||'','email','required') }<div class="candidate-address-container" id="candidateAddressForm"></div>${candidateInput('Lokasi Google Maps (opsional)','mapsUrl',d.mapsUrl,'url')}${candidateSelect('Status saat ini','workStatus',['Open To Work','Sudah Bekerja','Freelance','Mahasiswa','Fresh Graduate'],d.workStatus||'Open To Work')}<label class="candidate-consent"><input name="shareContact" type="checkbox" ${d.shareContact?'checked':''}> Saya setuju menampilkan email dan WhatsApp pada profil publik.</label></div>`;
  if(step===2)return `<div class="candidate-step-intro"><h2>Posisi yang dicari</h2><p>Isi posisi dan pilih satu kategori agar profil hanya muncul pada bidang yang sesuai.</p></div><div class="candidate-form-grid">${candidateInput('Posisi utama','mainPosition',d.mainPosition,'text','required maxlength="120"')}${candidateInput('Posisi alternatif','alternativePosition',d.alternativePosition)}<div class="form-row"><label for="candidate-category">Kategori pekerjaan</label><select id="candidate-category" name="category" required><option value="">Pilih kategori</option>${categories.map(([name])=>`<option value="${escapeHtml(name)}" ${d.category===name?'selected':''}>${escapeHtml(name)}</option>`).join('')}</select></div>${candidateInput('Gaji minimum (Rp/bulan)','salaryMin',d.salaryMin,'number','min="0" step="1000"')}${candidateInput('Gaji maksimum (Rp/bulan)','salaryMax',d.salaryMax,'number','min="0" step="1000"')}${candidateSelect('Bersedia relokasi?','relocation',['Ya','Tidak'],d.relocation)}${candidateSelect('Bersedia perjalanan dinas?','businessTravel',['Ya','Tidak'],d.businessTravel)}<fieldset class="candidate-check-group"><legend>Jenis pekerjaan yang dicari</legend>${['Full Time','Part Time','Freelance','Contract','Internship','Remote'].map(type=>`<label><input type="checkbox" name="jobTypes" value="${type}" ${(d.jobTypes||[]).includes(type)?'checked':''}> ${type}</label>`).join('')}</fieldset></div>`;
  if(step===3)return `<div class="candidate-step-intro"><h2>Tentang saya <span class="form-note">(wajib)</span></h2><p>Tulis ringkasan 3–5 kalimat: bidang dan pengalaman, kekuatan utama, contoh hasil kerja, lalu posisi yang Anda tuju. Hindari mencantumkan data sensitif.</p></div><div class="form-row"><label for="candidate-about">Ringkasan profesional</label><textarea id="candidate-about" name="about" data-bullet-list required minlength="30" maxlength="2000" placeholder="Contoh: Staf administrasi dengan pengalaman mengelola dokumen dan jadwal harian. Terampil menggunakan Microsoft Excel dan menjaga ketelitian data. Pada pekerjaan terakhir, membantu mempercepat proses pengarsipan. Saya mencari posisi admin operasional.">${escapeHtml(d.about||'')}</textarea><small class="form-note"><span id="candidateAboutLength">${(d.about||'').length}</span> karakter · minimal 30 karakter</small></div>`;
  if(step===4)return `<div class="candidate-step-intro"><h2>Pendidikan <span class="form-note">(wajib)</span></h2><p>Tambahkan minimal satu riwayat pendidikan. Jenjang tidak harus perguruan tinggi.</p></div>${renderCandidateListRows('education',[{name:'level',label:'Jenjang',type:'select',options:['Tidak bersekolah','SD','SMP','SMA','SMK','D1','D2','D3','D4','S1','S2','S3','Lainnya'],required:true},{name:'school',label:'Nama sekolah / universitas',required:true},{name:'major',label:'Jurusan'},{name:'gpa',label:'IPK',type:'number'},{name:'startYear',label:'Tahun masuk',type:'number'},{name:'endYear',label:'Tahun lulus',type:'number'}],{})}<label class="candidate-consent"><input name="educationStillStudying" type="checkbox" ${d.educationStillStudying?'checked':''}> Masih belajar</label>`;
  if(step===5)return `<div class="candidate-step-intro"><h2>Pengalaman kerja</h2><p>Tambahkan minimal satu pengalaman, atau tandai status Fresh Graduate pada Data Pribadi. Jelaskan tugas, tanggung jawab, dan hasil kerja secara spesifik. Kolom deskripsi mendukung uraian panjang dan daftar berpoin.</p></div>${renderCandidateListRows('experience',[{name:'company',label:'Nama perusahaan'},{name:'position',label:'Posisi'},{name:'location',label:'Lokasi'},{name:'startDate',label:'Tanggal mulai',type:'date'},{name:'endDate',label:'Tanggal selesai',type:'date'},{name:'description',label:'Tanggung jawab dan pencapaian',type:'textarea',rows:9,maxlength:8000,placeholder:'• Jelaskan tanggung jawab utama Anda\n• Tuliskan hasil atau pencapaian yang terukur\n• Sebutkan alat, proses, atau keterampilan yang digunakan'}],{})}<label class="candidate-consent"><input name="currentlyWorking" type="checkbox" ${d.currentlyWorking?'checked':''}> Saya masih bekerja</label>`;
  if(step===6)return `<div class="candidate-step-intro"><h2>Skill <span class="form-note">(minimal 3)</span></h2><p>Tambahkan skill yang benar-benar Anda kuasai dan relevan dengan posisi yang dituju. Gunakan kata kunci yang biasa dipakai dalam lowongan agar HRD mudah menemukan profil Anda.</p></div><div class="candidate-tag-input"><input id="candidateSkillInput" placeholder="Contoh: Microsoft Excel, pelayanan pelanggan, pengelolaan stok"><button type="button" class="btn btn-outline btn-small" data-add-skill>Tambah skill</button></div><div class="candidate-tags">${(d.skills||[]).map(skill=>`<span>${escapeHtml(skill)} <button type="button" data-remove-skill="${escapeHtml(skill)}" aria-label="Hapus ${escapeHtml(skill)}">&times;</button></span>`).join('')||'<small class="form-note">Belum ada skill ditambahkan.</small>'}</div>`;
  if(step===7)return `<div class="candidate-step-intro"><h2>Bahasa</h2><p>Tambahkan bahasa dan tingkat kemahiran.</p></div>${renderCandidateListRows('languages',[{name:'language',label:'Bahasa'},{name:'level',label:'Level',type:'select',options:['Dasar','Menengah','Mahir','Native']}],{})}`;
  if(step===8)return `<div class="candidate-step-intro"><h2>Sertifikat</h2><p>Unggah sertifikat opsional dalam PDF, JPG, atau PNG. Maksimal 5 MB per berkas.</p></div>${renderCandidateListRows('certificates',[{name:'name',label:'Nama sertifikat'},{name:'issuer',label:'Penerbit'},{name:'date',label:'Tanggal',type:'date'}],{})}<div class="form-row"><label for="candidateCertificateFiles">Berkas sertifikat</label><input id="candidateCertificateFiles" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"></div>`;
  if(step===9)return `<div class="candidate-step-intro"><h2>Upload CV <span class="form-note">(wajib untuk melamar)</span></h2><p>Unggah CV dalam format PDF maksimal 5 MB. Anda juga dapat mengedit CV atau resume melalui Canva.</p></div><div class="form-row"><label for="candidateCvFile">CV PDF (maksimal 5 MB)</label><input id="candidateCvFile" type="file" accept="application/pdf,.pdf"><div class="candidate-file-status">${escapeHtml(candidateWizardFiles.cv?.name||d.cvName||'Belum ada CV dipilih')}</div>${d.cvPreviewUrl?`<a class="text-link" href="${escapeHtml(d.cvPreviewUrl)}" target="_blank" rel="noopener">Preview CV</a>`:candidateSafeHttpUrl(d.cvUrl)?`<a class="text-link" href="${escapeHtml(candidateSafeHttpUrl(d.cvUrl))}" target="_blank" rel="noopener">Preview / Download CV saat ini</a>`:''}<button class="btn btn-outline btn-small" id="editCvWithCanvaWizard" type="button"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Edit CV / Resume di Canva</button><small class="form-note">Pilih file baru jika ingin menambahkan atau mengganti CV.</small></div>`;
  if(step===10)return `<div class="candidate-step-intro"><h2>Portfolio</h2><p>Tambahkan tautan proyek dan unggahan foto/video proyek.</p></div><div class="candidate-form-grid">${candidateInput('GitHub','portfolioGithub',d.portfolioGithub,'url')}${candidateInput('Website','portfolioWebsite',d.portfolioWebsite,'url')}${candidateInput('Behance','portfolioBehance',d.portfolioBehance,'url')}${candidateInput('Dribbble','portfolioDribbble',d.portfolioDribbble,'url')}${candidateInput('LinkedIn','portfolioLinkedin',d.portfolioLinkedin,'url')}<div class="form-row"><label for="candidatePortfolioFiles">Foto / video proyek</label><input id="candidatePortfolioFiles" type="file" multiple accept="image/jpeg,image/png,video/mp4"></div></div>`;
  if(step===11)return `<div class="candidate-step-intro"><h2>Media sosial</h2><p>Opsional. Tambahkan link sosial profesional.</p></div><div class="candidate-form-grid">${['Instagram','Facebook','LinkedIn','GitHub','Website pribadi'].map((label,index)=>candidateInput(label,`social${index}`,d[`social${index}`],'url')).join('')}</div>`;
  if(step===12)return `<div class="candidate-step-intro"><h2>Preferensi kerja</h2><p>Pilih waktu dan cara kerja yang diinginkan.</p></div><fieldset class="candidate-check-group"><legend>Jam kerja</legend>${['Pagi','Siang','Malam','Shift'].map(item=>`<label><input type="checkbox" name="workHours" value="${item}" ${(d.workHours||[]).includes(item)?'checked':''}> ${item}</label>`).join('')}</fieldset><fieldset class="candidate-check-group"><legend>Mode kerja</legend>${['Remote','Hybrid','Onsite'].map(item=>`<label><input type="checkbox" name="workModes" value="${item}" ${(d.workModes||[]).includes(item)?'checked':''}> ${item}</label>`).join('')}</fieldset>`;
  if(step===13) {
    const isArt=/\bART\b|asisten rumah tangga|babysitter|nanny/i.test(`${d.category||''} ${d.mainPosition||''}`);
    return `<div class="candidate-step-intro"><h2>Dokumen tambahan <span class="form-note">(semua opsional)</span></h2><p>${isArt?'Untuk pekerjaan ART, babysitter, atau asisten rumah tangga, SKCK, KTP, ijazah, dan dokumen lainnya tidak diwajibkan di platform ini. Unggah hanya dokumen yang sudah tersedia atau memang diminta kemudian oleh perusahaan.':'Dokumen seperti KTP, SIM, SKCK, ijazah, transkrip, dan sertifikat kompetensi tidak diwajibkan untuk membuat profil atau melamar pekerjaan. Unggah hanya jika sudah tersedia atau memang dibutuhkan untuk lowongan tertentu.'} Dokumen disimpan privat dan tidak ditampilkan di profil publik.</p></div><fieldset class="candidate-check-group"><legend>Pilih dokumen yang sudah tersedia (jika ada)</legend>${['KTP','SIM','SKCK','Ijazah','Transkrip Nilai','Sertifikat Kompetensi'].map(item=>`<label><input type="checkbox" name="documentTypes" value="${item}" ${(d.documentTypes||[]).includes(item)?'checked':''}> ${item}</label>`).join('')}</fieldset><div class="form-row"><label for="candidateDocumentFiles">Berkas dokumen (urut sesuai pilihan, opsional)</label><input id="candidateDocumentFiles" type="file" multiple accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"><small class="form-note">Maksimal 5 MB per berkas. Lewati langkah ini jika belum memiliki dokumen.</small></div>`;
  }
  const skills=(d.skills||[]).map(skill=>`<span>${escapeHtml(skill)}</span>`).join('');
  return `<div class="candidate-step-intro"><h2>Preview profil</h2><p>Pastikan informasi dasar sudah benar. Foto, CV, pendidikan, skill, dan dokumen tambahan boleh dikosongkan.</p></div><article class="candidate-preview-card">${d.photoData?`<img class="candidate-preview-photo" src="${d.photoData}" alt="Foto ${escapeHtml(d.fullName||'kandidat')}">`:'<div class="candidate-preview-photo candidate-placeholder"><i class="fa-solid fa-user" aria-hidden="true"></i></div>'}<div><h2>${escapeHtml(d.fullName||'Nama lengkap')}</h2><p>${escapeHtml(d.mainPosition||'Posisi yang dicari')} · ${escapeHtml([d.city,d.province].filter(Boolean).join(', ')||'Lokasi belum diisi')}</p><span class="candidate-status-badge">${escapeHtml(d.workStatus||'Open To Work')}</span><p>${escapeHtml(d.about||'Belum ada deskripsi tambahan.')}</p><div class="skill-list">${skills||'<small class="form-note">Skill belum ditambahkan</small>'}</div><p>${(d.education||[]).filter(row=>row.school).map(row=>`${escapeHtml(row.level||'')} · ${escapeHtml(row.school)}`).join('<br>')||'Pendidikan belum ditambahkan'}</p><p>CV: ${escapeHtml(candidateWizardFiles.cv?.name||d.cvName||'Belum diunggah (opsional)')}</p><p>Dokumen tambahan: ${(d.documentTypes||[]).length?`${d.documentTypes.length} jenis dipilih`:'Tidak ada (opsional)'}</p></div></article><div class="form-row"><label class="candidate-consent"><input type="checkbox" name="publishConsent" required> Saya setuju memublikasikan informasi profesional pada profil publik. Data kontak pribadi dan dokumen tambahan tetap privat kecuali saya memilih membagikan kontak.</label></div>`;
}
function collectCandidateWizardStep() {
  const content=$('#candidateWizardContent');
  for(const input of content.querySelectorAll('input[name],select[name],textarea[name]')) {
    if(input.type==='file'||input.name==='publishConsent')continue;
    if(input.type==='checkbox') {
      if(['jobTypes','workHours','workModes','documentTypes'].includes(input.name))continue;
      candidateWizardData[input.name]=input.checked;
    } else candidateWizardData[input.name]=input.value.trim();
  }
  for(const key of ['jobTypes','workHours','workModes','documentTypes']) {
    if(content.querySelector(`input[name="${key}"]`)) {
      candidateWizardData[key]=[...content.querySelectorAll(`input[name="${key}"]:checked`)].map(input=>input.value);
    }
  }
  for(const list of content.querySelectorAll('[data-list]')) {
    const key=list.dataset.list;
    candidateWizardData[key]=[...list.querySelectorAll('[data-list-row]')].map(row=>Object.fromEntries([...row.querySelectorAll('[data-field]')].map(input=>[input.dataset.field,input.dataset.bulletList&&input.value.trim()==='•'?'':input.value.trim()]))).filter(row=>Object.values(row).some(Boolean));
  }
  if(candidateWizardStep===1&&window.JobHubAddress) {
    const address=window.JobHubAddress.getValue();
    Object.assign(candidateWizardData,address,{
      province:address.provinceName,
      city:address.regencyName,
      district:address.districtName,
      village:address.villageName
    });
  }
  try {
    const serializable={...candidateWizardData};
    delete serializable.cvPreviewUrl;
    sessionStorage.setItem(CANDIDATE_DRAFT_KEY,JSON.stringify(serializable));
  } catch(error) {
    toast(`Draft tidak dapat disimpan di browser: ${error.message||'ruang penyimpanan penuh.'}`);
  }
}
function validateCandidateWizardStep(step) {
  const content=$('#candidateWizardContent');
  if(step===1) {
    if(!candidateWizardData.fullName||!candidateWizardData.whatsapp) {
      toast('Isi nama lengkap dan nomor WhatsApp untuk melanjutkan.');return false;
    }
  }
  if(step===2&&candidateWizardData.salaryMin&&candidateWizardData.salaryMax&&Number(candidateWizardData.salaryMax)<Number(candidateWizardData.salaryMin)) {
    toast('Gaji maksimum tidak boleh lebih kecil dari gaji minimum.');return false;
  }
  if(step===14&&!$('#candidateWizardContent [name="publishConsent"]')?.checked) {
    toast('Setujui publikasi profil sebelum melanjutkan.');return false;
  }
  for(const field of content.querySelectorAll('[required]')) {
    if(field.type==='checkbox'&&field.name==='publishConsent')continue;
    if(!field.checkValidity()) {
      field.reportValidity();return false;
    }
  }
  return true;
}
function renderCandidateWizard() {
  if(!candidateProfileLoaded) {
    try {
      candidateWizardData=JSON.parse(sessionStorage.getItem(CANDIDATE_DRAFT_KEY)||'{}');
    } catch {
      candidateWizardData={};
    }
    delete candidateWizardData.cvPreviewUrl;
    delete candidateWizardData.cvUrl;
    const hasDraft=Object.keys(candidateWizardData).length>0;
    candidateWizardData.email=candidateWizardData.email||supabaseSession?.user?.email||'';
    candidateWizardData.fullName=candidateWizardData.fullName||supabaseSession?.user?.user_metadata?.full_name||'';
    candidateWizardData.whatsapp=candidateWizardData.whatsapp||supabaseSession?.user?.user_metadata?.whatsapp||'';
    candidateProfileLoaded=true;
    if(!hasDraft&&!candidateProfileLoading)loadOwnCandidateProfile();
  }
  $('#candidateWizardSteps').innerHTML=candidateWizardStepNames.map((name,index)=>`<button type="button" class="candidate-step-link ${index===candidateWizardStep?'active':''} ${index<candidateWizardStep?'complete':''}" data-wizard-step="${index}" ${index>candidateWizardStep?'disabled':''}><i class="fa-solid ${candidateWizardStepIcons[index]}" aria-hidden="true"></i><span>${escapeHtml(name)}</span></button>`).join('');
  $('#candidateWizardStepLabel').textContent=`Langkah ${candidateWizardStep+1} dari ${candidateWizardStepNames.length} · ${candidateWizardStepNames[candidateWizardStep]}`;
  const percent=Math.round((candidateWizardStep+1)/candidateWizardStepNames.length*100);
  $('#candidateWizardPercent').textContent=`${percent}%`;
  $('#candidateWizardProgressBar').style.width=`${percent}%`;
  renderCandidateWizardStrength();
  const content=$('#candidateWizardContent');
  content.innerHTML=candidateWizardStepContent(candidateWizardStep);
  const saveStatus=document.createElement('p');
  saveStatus.id='candidateWizardSaveStatus';
  saveStatus.className='cv-analysis-error';
  saveStatus.setAttribute('role','alert');
  saveStatus.setAttribute('aria-live','assertive');
  saveStatus.hidden=true;
  content.after(saveStatus);
  content.querySelectorAll('textarea[data-bullet-list]').forEach(field=>{
    field.addEventListener('focus',()=>{
      if(field.value.trim()==='•')field.setSelectionRange(field.value.length,field.value.length);
    });
  });
  if(candidateWizardStep===0)content.insertAdjacentHTML('afterbegin',renderCandidateCoverEditor());
  if(candidateWizardStep===14&&candidateWizardData.coverData)content.insertAdjacentHTML('afterbegin',`<img class="candidate-preview-cover" src="${escapeHtml(candidateWizardData.coverData)}" alt="Preview foto sampul">`);
  if(candidateWizardStep===9&&candidateWizardData.cvPath&&candidateWizardData.postId)content.insertAdjacentHTML('beforeend',`<p class="form-note">CV tersimpan secara privat: ${escapeHtml(candidateWizardData.cvName||'CV PDF')}</p><button class="btn btn-outline btn-small" type="button" data-candidate-cv="${escapeHtml(candidateWizardData.postId)}"><i class="fa-solid fa-eye" aria-hidden="true"></i> Lihat CV tersimpan</button>`);
  if(candidateWizardStep===1&&window.JobHubAddress) {
    window.JobHubAddress.mount($('#candidateAddressForm'),candidateWizardData);
  }
  if(candidateWizardStep===1)content.insertAdjacentHTML('beforeend',`<label class="candidate-consent"><input type="checkbox" name="shareContact" ${candidateWizardData.shareContact===true?'checked':''}> Saya setuju menampilkan email dan WhatsApp pada profil publik.</label>`);
  $('#candidateWizardBack').disabled=candidateWizardStep===0;
  $('#candidateWizardBack').hidden=false;
  $('#candidateWizardBack').textContent=candidateQuickEdit?'Batal':'Kembali';
  const atFinalStep=candidateWizardStep===candidateWizardStepNames.length-1;
  const isDraftStep=!candidateQuickEdit&&atFinalStep;
  $('#candidateWizardSaveDraft').hidden=!isDraftStep;
  $('#candidateWizardPublish').hidden=!isDraftStep;
  $('#candidateWizardNext').hidden=isDraftStep;
  $('#candidateWizardNext').textContent=candidateQuickEdit
    ?'Simpan perubahan'
    :atFinalStep
    ?'Lanjut'
    :[0,3,4,5,6,7,8,9,10,11,12,13].includes(candidateWizardStep)?'Lanjutkan / lewati':'Lanjut';
  $('#candidateWizardNext').classList.toggle('candidate-publish-button',!candidateQuickEdit&&atFinalStep);
  if(candidateQuickEditFocus) {
    const {key,index}=candidateQuickEditFocus;
    candidateQuickEditFocus=null;
    window.setTimeout(()=>{
      const row=$(`#candidateWizardContent [data-list="${key}"] [data-list-row]:nth-child(${index+1})`);
      row?.querySelector('[data-field]')?.focus();
    },0);
  }
}
function startCandidateQuickEdit(step,key='',add=false,index=0) {
  if(!isCandidateSession()) {
    toast('Masuk sebagai kandidat untuk mengedit profil.');
    return;
  }
  candidateWizardStep=step;
  candidateQuickEdit=true;
  pendingCandidateQuickEdit=key?{key,add,index}:null;
  if(candidateProfileLoaded&&!candidateProfileLoading)applyPendingCandidateQuickEdit();
  go('candidate-create-profile');
}
function applyPendingCandidateQuickEdit() {
  if(!pendingCandidateQuickEdit)return;
  const {key,add,index}=pendingCandidateQuickEdit;
  const rows=Array.isArray(candidateWizardData[key])?[...candidateWizardData[key]]:[];
  if(add)rows.push({});
  candidateWizardData[key]=rows;
  candidateQuickEditFocus={key,index:add?rows.length-1:index};
  pendingCandidateQuickEdit=null;
}
async function loadOwnCandidateProfile() {
  candidateProfileLoading=true;
  try {
    let profile=getLocalCandidateProfiles().find(item=>item.userId===currentCandidateOwnerId())||null;
    if(supabaseClient&&isCandidateSession()) {
      const {data,error}=await supabaseClient.from('candidate_posts')
        .select('id,user_id,username,full_name,main_position,category,location,work_status,job_types,salary_min,salary_max,skills,education_level,experience_years,about,profile_image_url,public_data,is_published,verified_candidate,created_at,updated_at')
        .eq('user_id',currentCandidateOwnerId()).maybeSingle();
      if(error)throw error;
      if(data)profile={...data,userId:currentCandidateOwnerId(),publicData:data.public_data||{}};
      if(profile) {
        const {data:privateRow,error:privateError}=await supabaseClient.from('candidate_post_private')
          .select('private_data,province_id,province_name,regency_id,regency_name,district_id,district_name,village_id,village_name,postal_code,address,rt,rw')
          .eq('user_id',currentCandidateOwnerId()).maybeSingle();
        if(privateError) {
          profile.privateData={};
          toast(`Detail alamat privat tidak dapat dimuat: ${privateError.message||'periksa kebijakan akses Supabase.'}`);
        } else {
          profile.privateData={
            ...(privateRow?.private_data||{}),
            provinceId:privateRow?.province_id||privateRow?.private_data?.provinceId||'',
            provinceName:privateRow?.province_name||privateRow?.private_data?.provinceName||'',
            regencyId:privateRow?.regency_id||privateRow?.private_data?.regencyId||'',
            regencyName:privateRow?.regency_name||privateRow?.private_data?.regencyName||'',
            districtId:privateRow?.district_id||privateRow?.private_data?.districtId||'',
            districtName:privateRow?.district_name||privateRow?.private_data?.districtName||privateRow?.private_data?.district||'',
            villageId:privateRow?.village_id||privateRow?.private_data?.villageId||'',
            villageName:privateRow?.village_name||privateRow?.private_data?.villageName||'',
            postalCode:privateRow?.postal_code||privateRow?.private_data?.postalCode||'',
            address:privateRow?.address||privateRow?.private_data?.address||'',
            rt:privateRow?.rt||privateRow?.private_data?.rt||'',
            rw:privateRow?.rw||privateRow?.private_data?.rw||''
          };
        }
        if(!profile.privateData.cv_path) {
          const {data:cvData,error:cvError}=await supabaseClient.functions.invoke('candidate-cv-access',{body:{candidatePostId:profile.id}});
          if(!cvError&&cvData?.cvPath)profile.privateData={...profile.privateData,cv_path:cvData.cvPath,cv_name:cvData.fileName||''};
        }
      }
    }
    if(profile) {
      currentCandidateProfile=profile;
      const pub=profile.publicData||profile.public_data||{},privateData=profile.privateData||{};
      candidateWizardData={
        ...privateData,
        postId:profile.id,username:profile.username,fullName:profile.full_name,mainPosition:profile.main_position,
        category:profile.category,workStatus:profile.work_status,jobTypes:profile.job_types||pub.jobTypes||[],
        salaryMin:profile.salary_min,salaryMax:profile.salary_max,about:profile.about,skills:profile.skills||[],
        workAuthorization:pub.workAuthorization||'',
        education:pub.education||[],experience:pub.experience||[],languages:pub.languages||[],
        certificates:pub.certificates||[],workHours:pub.preferences?.workHours||[],workModes:pub.preferences?.workModes||[],
        certificateFileUrls:pub.certificateFiles||[],portfolioFileUrls:pub.portfolioFiles||[],
        currentlyWorking:Boolean(pub.currentlyWorking),educationStillStudying:Boolean(pub.educationStillStudying),
        nickname:pub.nickname||'',alternativePosition:pub.alternativePosition||'',
        city:pub.city||'',province:pub.province||'',provinceId:privateData.provinceId||'',provinceName:privateData.provinceName||pub.province||'',
        regencyId:privateData.regencyId||'',regencyName:privateData.regencyName||pub.city||'',
        districtId:privateData.districtId||'',districtName:privateData.districtName||privateData.district||'',
        villageId:privateData.villageId||'',villageName:privateData.villageName||'',
        rt:privateData.rt||'',rw:privateData.rw||'',postalCode:privateData.postalCode||privateData.postal_code||'',
        address:privateData.address||'',mapsUrl:privateData.mapsUrl||'',relocation:pub.relocation||'',
        businessTravel:pub.businessTravel||'',shareContact:pub.shareContact===true,portfolioGithub:pub.portfolio?.find(item=>item.label==='GitHub')?.url||'',
        portfolioWebsite:pub.portfolio?.find(item=>item.label==='Website')?.url||'',portfolioBehance:pub.portfolio?.find(item=>item.label==='Behance')?.url||'',
        portfolioDribbble:pub.portfolio?.find(item=>item.label==='Dribbble')?.url||'',portfolioLinkedin:pub.portfolio?.find(item=>item.label==='LinkedIn')?.url||'',
        social0:pub.socialLinks?.find(item=>item.label==='Instagram')?.url||'',social1:pub.socialLinks?.find(item=>item.label==='Facebook')?.url||'',
        social2:pub.socialLinks?.find(item=>item.label==='LinkedIn')?.url||'',social3:pub.socialLinks?.find(item=>item.label==='GitHub')?.url||'',
        social4:pub.socialLinks?.find(item=>item.label==='Website pribadi')?.url||'',photoData:profile.profile_image_url||pub.profileImageUrl||'',
        cvPath:privateData.cv_path||profile.cvPath||'',cvName:privateData.cv_name||profile.cvName||'',coverData:pub.coverImageUrl||pub.cover_image_url||''
      };
    }
  } catch(error) {
    toast(`Profil kandidat sebelumnya gagal dimuat: ${error.message||'periksa koneksi dan RLS.'}`);
  } finally {
    candidateProfileLoading=false;
    if(profileWizardVisible()) {
      applyPendingCandidateQuickEdit();
      renderCandidateWizard();
    }
  }
}
function profileWizardVisible() {
  return $('#candidateWizardView')?.classList.contains('active');
}
async function cropCandidatePhoto(file,zoom=1) {
  const image=await createImageBitmap(file);
  const side=Math.min(image.width,image.height)/Math.max(1,Number(zoom)||1);
  const sx=(image.width-side)/2,sy=(image.height-side)/2;
  const canvas=document.createElement('canvas');
  canvas.width=800;canvas.height=800;
  const context=canvas.getContext('2d');
  if(!context)throw new Error('Tidak dapat memproses crop foto.');
  context.drawImage(image,sx,sy,side,side,0,0,800,800);
  image.close();
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Foto tidak dapat diproses.')),'image/jpeg',.88));
}
function renderCandidateCoverEditor() {
  const cover=candidateSafeImageUrl(candidateWizardData.coverData);
  return `<section class="candidate-cover-editor"><div class="candidate-cover-heading"><h2>Foto sampul <span class="form-note">(opsional)</span></h2><p>Tambahkan gambar lebar untuk memperkuat tampilan profil. JPG, PNG, atau WEBP maksimal 5 MB.</p></div><div class="candidate-cover-preview" id="candidateCoverPreview">${cover?`<img src="${escapeHtml(cover)}" alt="Preview foto sampul">`:'<span><i class="fa-regular fa-image" aria-hidden="true"></i><strong>Belum ada foto sampul</strong><small>Pratinjau foto akan tampil di sini</small></span>'}</div><div class="candidate-cover-actions"><label class="btn btn-outline btn-small" for="candidateCoverFile"><i class="fa-solid fa-image" aria-hidden="true"></i> Pilih foto sampul</label><input id="candidateCoverFile" type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" hidden><button class="text-link" type="button" data-remove-cover ${cover?'':'disabled'}>Hapus sampul</button></div></section>`;
}
async function resizeCandidateCover(file) {
  const image=await createImageBitmap(file);
  const width=1600,height=600,scale=Math.max(width/image.width,height/image.height);
  const sourceWidth=width/scale,sourceHeight=height/scale;
  const sx=(image.width-sourceWidth)/2,sy=(image.height-sourceHeight)/2;
  const canvas=document.createElement('canvas');
  canvas.width=width;canvas.height=height;
  const context=canvas.getContext('2d');
  if(!context)throw new Error('Tidak dapat memproses foto sampul.');
  context.drawImage(image,sx,sy,sourceWidth,sourceHeight,0,0,width,height);
  image.close();
  return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Foto sampul tidak dapat diproses.')),'image/jpeg',.88));
}
function slugCandidateName(name) {
  return String(name||'kandidat').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,45)||'kandidat';
}
function buildCandidatePublicData() {
  const d=candidateWizardData;
  const contacts=d.shareContact?{email:d.email,whatsapp:d.whatsapp}:null;
  const socialLinks=['Instagram','Facebook','LinkedIn','GitHub','Website pribadi'].map((label,index)=>({label,url:candidateSafeHttpUrl(d[`social${index}`])})).filter(item=>item.url);
  const portfolio=[
    ['GitHub',d.portfolioGithub],['Website',d.portfolioWebsite],['Behance',d.portfolioBehance],
    ['Dribbble',d.portfolioDribbble],['LinkedIn',d.portfolioLinkedin]
  ].map(([label,url])=>[label,candidateSafeHttpUrl(url)]).filter(item=>item[1]).map(([label,url])=>({label,url}));
  return {
    nickname:d.nickname||'',alternativePosition:d.alternativePosition||'',nationality:d.nationality||'',
    workStatus:d.workStatus||'Open To Work',jobTypes:d.jobTypes||[],relocation:d.relocation||'',
    workAuthorization:d.workAuthorization||'',
    businessTravel:d.businessTravel||'',shareContact:Boolean(d.shareContact),education:d.education||[],educationStillStudying:Boolean(d.educationStillStudying),
    experience:d.experience||[],currentlyWorking:Boolean(d.currentlyWorking),
    skills:d.skills||[],languages:d.languages||[],certificates:d.certificates||[],
    portfolio,socialLinks,preferences:{workHours:d.workHours||[],workModes:d.workModes||[]},
    contact:contacts,city:d.city||'',province:d.province||'',
    certificateFiles:d.certificateFileUrls||[],portfolioFiles:d.portfolioFileUrls||[]
  };
}
async function uploadCandidateMedia(path,blob,contentType,bucket='candidate-profile-media') {
  const {error}=await supabaseClient.storage.from(bucket).upload(path,blob,{contentType,upsert:true});
  if(error)throw error;
  return bucket==='candidate-profile-media'?supabaseClient.storage.from(bucket).getPublicUrl(path).data.publicUrl:path;
}
async function saveCandidateCvFile(file) {
  if(!supabaseClient||!isCandidateSession())throw new Error('Masuk sebagai kandidat untuk menyimpan CV.');
  if(!(file instanceof File)||file.type!=='application/pdf'||!file.size||file.size>5*1024*1024) {
    throw new Error('CV harus PDF dan berukuran maksimal 5 MB.');
  }
  const ownerId=currentCandidateOwnerId();
  const {data:post,error:postError}=await supabaseClient.from('candidate_posts')
    .select('id,public_data').eq('user_id',ownerId).maybeSingle();
  if(postError)throw postError;
  if(!post)throw new Error('Publikasikan profil kandidat terlebih dahulu.');
  const {data:existing,error:privateReadError}=await supabaseClient.from('candidate_post_private')
    .select('private_data').eq('user_id',ownerId).maybeSingle();
  if(privateReadError)throw privateReadError;
  const path=`${ownerId}/cv/${crypto.randomUUID()}.pdf`;
  const {error:uploadError}=await supabaseClient.storage.from('candidate-private-documents')
    .upload(path,file,{contentType:'application/pdf',upsert:false});
  if(uploadError)throw uploadError;
  const privateData={...(existing?.private_data||{}),cv_path:path,cv_name:file.name};
  const {error:privateError}=await supabaseClient.from('candidate_post_private').upsert({
    user_id:ownerId,candidate_post_id:post.id,private_data:privateData,updated_at:new Date().toISOString()
  },{onConflict:'user_id'});
  if(privateError) {
    await supabaseClient.storage.from('candidate-private-documents').remove([path]);
    throw privateError;
  }
  const publicData={...(post.public_data||{})};
  delete publicData.cvUrl;delete publicData.cv_url;delete publicData.cvName;delete publicData.cv_name;
  const {error:profileError}=await supabaseClient.from('candidate_posts').update({
    cv_url:path,public_data:publicData,updated_at:new Date().toISOString()
  }).eq('user_id',ownerId);
  if(profileError)throw profileError;
  const oldCvPath=existing?.private_data?.cv_path;
  if(typeof oldCvPath==='string'&&oldCvPath.startsWith(`${ownerId}/cv/`)&&oldCvPath!==path) {
    const {error:removeError}=await supabaseClient.storage.from('candidate-private-documents').remove([oldCvPath]);
    if(removeError)console.warn('Previous private CV could not be deleted:',removeError.message);
  }
  currentCandidateProfile={...(currentCandidateProfile||{}),...post,userId:ownerId,cvPath:path,cvName:file.name,publicData};
  const profiles=getLocalCandidateProfiles();
  try {
    saveLocalCandidateProfiles(profiles.map(profile=>profile.userId===ownerId
      ?{...profile,cv_url:path,cvPath:path,cvName:file.name,publicData,public_data:publicData}
      :profile));
  } catch(error) {
    console.warn('Private CV was saved online but the local candidate cache failed:',error.name||'StorageError');
  }
  return path;
}
async function requestCandidateCv(candidatePostId='',applicationId='') {
  if(!supabaseClient||!supabaseSession)throw new Error('Masuk ke akun JobHub untuk mengakses CV.');
  const {data,error}=await supabaseClient.functions.invoke('candidate-cv-access',{
    body:{...(candidatePostId?{candidatePostId}:{}),...(applicationId?{applicationId}:{})}
  });
  if(error)throw error;
  if(!data?.signedUrl)throw new Error('Tautan CV sementara tidak tersedia.');
  return data;
}
function runCandidateUploadTasks(tasks) {
  return Promise.allSettled(tasks.map(task=>task()));
}
async function runCandidatePostSave(errorPrefix='', publishMode=null) {
  const button=$('#candidateWizardNext');
  const draftButton=$('#candidateWizardSaveDraft');
  const publishButton=$('#candidateWizardPublish');
  const status=$('#candidateWizardSaveStatus');
  const targetButton=publishMode===true?publishButton:(publishMode===false?draftButton:button);
  if(targetButton?.disabled)return;
  if(targetButton) {
    targetButton.disabled=true;
    targetButton.setAttribute('aria-busy','true');
    targetButton.dataset.idleLabel=targetButton.textContent;
    targetButton.textContent=publishMode===true?'Memproses publikasi...':publishMode===false?'Menyimpan draft...':'Menyimpan profil...';
  }
  if(status) {
    status.hidden=true;
    status.textContent='';
  }
  try {
    await saveCandidatePost(publishMode);
  } catch(error) {
    const message=`${errorPrefix}${error.message||'Periksa koneksi dan kebijakan akses Supabase.'}`;
    if(status) {
      status.textContent=message;
      status.hidden=false;
    }
    toast(message);
  } finally {
    if(targetButton?.isConnected) {
      targetButton.disabled=false;
      targetButton.removeAttribute('aria-busy');
      targetButton.textContent=targetButton.dataset.idleLabel||'Publikasikan profil';
      delete targetButton.dataset.idleLabel;
    }
  }
}
async function saveCandidatePost(publishMode=null) {
  collectCandidateWizardStep();
  const d=candidateWizardData;
  const previousCvPath=d.cvPath||d.cv_path||'';
  if(!supabaseClient||!isCandidateSession()) {
    toast('Masuk ke akun pencari kerja yang terhubung ke Supabase untuk menyimpan profil.');
    openAuthModal(false);
    return;
  }
  const education=(d.education||[]).some(item=>item.level&&item.school);
  const experience=(d.experience||[]).some(item=>item.company&&item.position);
  const hasCv=Boolean(candidateWizardFiles.cv||d.cvId||d.cvPath);
  const missing=[];
  if(!d.fullName)missing.push('nama lengkap');
  if(!d.whatsapp)missing.push('nomor WhatsApp');
  if(!d.mainPosition)missing.push('posisi yang dicari');
  if(!d.category)missing.push('kategori pekerjaan');
  if(!d.photoData&&!candidateWizardFiles.photo)missing.push('foto profil');
  if(!String(d.about||'').trim())missing.push('tentang saya');
  if(!education)missing.push('pendidikan');
  if((d.skills||[]).length<3)missing.push('minimal tiga skill');
  if(!experience&&d.workStatus!=='Fresh Graduate')missing.push('pengalaman kerja atau status Fresh Graduate');
  if(!hasCv)missing.push('CV PDF');
  if(missing.length) {
    toast(`Lengkapi profil sebelum dipublikasikan: ${missing.join(', ')}.`);
    return;
  }
  const ownerId=currentCandidateOwnerId();
  const localProfiles=getLocalCandidateProfiles();
  let existing=localProfiles.find(item=>item.userId===ownerId)||null;
  if(supabaseClient) {
    const {data,error}=await supabaseClient.from('candidate_posts').select('id,username,is_published').eq('user_id',ownerId).maybeSingle();
    if(error)throw error;
    if(data)existing={...(existing||{}),id:data.id,username:data.username,is_published:data.is_published};
  }
  const postId=existing?.id||crypto.randomUUID();
  const username=existing?.username||`${slugCandidateName(d.fullName)}-${postId.slice(0,6)}`;
  const publishRequested=publishMode===null?Boolean(existing?.is_published):Boolean(publishMode);
  let photoUrl=d.photoData||'';
  let coverUrl=d.coverData||'';
  let cvPath=d.cvPath||'';
  const certificateFileUrls=[...(d.certificateFileUrls||[])];
  const portfolioFileUrls=[...(d.portfolioFileUrls||[])];
  const privateDocuments=[...(d.documents||[])];
  const uploadTasks=[];
  if(supabaseClient) {
    if(candidateWizardFiles.photo) {
      uploadTasks.push(async()=>({type:'photo',url:await uploadCandidateMedia(`${ownerId}/${postId}/profile.jpg`,await cropCandidatePhoto(candidateWizardFiles.photo,d.photoZoom||1),'image/jpeg')}));
    }
    if(candidateWizardFiles.cover) {
      uploadTasks.push(async()=>({type:'cover',url:await uploadCandidateMedia(`${ownerId}/${postId}/cover.jpg`,await resizeCandidateCover(candidateWizardFiles.cover),'image/jpeg')}));
    }
    if(candidateWizardFiles.cv||d.cvId) {
      uploadTasks.push(async()=>{
        const cvEntry=candidateWizardFiles.cv||await getCvFile(d.cvId);
        return cvEntry?.blob||candidateWizardFiles.cv
          ?{type:'cv',path:await uploadCandidateMedia(`${ownerId}/cv/${crypto.randomUUID()}.pdf`,cvEntry?.blob||candidateWizardFiles.cv,'application/pdf','candidate-private-documents')}
          :null;
      });
    }
    for(const file of candidateWizardFiles.certificates||[]) {
      const safeName=file.name.replace(/[^a-z0-9._-]/gi,'_');
      uploadTasks.push(async()=>({type:'certificate',name:file.name,url:await uploadCandidateMedia(`${ownerId}/${postId}/certificates/${crypto.randomUUID()}-${safeName}`,file,file.type)}));
    }
    for(const file of candidateWizardFiles.portfolio||[]) {
      const safeName=file.name.replace(/[^a-z0-9._-]/gi,'_');
      uploadTasks.push(async()=>({type:'portfolio',name:file.name,url:await uploadCandidateMedia(`${ownerId}/${postId}/portfolio/${crypto.randomUUID()}-${safeName}`,file,file.type)}));
    }
    for(const [index,file] of (candidateWizardFiles.documents||[]).entries()) {
      const safeName=file.name.replace(/[^a-z0-9._-]/gi,'_');
      const type=d.documentTypes?.[index]||'Dokumen';
      uploadTasks.push(async()=>{
        const path=`${ownerId}/${postId}/${crypto.randomUUID()}-${safeName}`;
        const {error}=await supabaseClient.storage.from('candidate-private-documents').upload(path,file,{contentType:file.type,upsert:true});
        if(error)throw error;
        return {type:'document',document:{type,name:file.name,path}};
      });
    }
    const uploadResults=await runCandidateUploadTasks(uploadTasks);
    const failedUpload=uploadResults.find(result=>result.status==='rejected');
    if(failedUpload)throw failedUpload.reason;
    for(const result of uploadResults) {
      const uploaded=result.value;
      if(!uploaded)continue;
      if(uploaded.type==='photo')photoUrl=uploaded.url;
      if(uploaded.type==='cover')coverUrl=uploaded.url;
      if(uploaded.type==='cv')cvPath=uploaded.path;
      if(uploaded.type==='certificate')certificateFileUrls.push({name:uploaded.name,url:uploaded.url});
      if(uploaded.type==='portfolio')portfolioFileUrls.push({name:uploaded.name,url:uploaded.url});
      if(uploaded.type==='document')privateDocuments.push(uploaded.document);
    }
  } else {
    photoUrl=d.photoData;
    coverUrl=d.coverData||'';
  }
  d.certificateFileUrls=certificateFileUrls;
  d.portfolioFileUrls=portfolioFileUrls;
  const publicData=buildCandidatePublicData();
  publicData.profileImageUrl=photoUrl;
  publicData.coverImageUrl=coverUrl;
  delete publicData.cvUrl;delete publicData.cv_url;delete publicData.cvName;delete publicData.cv_name;
  const years=calculateCandidateExperienceYears(d.experience||[]);
  const row={
    id:postId,user_id:supabaseClient?ownerId:null,username,full_name:d.fullName,main_position:d.mainPosition,
    category:d.category||'',location:[d.city,d.province].filter(Boolean).join(', '),work_status:d.workStatus||'Open To Work',
    job_types:d.jobTypes||[],salary_min:d.salaryMin?Number(d.salaryMin):null,salary_max:d.salaryMax?Number(d.salaryMax):null,
    skills:d.skills,education_level:(d.education||[]).filter(item=>item.school).at(-1)?.level||'',
    experience_years:years,about:d.about||'',profile_image_url:photoUrl,cv_url:cvPath,public_data:publicData,is_published:publishRequested,
    updated_at:new Date().toISOString()
  };
  if(supabaseClient) {
    const {error}=await supabaseClient.from('candidate_posts').upsert(row,{onConflict:'user_id'});
    if(error)throw error;
    const {data:stored,error:readError}=await supabaseClient.from('candidate_posts').select('id').eq('user_id',ownerId).single();
    if(readError)throw readError;
    row.id=stored.id;
    const privateData={
      email:d.email,whatsapp:d.whatsapp,birthDate:d.birthDate,age:candidateAge(d.birthDate),
      cv_path:cvPath,cv_name:candidateWizardFiles.cv?.name||d.cvName||d.privateData?.cv_name||'',
      gender:d.gender,maritalStatus:d.maritalStatus,religion:d.religion,nationality:d.nationality,
      provinceId:d.provinceId,provinceName:d.provinceName,regencyId:d.regencyId,regencyName:d.regencyName,
      districtId:d.districtId,districtName:d.districtName,villageId:d.villageId,villageName:d.villageName,
      postalCode:d.postalCode,address:d.address,rt:d.rt,rw:d.rw,mapsUrl:d.mapsUrl,documents:privateDocuments
    };
    const {error:privateError}=await supabaseClient.from('candidate_post_private').upsert({
      user_id:ownerId,candidate_post_id:row.id,private_data:privateData,
      province_id:d.provinceId||null,province_name:d.provinceName||null,
      regency_id:d.regencyId||null,regency_name:d.regencyName||null,
      district_id:d.districtId||null,district_name:d.districtName||null,
      village_id:d.villageId||null,village_name:d.villageName||null,
      postal_code:d.postalCode||null,address:d.address||null,rt:d.rt||null,rw:d.rw||null,
      updated_at:new Date().toISOString()
    },{onConflict:'user_id'});
    if(privateError)throw privateError;
    const childSets=[
      ['candidate_portfolios',[...publicData.portfolio,...publicData.portfolioFiles.map(item=>({label:item.name,url:item.url}))]],
      ['candidate_languages',publicData.languages],
      ['candidate_certificates',[...publicData.certificates,...publicData.certificateFiles.map(item=>({name:item.name,url:item.url}))]],
      ['candidate_social_links',publicData.socialLinks],
      ['candidate_preferences',[publicData.preferences]],
      ['candidate_documents',privateDocuments]
    ];
    const childResults=await Promise.allSettled(childSets.map(async([table,items])=>{
      const {error:deleteError}=await supabaseClient.from(table).delete().eq('candidate_post_id',row.id).eq('user_id',ownerId);
      if(deleteError)throw deleteError;
      if(items.length) {
        const {error:insertError}=await supabaseClient.from(table).insert(items.map(data=>({candidate_post_id:row.id,user_id:ownerId,data})));
        if(insertError)throw insertError;
      }
    }));
    const failedChild=childResults.find(result=>result.status==='rejected');
    if(failedChild)throw failedChild.reason;
    if(previousCvPath&&previousCvPath!==cvPath&&previousCvPath.startsWith(`${ownerId}/cv/`)) {
      const {error:removeError}=await supabaseClient.storage.from('candidate-private-documents').remove([previousCvPath]);
      if(removeError)console.warn('Previous private CV could not be deleted:',removeError.message);
    }
  }
  const profile={...row,userId:ownerId,publicData,cvPath,cvName:candidateWizardFiles.cv?.name||d.cvName||d.privateData?.cv_name||'',privateData:{...(d.privateData||{}),cv_path:cvPath,cv_name:candidateWizardFiles.cv?.name||d.cvName||d.privateData?.cv_name||''}};
  currentCandidateProfile=profile;
  try {
    saveLocalCandidateProfiles([...localProfiles.filter(item=>item.userId!==ownerId),profile]);
  } catch(error) {
    console.warn('Candidate profile was published but local cache could not be saved:',error.name||'StorageError');
    toast('Profil sudah tersimpan online, tetapi cache perangkat penuh. Hapus sebagian data browser bila diperlukan.');
  }
  if(typeof renderAccountMenu==='function')renderAccountMenu();
  if(typeof refreshPublishedCandidateProfiles==='function')refreshPublishedCandidateProfiles().catch(error=>console.error('Published candidate profiles could not refresh:',error));
  sessionStorage.removeItem(CANDIDATE_DRAFT_KEY);
  candidateWizardData={...d,postId:row.id,username,cvPath,cvName:candidateWizardFiles.cv?.name||d.cvName||d.privateData?.cv_name||''};
  delete candidateWizardData.cvUrl;
  candidateQuickEdit=false;
  pendingCandidateQuickEdit=null;
  candidateWizardStep=14;
  if(publishRequested) {
    go('candidate-public',username);
    toast('Profil kandidat berhasil dipublikasikan.');
  } else {
    go('candidate-create-profile');
    toast('Profil disimpan sebagai draft. Publikasikan manual dari profil kandidat setelah dicek ulang.');
  }
}
async function loadCandidateProfile(username) {
  const local=getLocalCandidateProfiles().find(item=>item.username===username);
  if(!supabaseClient)return local||null;
  const {data,error}=await supabaseClient.from('candidate_posts')
    .select('id,username,full_name,main_position,category,location,work_status,job_types,salary_min,salary_max,skills,education_level,experience_years,about,profile_image_url,public_data,is_published,verified_candidate,created_at,updated_at')
    .eq('username',username).eq('is_published',true).maybeSingle();
  if(error)throw error;
  return data?{...data,publicData:data.public_data||{}}:local||null;
}
async function getPublicProfileById(postId) {
  const local=getLocalCandidateProfiles().find(item=>item.id===postId);
  if(!supabaseClient)return local||null;
  const {data,error}=await supabaseClient.from('candidate_posts')
    .select('id,username,full_name,main_position,category,location,work_status,job_types,salary_min,salary_max,skills,education_level,experience_years,about,profile_image_url,public_data,is_published,verified_candidate,created_at,updated_at')
    .eq('id',postId).eq('is_published',true).maybeSingle();
  if(error)throw error;
  return data?{...data,publicData:data.public_data||{}}:local||null;
}
function localProfileLikerId() {
  let id=localStorage.getItem('jobhub-profile-liker-id');
  if(!id) {
    id=crypto.randomUUID();
    localStorage.setItem('jobhub-profile-liker-id',id);
  }
  return id;
}
async function refreshCandidateProfileLikes(postId) {
  const button=$(`[data-candidate-like="${CSS.escape(postId)}"]`);
  if(!button)return;
  let count=0,liked=false;
  if(supabaseClient) {
    const {data:total,error}=await supabaseClient.rpc('get_candidate_profile_like_count',{p_candidate_post_id:postId});
    if(error)throw error;
    count=Number(total)||0;
    if(supabaseSession?.user?.id) {
      const {data,error:likeError}=await supabaseClient.from('candidate_profile_likes').select('candidate_post_id').eq('candidate_post_id',postId).eq('user_id',supabaseSession.user.id).maybeSingle();
      if(likeError)throw likeError;
      liked=Boolean(data);
    }
  } else {
    try {
      const likers=JSON.parse(localStorage.getItem(`jobhub-profile-likes-${postId}`)||'[]');
      const likerId=localProfileLikerId();
      count=Array.isArray(likers)?likers.length:0;
      liked=Array.isArray(likers)&&likers.includes(likerId);
    } catch {}
  }
  button.setAttribute('aria-pressed',String(liked));
  button.classList.toggle('liked',liked);
  button.querySelector('i')?.classList.toggle('fa-solid',liked);
  button.querySelector('i')?.classList.toggle('fa-regular',!liked);
  button.querySelector('[data-like-count]').textContent=String(count);
}
async function toggleCandidateProfileLike(postId) {
  if(supabaseClient) {
    if(!supabaseSession) {
      toast('Masuk untuk menyukai profil kandidat.');
      openAuthModal(false);
      return;
    }
    const userId=supabaseSession.user.id;
    const {data,error}=await supabaseClient.from('candidate_profile_likes').select('candidate_post_id').eq('candidate_post_id',postId).eq('user_id',userId).maybeSingle();
    if(error)throw error;
    const result=data
      ?await supabaseClient.from('candidate_profile_likes').delete().eq('candidate_post_id',postId).eq('user_id',userId)
      :await supabaseClient.from('candidate_profile_likes').insert({candidate_post_id:postId,user_id:userId});
    if(result.error)throw result.error;
  } else {
    const key=`jobhub-profile-likes-${postId}`;
    const likers=JSON.parse(localStorage.getItem(key)||'[]');
    const likerId=localProfileLikerId();
    localStorage.setItem(key,JSON.stringify(likers.includes(likerId)?likers.filter(item=>item!==likerId):[...likers,likerId]));
  }
  await refreshCandidateProfileLikes(postId);
}
function decorateCandidatePublicProfile(container,profile,data,isOwnProfile) {
  const contact=candidateSharedContact(data);
  const phoneDigits=String(contact.whatsapp||'').replace(/\D/g,'');
  const publicUrl=profile.username&&window.location.origin!=='null'
    ?`${window.location.origin}${window.location.pathname}#/candidate/${encodeURIComponent(profile.username)}`
    :'';
  const contactItems=[
    profile.location?`<span><i class="fa-solid fa-location-dot" aria-hidden="true"></i>${escapeHtml(profile.location)}</span>`:'',
    contact.email?`<a href="mailto:${encodeURIComponent(contact.email)}"><i class="fa-regular fa-envelope" aria-hidden="true"></i>${escapeHtml(contact.email)}</a>`:!isOwnProfile?'<span class="candidate-contact-private"><i class="fa-solid fa-lock" aria-hidden="true"></i>Email belum dibagikan</span>':'',
    phoneDigits?`<a href="https://wa.me/${phoneDigits}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i>${escapeHtml(contact.whatsapp)}</a>`:!isOwnProfile?'<span class="candidate-contact-private"><i class="fa-solid fa-lock" aria-hidden="true"></i>WhatsApp belum dibagikan</span>':'',
    publicUrl?`<a href="${escapeHtml(publicUrl)}"><i class="fa-solid fa-link" aria-hidden="true"></i>Tautan profil publik</a>`:''
  ].filter(Boolean);
  container.querySelector('.candidate-profile-identity .candidate-profile-location')?.remove();
  if(contactItems.length)container.querySelector('.candidate-profile-identity')?.insertAdjacentHTML('beforeend',`<div class="candidate-profile-contact">${contactItems.join('')}</div>`);
  const actions=container.querySelector('.candidate-public-actions');
  actions?.insertAdjacentHTML('afterbegin',`<button class="btn btn-outline candidate-profile-like ${isOwnProfile?'is-own-profile':''}" type="button" data-candidate-like="${escapeHtml(profile.id)}" aria-pressed="false" ${isOwnProfile?'disabled title="Anda tidak dapat menyukai profil sendiri."':''}><i class="fa-regular fa-heart" aria-hidden="true"></i> Suka <span data-like-count>0</span></button>`);
  refreshCandidateProfileLikes(profile.id).catch(error=>toast(`Jumlah suka tidak dapat dimuat: ${error.message||'terapkan skema Supabase.'}`));
  container.querySelectorAll('.candidate-profile-side-card').forEach(card=>{
    if(card.querySelector('h2')?.textContent.trim()==='Resume otomatis')card.remove();
  });
  const profileSections=[...container.querySelectorAll('.candidate-profile-section')];
  const sectionByTitle=title=>profileSections.find(section=>section.querySelector('h2')?.textContent.trim()===title);
  const cvSection=sectionByTitle('CV');
  if(isOwnProfile||isHrdSession()) {
    if(cvSection)cvSection.innerHTML=`<h2>CV</h2><p>CV disimpan secara privat. Tautan akses berlaku sementara.</p><button class="btn btn-outline btn-small" type="button" data-candidate-cv="${escapeHtml(profile.id)}"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Lihat / unduh CV</button>`;
  } else cvSection?.remove();
  const resumeButton=container.querySelector('[data-generate-resume]');
  if(resumeButton) {
    resumeButton.removeAttribute('data-generate-resume');
    resumeButton.dataset.route='candidate-resume-studio';
    resumeButton.innerHTML=`<i class="fa-solid fa-pen-ruler" aria-hidden="true"></i> ${isOwnProfile?'Edit CV & Resume':'Buat CV / Resume'}`;
  }
  const careerSection=sectionByTitle('Riwayat karier');
  const educationSection=sectionByTitle('Pendidikan');
  if(isOwnProfile) {
    sectionByTitle('CV')?.querySelector('h2')?.insertAdjacentHTML('afterend','<button class="candidate-profile-entry-edit candidate-profile-edit-cv" type="button" data-edit-candidate-step="9"><i class="fa-solid fa-file-pen" aria-hidden="true"></i> Edit CV</button>');
    careerSection?.querySelectorAll('.candidate-profile-entry').forEach((entry,index)=>{
      entry.insertAdjacentHTML('beforeend',`<button class="candidate-profile-entry-edit" type="button" data-edit-candidate-list="experience" data-edit-candidate-index="${index}" aria-label="Edit jabatan ${index+1}"><i class="fa-solid fa-pen" aria-hidden="true"></i> Edit jabatan</button>`);
    });
    educationSection?.querySelectorAll('.candidate-profile-entry').forEach((entry,index)=>{
      entry.insertAdjacentHTML('beforeend',`<button class="candidate-profile-entry-edit" type="button" data-edit-candidate-list="education" data-edit-candidate-index="${index}" aria-label="Edit pendidikan ${index+1}"><i class="fa-solid fa-pen" aria-hidden="true"></i> Edit pendidikan</button>`);
    });
    careerSection?.insertAdjacentHTML('beforeend','<button class="btn btn-outline candidate-profile-add-entry" type="button" data-add-candidate-list="experience"><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah jabatan</button>');
    educationSection?.insertAdjacentHTML('beforeend','<button class="btn btn-outline candidate-profile-add-entry" type="button" data-add-candidate-list="education"><i class="fa-solid fa-plus" aria-hidden="true"></i> Tambah pendidikan</button>');
  }
  const salaryMin=Number(profile.salary_min)||0;
  const salaryMax=Number(profile.salary_max)||0;
  const formatSalary=value=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(value);
  const salaryRange=salaryMin&&salaryMax?`${formatSalary(salaryMin)} – ${formatSalary(salaryMax)}`:salaryMin?`Mulai ${formatSalary(salaryMin)}`:salaryMax?`Maks. ${formatSalary(salaryMax)}`:'Belum ditentukan';
  const nextPositionRows=[
    ['Ketersediaan',data.workStatus||profile.work_status||'Belum ditentukan',1],
    ['Posisi yang dicari',[profile.main_position,data.alternativePosition].filter(Boolean).join(' · ')||'Belum ditentukan',2],
    ['Jenis pekerjaan yang diharapkan',(data.jobTypes||profile.job_types||[]).join(' · ')||'Belum ditentukan',2],
    ['Ekspektasi gaji',salaryRange,2],
    ['Lokasi yang diharapkan',profile.location||'Belum ditentukan',1],
    ['Hak bekerja',data.workAuthorization||'Belum ditentukan',1]
  ];
  const nextPositionSection=`<section class="candidate-profile-section candidate-next-position"><h2>Tentang jabatan Anda selanjutnya</h2><div class="candidate-next-position-list">${nextPositionRows.map(([label,value,step])=>`<div class="candidate-next-position-row"><div><strong>${escapeHtml(label)}</strong><p>${escapeHtml(value)}</p></div>${isOwnProfile?`<button type="button" data-edit-candidate-step="${step}" aria-label="Edit ${escapeHtml(label)}"><i class="fa-solid fa-pen" aria-hidden="true"></i></button>`:''}</div>`).join('')}</div></section>`;
  const cvAnchor=sectionByTitle('CV');
  const profileAnchor=cvAnchor?.isConnected?cvAnchor:profileSections.find(section=>section.isConnected);
  if(profileAnchor)profileAnchor.insertAdjacentHTML('beforebegin',nextPositionSection);
  else container.insertAdjacentHTML('beforeend',nextPositionSection);
  const strengthCard=[...container.querySelectorAll('.candidate-profile-side-card')].find(card=>card.querySelector('h2')?.textContent.trim()==='Kekuatan profil');
  if(strengthCard) {
    const strength=getCandidateProfileStrengthState(profile);
    const state=strength.complete?'complete':'incomplete';
    strengthCard.dataset.strength=state;
    const meter=strengthCard.querySelector('.candidate-profile-strength');
    if(meter) {
      meter.dataset.strength=state;
      const bar=meter.querySelector('span');
      if(bar)bar.style.width=`${strength.percent}%`;
    }
    const label=[...strengthCard.querySelectorAll('strong')].find(item=>/^\d+%/.test(item.textContent.trim()));
    if(label)label.textContent=`${strength.percent}% ${strength.complete?'kuat':'lengkap'}`;
  }
  if(isOwnProfile&&strengthCard) {
    strengthCard.insertAdjacentHTML('beforeend','<button class="btn btn-outline candidate-update-career" type="button" data-edit-candidate-section="experience"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Perbarui riwayat karier</button><button class="candidate-next-tip" type="button" data-edit-candidate-section="experience">Tip berikutnya <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button>');
    strengthCard.insertAdjacentHTML('afterend','<section class="candidate-profile-side-card candidate-discovery-card"><strong>Jelajahi berbagai profil</strong><p>Temukan inspirasi dan peluang baru melalui profil kandidat publik.</p><button class="text-link" type="button" data-route="candidate-feed">Jelajahi profil <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></button></section>');
  }
  if(!isOwnProfile)container.querySelectorAll('.candidate-profile-side-card').forEach(card=>{
    const heading=card.querySelector('h2')?.textContent.trim();
    if(['Visibilitas profil','Kekuatan profil'].includes(heading))card.remove();
  });
}
async function renderCandidatePublicProfile(username) {
  const container=$('#candidatePublicContent');
  const requestId=++candidatePublicProfileRequestId;
  container.setAttribute('aria-busy','true');
  container.innerHTML=loadingIndicator('Memuat profil kandidat...');
  try {
    const profile=await loadCandidateProfile(username);
    if(requestId!==candidatePublicProfileRequestId||!container.isConnected)return;
    if(!profile) {
      container.innerHTML='<div class="empty-state"><strong>Profil kandidat tidak ditemukan</strong>Profil mungkin belum dipublikasikan atau sudah dihapus.</div>';
      return;
    }
    if(supabaseClient&&candidatePublicProfileChannelKey!==profile.id) {
      if(candidatePublicProfileChannel)await supabaseClient.removeChannel(candidatePublicProfileChannel);
      candidatePublicProfileChannelKey=profile.id;
      candidatePublicProfileChannel=supabaseClient.channel(`candidate-profile-${profile.id}`)
        .on('postgres_changes',{event:'*',schema:'public',table:'candidate_posts',filter:`id=eq.${profile.id}`},payload=>{
          if(payload.eventType==='DELETE'||payload.new?.is_published===false) {
            container.innerHTML='<div class="empty-state"><strong>Profil kandidat tidak lagi dipublikasikan</strong>Halaman ini tidak tersedia untuk umum.</div>';
            return;
          }
          renderCandidatePublicProfile(username);
        })
        .subscribe((status,error)=>{
          if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')toast(`Profil kandidat tidak dapat diperbarui realtime: ${error?.message||status}`);
        });
    }
    const d=profile.publicData||profile.public_data||{};
    let isOwnProfile=Boolean(isCandidateSession()&&(profile.user_id===supabaseSession?.user?.id||profile.userId===supabaseSession?.user?.id));
    if(!isOwnProfile&&supabaseClient&&isCandidateSession()) {
      const {data:ownedProfile,error:ownerError}=await supabaseClient.from('candidate_posts')
        .select('id').eq('id',profile.id).eq('user_id',supabaseSession.user.id).maybeSingle();
      if(ownerError)console.warn('Candidate profile ownership could not be confirmed:',ownerError.message);
      else isOwnProfile=Boolean(ownedProfile);
    }
    if(isOwnProfile) {
      const {data:privateRow,error:privateError}=await supabaseClient.from('candidate_post_private')
        .select('private_data').eq('user_id',supabaseSession.user.id).maybeSingle();
      if(privateError)console.warn('Owner CV metadata could not be loaded:',privateError.message);
      profile.privateData=privateRow?.private_data||{};
      profile.cvPath=profile.privateData.cv_path||'';
      profile.cvName=profile.privateData.cv_name||'';
      currentCandidateProfile={...profile,userId:profile.userId||profile.user_id||currentCandidateOwnerId(),publicData:d};
    }
    if(supabaseClient) {
      const {data:badgeRows,error:badgeError}=await supabaseClient.from('candidate_badges').select('badge').eq('candidate_post_id',profile.id);
      if(badgeError)console.warn('Optional candidate badges unavailable:',badgeError.message);
      d.badges=badgeError?[]:(badgeRows||[]).map(row=>row.badge);
    }
    if(requestId!==candidatePublicProfileRequestId||!container.isConnected)return;
    candidateSearchCache=[profile,...candidateSearchCache.filter(item=>item.id!==profile.id)];
    const education=candidateArray(d.education).filter(item=>item&&typeof item==='object');
    const experience=candidateArray(d.experience).filter(item=>item&&typeof item==='object');
    const skills=Array.isArray(profile.skills)?profile.skills:Array.isArray(d.skills)?d.skills:[];
    const badges=[...new Set([d.workStatus||profile.work_status,...(profile.verified_candidate?['Verified Candidate']:[]),...(d.workStatus==='Fresh Graduate'||(education.length>0&&experience.length===0&&profile.experience_years===0)?['Fresh Graduate']:profile.experience_years>=3?['Experienced']:[]),...candidateArray(d.badges)])];
    const canManage=Boolean(supabaseClient&&isHrdSession());
    const imageUrl=candidateSafeImageUrl(profile.profile_image_url||d.profileImageUrl);
    const coverUrl=candidateSafeImageUrl(d.coverImageUrl||d.cover_image_url);
    const cvUrl='';
    const completion=candidateProfileCompletionState(profile);
    const workPreferences=[...candidateArray(d.jobTypes),...candidateArray(d.preferences?.workHours),...candidateArray(d.preferences?.workModes)];
    const portfolioLinks=[...candidateArray(d.portfolio),...candidateArray(d.socialLinks)].filter(item=>item&&typeof item==='object').map(item=>{
      const url=candidateSafeHttpUrl(item.url);
      return url?`<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.label)}</a></p>`:'';
    }).join('');
    const portfolioFiles=candidateArray(d.portfolioFiles).filter(item=>item&&typeof item==='object').map(item=>{
      const url=candidateSafeHttpUrl(item.url);
      if(!url)return '';
      return /\.(mp4)$/i.test(item.name||'')
        ?`<video controls preload="metadata" src="${escapeHtml(url)}" aria-label="${escapeHtml(item.name||'Video portfolio')}"></video>`
        :/\.(jpe?g|png)$/i.test(item.name||'')
          ?`<a href="${escapeHtml(url)}" target="_blank" rel="noopener"><img class="candidate-portfolio-image" src="${escapeHtml(url)}" alt="${escapeHtml(item.name||'Foto portfolio')}"></a>`
          :`<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.name||'Lihat portfolio')}</a></p>`;
    }).join('');
    const certificateFiles=candidateArray(d.certificateFiles).filter(item=>item&&typeof item==='object').map(item=>{
      const url=candidateSafeHttpUrl(item.url);
      return url?`<p><a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(item.name||'Lihat sertifikat')}</a></p>`:'';
    }).join('');
    const experienceCards=experience.map(item=>{
      const range=[candidateResumeDate(item.startDate),item.endDate?candidateResumeDate(item.endDate):d.currentlyWorking?'Sekarang':''].filter(Boolean).join(' – ');
      return `<article class="candidate-profile-entry"><h3>${escapeHtml(item.position||'Pengalaman kerja')}</h3><p class="candidate-profile-entry-meta">${escapeHtml(item.company||'')}${item.location?` · ${escapeHtml(item.location)}`:''}</p>${range?`<p class="candidate-profile-entry-date">${escapeHtml(range)}</p>`:''}${item.description?`<p>${escapeHtml(item.description)}</p>`:''}</article>`;
    }).join('');
    const educationCards=education.map(item=>{
      const range=[item.startYear,item.endYear||(d.educationStillStudying?'Saat ini':'')].filter(Boolean).join(' – ');
      return `<article class="candidate-profile-entry"><h3>${escapeHtml(item.level||'Pendidikan')}</h3><p class="candidate-profile-entry-meta">${escapeHtml(item.school||'')}${item.major?` · ${escapeHtml(item.major)}`:''}</p>${range?`<p class="candidate-profile-entry-date">${escapeHtml(range)}</p>`:''}${item.gpa?`<p>IPK ${escapeHtml(item.gpa)}</p>`:''}</article>`;
    }).join('');
    const languages=candidateArray(d.languages).filter(item=>item&&typeof item==='object').map(item=>`<span>${escapeHtml(item.language||'')}${item.level?` · ${escapeHtml(item.level)}`:''}</span>`).join('');
    const certificates=candidateArray(d.certificates).filter(item=>item&&typeof item==='object').map(item=>`<article class="candidate-profile-entry"><h3>${escapeHtml(item.name||'Sertifikat')}</h3>${item.issuer?`<p class="candidate-profile-entry-meta">${escapeHtml(item.issuer)}</p>`:''}${item.date?`<p class="candidate-profile-entry-date">${escapeHtml(candidateResumeDate(item.date))}</p>`:''}</article>`).join('');
    container.innerHTML=`<article class="candidate-public-card candidate-profile-showcase">${coverUrl?`<img class="candidate-public-cover" src="${escapeHtml(coverUrl)}" alt="Foto sampul ${escapeHtml(profile.full_name)}">`:'<div class="candidate-public-cover candidate-public-cover-default" aria-hidden="true"></div>'}<div class="candidate-profile-layout"><main class="candidate-profile-main"><header class="candidate-public-head">${imageUrl?`<img class="candidate-public-photo" src="${escapeHtml(imageUrl)}" alt="Foto ${escapeHtml(profile.full_name)}">`:'<div class="candidate-public-photo candidate-placeholder" aria-label="Foto profil belum ditambahkan"><i class="fa-solid fa-user" aria-hidden="true"></i></div>'}<div class="candidate-profile-identity"><div class="candidate-public-badges">${badges.map(badge=>`<span>${escapeHtml(badge)}</span>`).join('')}</div><h1>${escapeHtml(profile.full_name||'Kandidat')}</h1><p class="candidate-profile-position">${escapeHtml(profile.main_position||'Posisi belum dicantumkan')}</p><p class="candidate-profile-location"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${escapeHtml(profile.location||'Lokasi belum diisi')}</p><p class="candidate-profile-meta">${escapeHtml(profile.experience_years?`${profile.experience_years} tahun pengalaman`:d.workStatus==='Fresh Graduate'?'Fresh Graduate':'Pengalaman belum ditambahkan')} · ${escapeHtml(profile.education_level||'Pendidikan belum ditambahkan')}</p></div></header><div class="candidate-public-actions">${isOwnProfile?'<button class="btn btn-outline" type="button" data-route="candidate-create-profile"><i class="fa-solid fa-pen-to-square" aria-hidden="true"></i> Edit Profil</button>':''}<button class="btn candidate-resume-button" type="button" data-generate-resume="${escapeHtml(profile.id)}"><i class="fa-solid fa-file-arrow-down" aria-hidden="true"></i> Buat Resume Otomatis</button>${!isOwnProfile?`<button class="btn btn-outline" type="button" data-chat-candidate="${escapeHtml(profile.id)}">Chat Kandidat</button>`:''}${canManage?`<button class="btn btn-outline" type="button" data-invite-candidate="${escapeHtml(profile.id)}">Undang Interview</button><button class="btn btn-outline" type="button" data-bookmark-candidate="${escapeHtml(profile.id)}">Simpan Kandidat</button><button class="btn btn-outline" type="button" data-talent-candidate="${escapeHtml(profile.id)}">Tambah ke Talent Pool</button>`:''}</div><section class="candidate-profile-section"><span class="candidate-profile-section-kicker">Profil profesional</span><h2>Ringkasan pribadi</h2><p class="candidate-profile-about">${escapeHtml(profile.about||'Kandidat belum menambahkan ringkasan pribadi.')}</p></section><section class="candidate-profile-section"><h2>Keahlian utama</h2><div class="candidate-profile-skills">${skills.map(skill=>`<span>${escapeHtml(skill)}</span>`).join('')||'<p class="form-note">Keahlian belum ditambahkan.</p>'}</div></section><section class="candidate-profile-section"><h2>Riwayat karier</h2>${experienceCards||'<p class="candidate-profile-empty">Tambahkan pengalaman kerja untuk menunjukkan kontribusi dan pencapaian Anda.</p>'}</section><section class="candidate-profile-section"><h2>Pendidikan</h2>${educationCards||'<p class="candidate-profile-empty">Tambahkan pendidikan terakhir dan bidang studi Anda.</p>'}</section>${languages?`<section class="candidate-profile-section"><h2>Bahasa</h2><div class="candidate-profile-tags">${languages}</div></section>`:''}${certificates||certificateFiles?`<section class="candidate-profile-section"><h2>Sertifikasi</h2>${certificates}${certificateFiles}</section>`:''}${workPreferences.length?`<section class="candidate-profile-section"><h2>Preferensi kerja</h2><div class="candidate-profile-tags">${workPreferences.map(item=>`<span>${escapeHtml(item)}</span>`).join('')}</div></section>`:''}${portfolioLinks||portfolioFiles?`<section class="candidate-profile-section"><h2>Portfolio</h2><div class="candidate-profile-portfolio">${portfolioLinks}${portfolioFiles}</div></section>`:''}<section class="candidate-profile-section"><h2>CV</h2>${cvUrl?`<div class="candidate-profile-uploaded-cv"><p>${escapeHtml(d.cvName||'CV PDF terunggah')}</p>${renderCandidateCvActions(cvUrl,d.cvName||'CV.pdf')}</div>`:'<p class="candidate-profile-empty">Belum ada CV yang diunggah. Anda tetap dapat membuat resume otomatis dari profil ini.</p>'}</section></main><aside class="candidate-profile-aside"><section class="candidate-profile-side-card"><h2>Visibilitas profil</h2><p class="candidate-profile-public-status"><i class="fa-solid fa-globe" aria-hidden="true"></i> Profil publik dan dapat ditemukan HRD</p><p>Informasi pribadi hanya ditampilkan jika Anda memilih untuk membagikannya.</p></section><section class="candidate-profile-side-card"><h2>Kekuatan profil</h2><div class="candidate-profile-strength"><span style="width:${completion.percent}%"></span></div><strong>${completion.percent}% lengkap</strong><p>Profil yang lengkap membantu HRD memahami keahlian dan pengalaman Anda dengan cepat.</p>${isOwnProfile&&!completion.complete?`<ul class="candidate-profile-tips">${completion.checks.filter(item=>!item.complete).slice(0,3).map(item=>`<li><i class="fa-solid fa-circle-plus" aria-hidden="true"></i> Tambahkan ${escapeHtml(item.label.toLowerCase())}</li>`).join('')}</ul>`:''}${isOwnProfile?'<button class="btn btn-outline" type="button" data-route="candidate-create-profile">Tingkatkan profil</button>':''}</section><section class="candidate-profile-side-card candidate-profile-resume-card"><h2>Resume otomatis</h2><p>Buat resume profesional dari profil, pengalaman, pendidikan, dan keahlian Anda. Perbarui profil kapan saja untuk membuat versi terbaru.</p><button class="btn" type="button" data-generate-resume="${escapeHtml(profile.id)}"><i class="fa-solid fa-file-pdf" aria-hidden="true"></i> Buat Resume Otomatis</button><small>Gunakan opsi “Simpan sebagai PDF” pada jendela cetak.</small></section><section class="candidate-profile-side-card"><h2>Status kandidat</h2><p>${escapeHtml(d.workStatus||profile.work_status||'Open To Work')}</p><p>${escapeHtml(workPreferences.join(' · ')||'Tambahkan preferensi kerja yang Anda inginkan.')}</p></section></aside></div></article>`;
    decorateCandidatePublicProfile(container,profile,d,isOwnProfile);
    candidateSearchCache=[profile,...candidateSearchCache.filter(item=>item.id!==profile.id)];
    const viewerId=supabaseSession?.user?.id||'';
    const viewKey=`${viewerId}:${profile.id}`;
    let alreadyViewed=candidateViewedProfiles.has(viewKey);
    try {
      alreadyViewed=alreadyViewed||sessionStorage.getItem(`jobhub-candidate-viewed:${viewKey}`)==='true';
    } catch {}
    if(supabaseClient&&isHrdSession()&&!alreadyViewed&&requestId===candidatePublicProfileRequestId) {
      candidateViewedProfiles.add(viewKey);
      try {sessionStorage.setItem(`jobhub-candidate-viewed:${viewKey}`,'true');} catch {}
      const {error}=await supabaseClient.from('candidate_views').insert({candidate_post_id:profile.id,viewer_id:viewerId});
      if(error)console.warn('Candidate profile view could not be recorded:',error.message);
    }
  } catch(error) {
    if(requestId===candidatePublicProfileRequestId&&container.isConnected)container.innerHTML=`<p role="alert" class="cv-analysis-error">Profil tidak dapat dimuat: ${escapeHtml(error.message||'periksa koneksi dan kebijakan Supabase.')}</p>`;
  } finally {
    if(requestId===candidatePublicProfileRequestId&&container.isConnected)container.setAttribute('aria-busy','false');
  }
}
async function openCandidateInterviewInvite(postId) {
  if(!supabaseClient||!isHrdSession()||!canManageCandidates())return toast('Hanya Owner atau HR Manager yang dapat mengundang kandidat interview.');
  const profile=candidateSearchCache.find(item=>item.id===postId)||getLocalCandidateProfiles().find(item=>item.id===postId)||await getPublicProfileById(postId);
  if(!profile)return toast('Profil kandidat tidak ditemukan.');
  const now=new Date();
  const dateMinimum=new Date(now.getTime()-now.getTimezoneOffset()*60000).toISOString().slice(0,10);
  openModal('Undang interview kandidat',`<form><p class="form-note">Kandidat: <strong>${escapeHtml(profile.full_name)}</strong>. Demo lokal hanya mencatat undangan di browser ini.</p><div class="form-row"><label>Tahap interview</label><select name="interviewType"><option>Interview</option><option>Final Interview</option><option>Technical Test</option></select></div><div class="candidate-form-grid"><div class="form-row"><label>Tanggal</label><input name="date" type="date" min="${dateMinimum}" required></div><div class="form-row"><label>Waktu</label><input name="time" type="time" required></div></div><div class="form-row"><label>Link meeting</label><input name="meetingUrl" type="url" placeholder="https://meet.google.com/..."></div><div class="form-row"><label>Catatan</label><textarea name="notes" maxlength="1000"></textarea></div><button class="btn" type="submit">Kirim undangan</button></form>`,async data=>{
    const date=String(data.get('date')||''),time=String(data.get('time')||'');
    const [year,month,day]=date.split('-').map(Number);
    const [hour,minute]=time.split(':').map(Number);
    const startDate=new Date(year,month-1,day,hour,minute);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!/^\d{2}:\d{2}$/.test(time)
      ||startDate.getFullYear()!==year||startDate.getMonth()!==month-1||startDate.getDate()!==day
      ||startDate.getHours()!==hour||startDate.getMinutes()!==minute||startDate<=new Date()) {
      return toast('Pilih jadwal interview yang valid dan akan datang.');
    }
    const meetingUrl=String(data.get('meetingUrl')||'').trim();
    if(meetingUrl&&!candidateSafeHttpUrl(meetingUrl))return toast('Link meeting harus menggunakan HTTP atau HTTPS.');
    const startsAt=startDate.toISOString();
    const invite={id:crypto.randomUUID(),candidate_post_id:profile.id,company_user_id:supabaseSession?.user?.id||'demo-company',company_name:getCurrentCompanyName(),interview_type:String(data.get('interviewType')),starts_at:startsAt,meeting_url:meetingUrl,notes:String(data.get('notes')||''),status:'invited',created_at:new Date().toISOString()};
    if(supabaseClient) {
      const {error}=await supabaseClient.from('candidate_interview_invites').insert(invite);
      if(error)throw error;
    } else {
      const invites=JSON.parse(localStorage.getItem('jobhub-candidate-profile-invites')||'[]');
      invites.unshift(invite);
      localStorage.setItem('jobhub-candidate-profile-invites',JSON.stringify(invites));
    }
    closeModal();toast(`Undangan interview dicatat untuk ${profile.full_name}.`);
  });
}
async function renderCandidateProfileInvites() {
  const container=$('#candidateProfileInvitations');
  if(!container)return;
  if(!isCandidateSession()&&!supabaseClient) {
    const localProfiles=getLocalCandidateProfiles().filter(item=>item.userId===currentCandidateOwnerId());
    if(!localProfiles.length) {
      container.innerHTML='';return;
    }
  }
  let profile=getLocalCandidateProfiles().find(item=>item.userId===currentCandidateOwnerId())||null;
  if(supabaseClient&&isCandidateSession()) {
    const {data,error}=await supabaseClient.from('candidate_posts').select('id').eq('user_id',currentCandidateOwnerId()).maybeSingle();
    if(error)throw error;
    if(data)profile={id:data.id};
  }
  if(!profile) {
    container.innerHTML='';return;
  }
  let invites=[];
  if(supabaseClient) {
    const {data,error}=await supabaseClient.from('candidate_interview_invites').select('*').eq('candidate_post_id',profile.id).order('created_at',{ascending:false});
    if(error)throw error;
    invites=data||[];
    if(candidateProfileInviteChannel)await supabaseClient.removeChannel(candidateProfileInviteChannel);
    candidateProfileInviteChannel=supabaseClient.channel(`candidate-profile-invites-${profile.id}`)
      .on('postgres_changes',{event:'*',schema:'public',table:'candidate_interview_invites',filter:`candidate_post_id=eq.${profile.id}`},()=>renderCandidateProfileInvites().catch(error=>toast(`Undangan kandidat gagal diperbarui: ${error.message||'coba lagi.'}`)))
      .subscribe((status,error)=>{
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')toast(`Undangan kandidat tidak dapat diperbarui realtime: ${error?.message||status}`);
      });
  } else invites=JSON.parse(localStorage.getItem('jobhub-candidate-profile-invites')||'[]').filter(invite=>invite.candidate_post_id===profile.id);
  container.innerHTML=`<section class="interview-notifications"><div class="section-head"><div><h2>Undangan interview dari perusahaan</h2><p>Undangan yang dikirim untuk profil publikmu.</p></div><span class="kanban-count">${invites.length}</span></div>${invites.length?invites.map(invite=>`<article class="candidate-profile-invite"><strong>${escapeHtml(invite.company_name)}</strong><p>${escapeHtml(invite.interview_type)} · ${escapeHtml(new Intl.DateTimeFormat('id-ID',{dateStyle:'full',timeStyle:'short'}).format(new Date(invite.starts_at)))}</p>${invite.meeting_url?`<a href="${escapeHtml(invite.meeting_url)}" target="_blank" rel="noopener">Buka link meeting</a>`:''}<p>${escapeHtml(invite.notes||'')}</p><span class="candidate-status-badge">${escapeHtml(invite.status||'invited')}</span></article>`).join(''):'<p class="form-note">Belum ada undangan interview melalui profil publik.</p>'}</section>`;
}
function applyCandidateSearchFilters(profiles) {
  const form=$('#candidateSearchForm');
  const query=String(form.elements.query.value||'').trim().toLowerCase();
  const location=String(form.elements.location.value||'').trim().toLowerCase();
  const education=form.elements.education.value;
  const status=form.elements.workStatus.value;
  return profiles.filter(profile=>{
    const d=profile.publicData||profile.public_data||{};
    const searchText=[profile.full_name,profile.main_position,...candidateArray(profile.skills),...candidateArray(d.languages).filter(item=>item&&typeof item==='object').map(item=>item.language),...candidateArray(d.certificates).filter(item=>item&&typeof item==='object').map(item=>item.name)].join(' ').toLowerCase();
    if(query&&!searchText.includes(query))return false;
    if(location&&!String(profile.location||'').toLowerCase().includes(location))return false;
    if(education&&profile.education_level!==education)return false;
    if(status&&(profile.work_status||d.workStatus)!==status)return false;
    const min=Number(form.elements.salaryMin.value)||0,max=Number(form.elements.salaryMax.value)||Infinity;
    if(profile.salary_min!=null&&profile.salary_min>max)return false;
    if(profile.salary_max!=null&&profile.salary_max<min)return false;
    const experience=Number(form.elements.experience.value)||0;
    if(Number(profile.experience_years||0)<experience)return false;
    const jobType=form.elements.jobType.value;
    if(jobType&&!(profile.job_types||d.jobTypes||[]).includes(jobType))return false;
    return true;
  });
}
async function loadCandidateSearchProfiles() {
  if(candidateSearchProfilesLoaded)return;
  if(candidateSearchLoadPromise)return candidateSearchLoadPromise;
  const version=candidateSearchDataVersion;
  const promise=(async()=>{
    let profiles;
    if(supabaseClient) {
      const {data,error}=await supabaseClient.from('candidate_posts').select('id,username,full_name,main_position,category,location,work_status,job_types,salary_min,salary_max,skills,education_level,experience_years,about,profile_image_url,public_data,verified_candidate').eq('is_published',true).order('updated_at',{ascending:false}).limit(200);
      if(error)throw error;
      profiles=data||[];
    } else profiles=getLocalCandidateProfiles().filter(profile=>profile.is_published);
    if(version===candidateSearchDataVersion) {
      candidateSearchCache=profiles;
      candidateSearchProfilesLoaded=true;
    }
  })();
  candidateSearchLoadPromise=promise;
  try {
    await promise;
  } finally {
    if(candidateSearchLoadPromise===promise)candidateSearchLoadPromise=null;
  }
}
function renderCandidateSearch() {
  const results=$('#candidateSearchResults');
  if(!results)return;
  const requestId=++candidateSearchRequestId;
  if(supabaseClient&&!candidateSearchChannel) {
    candidateSearchChannel=supabaseClient.channel('published-candidate-search')
      .on('postgres_changes',{event:'*',schema:'public',table:'candidate_posts'},()=>{
        candidateSearchDataVersion++;
        candidateSearchProfilesLoaded=false;
        candidateSearchLoadPromise=null;
        renderCandidateSearch();
      })
      .subscribe((status,error)=>{
        if(status==='CHANNEL_ERROR'||status==='TIMED_OUT')toast(`Profil kandidat tidak dapat diperbarui realtime: ${error?.message||status}`);
      });
  }
  if(supabaseClient&&!isHrdSession()) {
    results.innerHTML='<div class="empty-state"><strong>Masuk sebagai HRD</strong>Pencarian kandidat tersedia untuk akun perusahaan.</div>';
    results.setAttribute('aria-busy','false');
    return;
  }
  results.setAttribute('aria-busy','true');
  results.innerHTML=loadingIndicator('Memuat profil publik...');
  const load=async()=>{
    await loadCandidateSearchProfiles();
    if(requestId!==candidateSearchRequestId||!results.isConnected)return;
    const filtered=applyCandidateSearchFilters(candidateSearchCache);
    results.innerHTML=filtered.length?filtered.map(profile=>`<article class="candidate-search-card">${candidateSafeImageUrl(profile.profile_image_url||profile.publicData?.profileImageUrl)?`<img src="${escapeHtml(candidateSafeImageUrl(profile.profile_image_url||profile.publicData?.profileImageUrl))}" alt="">`:'<div class="candidate-preview-photo candidate-placeholder" aria-label="Foto belum ditambahkan"><i class="fa-solid fa-user" aria-hidden="true"></i></div>'}<div><h2>${escapeHtml(profile.full_name)}</h2><p>${escapeHtml(profile.main_position)} · ${escapeHtml(profile.location||'')}</p><p>${profile.experience_years?`${escapeHtml(profile.experience_years)} tahun pengalaman`:'Pengalaman belum ditambahkan'} · ${escapeHtml(profile.education_level||'Pendidikan belum ditambahkan')}</p><div class="skill-list">${(profile.skills||[]).slice(0,5).map(skill=>`<span>${escapeHtml(skill)}</span>`).join('')}</div><a class="btn btn-outline btn-small" href="#/candidate/${encodeURIComponent(profile.username)}" data-candidate-profile="${escapeHtml(profile.username)}">Lihat profil</a></div></article>`).join(''):'<div class="empty-state"><strong>Belum ada kandidat cocok</strong>Ubah kata kunci atau filter pencarian.</div>';
  };
  load().catch(error=>{
    if(requestId===candidateSearchRequestId&&results.isConnected)results.innerHTML=`<p role="alert" class="cv-analysis-error">Pencarian kandidat gagal: ${escapeHtml(error.message||'periksa Supabase.')}</p>`;
  }).finally(()=>{
    if(requestId===candidateSearchRequestId&&results.isConnected)results.setAttribute('aria-busy','false');
  });
}
function scheduleCandidateSearch(delay=300) {
  window.clearTimeout(candidateSearchTimer);
  candidateSearchTimer=window.setTimeout(()=>renderCandidateSearch(),delay);
}
window.addEventListener('jobhub-route-change',event=>{
  const route=event.detail?.route;
  if(route!=='candidate-feed')closeCandidateFeedDetail();
  if(route!=='candidate-search') {
    window.clearTimeout(candidateSearchTimer);
    candidateSearchRequestId++;
    candidateSearchDataVersion++;
    candidateSearchProfilesLoaded=false;
    candidateSearchLoadPromise=null;
    if(candidateSearchChannel)supabaseClient?.removeChannel(candidateSearchChannel);
    candidateSearchChannel=null;
  }
  if(route!=='candidate-public') {
    candidatePublicProfileRequestId++;
    if(candidatePublicProfileChannel)supabaseClient?.removeChannel(candidatePublicProfileChannel);
    candidatePublicProfileChannel=null;
    candidatePublicProfileChannelKey='';
  }
  if(route!=='candidate') {
    if(candidateProfileInviteChannel)supabaseClient?.removeChannel(candidateProfileInviteChannel);
    candidateProfileInviteChannel=null;
  }
});
async function saveCandidateBookmark(postId) {
  if(!supabaseClient||!isHrdSession()||!canManageCandidates())return toast('Hanya Owner atau HR Manager yang dapat menyimpan kandidat.');
  const profile=candidateSearchCache.find(item=>item.id===postId)||getLocalCandidateProfiles().find(item=>item.id===postId)||await getPublicProfileById(postId);
  if(!profile)return toast('Profil kandidat tidak ditemukan.');
  openModal('Simpan kandidat',`<form><p class="form-note">Tambahkan catatan privat untuk ${escapeHtml(profile.full_name)}.</p><div class="form-row"><label>Catatan internal</label><textarea name="notes" maxlength="1000" placeholder="Catatan hanya terlihat oleh tim perusahaan"></textarea></div><button class="btn" type="submit">Simpan kandidat</button></form>`,async data=>{
    const notes=String(data.get('notes')||'').trim();
    if(supabaseClient) {
      if(!isHrdSession())return toast('Masuk sebagai HRD untuk menyimpan kandidat.');
      const {error}=await supabaseClient.from('candidate_bookmarks').upsert({candidate_post_id:postId,company_user_id:supabaseSession.user.id,notes},{onConflict:'candidate_post_id,company_user_id'});
      if(error)throw error;
    } else {
      const list=JSON.parse(localStorage.getItem('jobhub-candidate-bookmarks')||'[]').filter(item=>item.id!==postId);
      list.push({id:postId,notes});
      localStorage.setItem('jobhub-candidate-bookmarks',JSON.stringify(list));
    }
    closeModal();toast('Kandidat tersimpan dengan catatan privat.');
  });
}
async function addPublicCandidateToTalentPool(postId) {
  if(!supabaseClient||!isHrdSession()||!canManageCandidates())return toast('Hanya Owner atau HR Manager yang dapat mengelola Talent Pool.');
  const profile=candidateSearchCache.find(item=>item.id===postId)||getLocalCandidateProfiles().find(item=>item.id===postId)||await getPublicProfileById(postId);
  if(!profile)return toast('Profil kandidat tidak ditemukan.');
  const d=profile.publicData||profile.public_data||{};
  const candidate={id:`TALENT-${postId}`,candidateId:profile.userId||postId,candidateName:profile.full_name,candidateEmail:candidateSharedContact(d).email||'',skills:profile.skills||[],experienceYears:Number(profile.experience_years)||0,education:profile.education_level||'',category:profile.category||'Umum',notes:`Profil publik: #/candidate/${profile.username}`,addedAt:new Date().toISOString()};
  const list=getTalentPool().filter(item=>item.candidateId!==candidate.candidateId);
  list.unshift(candidate);
  if(supabaseClient) {
    if(!isHrdSession())return toast('Masuk sebagai HRD untuk menggunakan Talent Pool.');
    try {
      await syncTalentPoolToSupabase(candidate);
    } catch(error) {
      toast(`Kandidat tidak dapat ditambahkan ke Talent Pool: ${error.message||'periksa koneksi.'}`);
      return;
    }
  }
  saveTalentPool(list);renderTalentPool();toast('Kandidat ditambahkan ke Talent Pool.');
}
document.addEventListener('click',event=>{
  const inviteChat=event.target.closest('[data-candidate-invite-chat]');
  if(inviteChat) {
    inviteCandidateProfileToChat(inviteChat.dataset.candidateInviteChat).catch(error=>toast(`Ajakan chat gagal dikirim: ${error.message||'periksa koneksi Supabase.'}`));
    return;
  }
  const rankCandidate=event.target.closest('[data-candidate-rank]');
  if(rankCandidate) {
    rateCandidatePrivately(rankCandidate.dataset.candidateRank).catch(error=>toast(`Peringkat kandidat gagal: ${error.message||'periksa migration Supabase.'}`));
    return;
  }
  const cvButton=event.target.closest('[data-candidate-cv]');
  if(cvButton) {
    cvButton.disabled=true;
    const tab=window.open('about:blank','_blank');
    if(tab)tab.opener=null;
    requestCandidateCv(cvButton.dataset.candidateCv).then(result=>{
      if(tab)tab.location.replace(result.signedUrl);
      else toast('Izinkan pop-up untuk membuka CV privat.');
    }).catch(error=>{
      tab?.close();
      toast(`CV tidak dapat diakses: ${error.message||'periksa izin kandidat atau HRD.'}`);
    }).finally(()=>{if(cvButton.isConnected)cvButton.disabled=false;});
    return;
  }
  const like=event.target.closest('[data-candidate-like]');
  if(like) {
    like.disabled=true;
    toggleCandidateProfileLike(like.dataset.candidateLike).then(()=>toast(like.getAttribute('aria-pressed')==='true'?'Anda menyukai profil ini.':'Suka dibatalkan.')).catch(error=>toast(`Suka profil gagal disimpan: ${error.message||'periksa skema candidate_profile_likes.'}`)).finally(()=>{if(like.isConnected)like.disabled=false;});
    return;
  }
  const candidateCard=event.target.closest('[data-open-candidate]');
  if(candidateCard&&!event.target.closest('a,button,summary,details,input,textarea,select,video')) {
    openCandidateFeedDetail(candidateCard);
    return;
  }
  const profileLink=event.target.closest('[data-candidate-profile]');
  if(profileLink) {
    event.preventDefault();closeCandidateFeedDetail();go('candidate-public',profileLink.dataset.candidateProfile);return;
  }
  const route=event.target.closest('[data-route]');
  if(route&&route.dataset.route==='candidate-create-profile') {
    event.preventDefault();go('candidate-create-profile');return;
  }
  const addCandidateList=event.target.closest('[data-add-candidate-list]');
  if(addCandidateList) {
    const key=addCandidateList.dataset.addCandidateList;
    startCandidateQuickEdit(key==='experience'?5:4,key,true);
    return;
  }
  const editCandidateList=event.target.closest('[data-edit-candidate-list]');
  if(editCandidateList) {
    const key=editCandidateList.dataset.editCandidateList;
    startCandidateQuickEdit(key==='experience'?5:4,key,false,Number(editCandidateList.dataset.editCandidateIndex)||0);
    return;
  }
  const editCandidateStep=event.target.closest('[data-edit-candidate-step]');
  if(editCandidateStep) {
    startCandidateQuickEdit(Number(editCandidateStep.dataset.editCandidateStep));
    return;
  }
  const editCandidateSection=event.target.closest('[data-edit-candidate-section]');
  if(editCandidateSection) {
    startCandidateQuickEdit(editCandidateSection.dataset.editCandidateSection==='experience'?5:2);
    return;
  }
  if(route&&route.dataset.route==='candidate-search') {
    event.preventDefault();go('candidate-search');return;
  }
  const resumeButton=event.target.closest('[data-generate-resume]');
  if(resumeButton) {
    const profile=candidateSearchCache.find(item=>item.id===resumeButton.dataset.generateResume)
      ||getLocalCandidateProfiles().find(item=>item.id===resumeButton.dataset.generateResume);
    if(profile)generateCandidateResume(profile);
    else toast('Data profil belum tersedia untuk membuat resume. Muat ulang profil lalu coba lagi.');
    return;
  }
  const publish=event.target.closest('#candidateWizardPublish');
  if(publish) {
    collectCandidateWizardStep();
    if(!validateCandidateWizardStep(candidateWizardStep))return;
    runCandidatePostSave('Profil belum dapat dipublikasikan: ',true);
    return;
  }
  const saveDraft=event.target.closest('#candidateWizardSaveDraft');
  if(saveDraft) {
    collectCandidateWizardStep();
    if(!validateCandidateWizardStep(candidateWizardStep))return;
    runCandidatePostSave('Profil belum dapat disimpan sebagai draft: ',false);
    return;
  }
  const next=event.target.closest('#candidateWizardNext');
  if(next) {
    collectCandidateWizardStep();
    if(candidateQuickEdit) {
      runCandidatePostSave('Perubahan profil belum tersimpan: ');
      return;
    }
    if(candidateWizardStep===candidateWizardStepNames.length-1) {
      if(!validateCandidateWizardStep(candidateWizardStep))return;
      runCandidatePostSave('Profil belum dapat disimpan: ',false);
      return;
    }
    if(!validateCandidateWizardStep(candidateWizardStep))return;
    candidateWizardStep++;
    renderCandidateWizard();return;
  }
  if(event.target.closest('#candidateWizardBack')) {
    if(candidateQuickEdit) {
      candidateQuickEdit=false;
      pendingCandidateQuickEdit=null;
      go('candidate-own-profile');
      return;
    }
    collectCandidateWizardStep();candidateWizardStep=Math.max(0,candidateWizardStep-1);renderCandidateWizard();return;
  }
  const stepButton=event.target.closest('[data-wizard-step]');
  if(stepButton&&!stepButton.disabled) {
    collectCandidateWizardStep();candidateWizardStep=Number(stepButton.dataset.wizardStep);renderCandidateWizard();return;
  }
  const addRow=event.target.closest('[data-add-row]');
  if(addRow) {
    collectCandidateWizardStep();const key=addRow.dataset.addRow;
    (candidateWizardData[key]||(candidateWizardData[key]=[])).push({});
    renderCandidateWizard();return;
  }
  if(event.target.closest('[data-remove-row]')) {
    collectCandidateWizardStep();const row=event.target.closest('[data-list-row]'),key=row.dataset.listRow;
    candidateWizardData[key].splice([...row.parentElement.children].indexOf(row),1);
    renderCandidateWizard();return;
  }
  if(event.target.closest('[data-add-skill]')) {
    const input=$('#candidateSkillInput'),skill=input.value.trim();
    if(skill&&!candidateWizardData.skills?.some(item=>item.toLowerCase()===skill.toLowerCase()))candidateWizardData.skills=[...(candidateWizardData.skills||[]),skill];
    renderCandidateWizard();return;
  }
  const removeSkill=event.target.closest('[data-remove-skill]');
  if(removeSkill) {
    candidateWizardData.skills=(candidateWizardData.skills||[]).filter(skill=>skill!==removeSkill.dataset.removeSkill);
    renderCandidateWizard();return;
  }
  if(event.target.closest('[data-remove-photo]')) {
    candidateWizardData.photoData='';candidateWizardFiles.photo=null;renderCandidateWizard();return;
  }
  if(event.target.closest('[data-remove-cover]')) {
    candidateWizardData.coverData='';candidateWizardFiles.cover=null;renderCandidateWizard();return;
  }
  const bookmark=event.target.closest('[data-bookmark-candidate]');
  if(bookmark) {saveCandidateBookmark(bookmark.dataset.bookmarkCandidate);return;}
  const talent=event.target.closest('[data-talent-candidate]');
  if(talent) {addPublicCandidateToTalentPool(talent.dataset.talentCandidate);return;}
  const chat=event.target.closest('[data-chat-candidate]');
  if(chat) {
    if(!supabaseSession) {
      toast('Masuk untuk menghubungi kandidat.');
      pendingAuthRoute='messages';
      openAuthModal(false);
      return;
    }
    getPublicProfileById(chat.dataset.chatCandidate).then(profile=>{
      const local=getLocalCandidateProfiles().find(item=>item.id===chat.dataset.chatCandidate);
      const contact=candidateSharedContact((profile||local)?.publicData||(profile||local)?.public_data||{});
      const phone=String(contact?.whatsapp||'').replace(/\D/g,'');
      if(phone)window.location.href=`https://wa.me/${phone}`;
      else if(contact?.email)window.location.href=`mailto:${encodeURIComponent(contact.email)}?subject=${encodeURIComponent('Peluang kerja melalui JobHub')}`;
      else toast('Kandidat belum memilih untuk membagikan kontak publik.');
    }).catch(error=>toast(`Kontak kandidat tidak dapat dimuat: ${error.message||'coba lagi.'}`));
    return;
  }
  if(event.target.closest('[data-invite-candidate]')) {
    openCandidateInterviewInvite(event.target.closest('[data-invite-candidate]').dataset.inviteCandidate).catch(error=>toast(`Undangan interview gagal disimpan: ${error.message||'periksa koneksi dan kebijakan Supabase.'}`));
  }
});
document.addEventListener('input',event=>{
  if(event.target.id==='candidatePhotoZoom') {
    const image=$('#candidatePhotoPreview img');
    candidateWizardData.photoZoom=Number(event.target.value);
    if(image)image.style.transform=`scale(${candidateWizardData.photoZoom})`;
  }
  if(event.target.name==='birthDate')$('#candidateAge').textContent=candidateAge(event.target.value)||'Otomatis dihitung';
  if(event.target.name==='about')$('#candidateAboutLength').textContent=String(event.target.value.length);
  if(event.target.closest('#candidateSearchForm'))scheduleCandidateSearch(300);
  if(event.target.closest('#candidateWizardContent')) {
    collectCandidateWizardStep();
    renderCandidateWizardStrength();
  }
});
document.addEventListener('keydown',event=>{
  const field=event.target.closest('textarea[data-bullet-list]');
  if(!field||event.key!=='Enter'||event.shiftKey)return;
  event.preventDefault();
  const value=field.value;
  const start=field.selectionStart;
  const end=field.selectionEnd;
  const lineStart=value.lastIndexOf('\n',start-1)+1;
  const line=value.slice(lineStart,start);
  if(/^•\s*$/.test(line)) {
    const nextValue=value.slice(0,lineStart)+'\n'+value.slice(end);
    field.value=nextValue;
    field.setSelectionRange(lineStart+1,lineStart+1);
  } else {
    const nextValue=value.slice(0,start)+'\n• '+value.slice(end);
    field.value=nextValue;
    const cursor=start+3;
    field.setSelectionRange(cursor,cursor);
  }
  field.dispatchEvent(new Event('input',{bubbles:true}));
});
window.addEventListener('jobhub-address-change',event=>{
  if(event.detail?.rootId!=='candidateAddressForm'||activeRoute!=='candidate-create-profile'||candidateWizardStep!==1||!$('#candidateAddressForm')?.isConnected)return;
  const {rootId,...address}=event.detail||{};
  Object.assign(candidateWizardData,address,{
    province:address.provinceName||'',
    city:address.regencyName||'',
    district:address.districtName||'',
    village:address.villageName||''
  });
  collectCandidateWizardStep();
});
document.addEventListener('change',async event=>{
  if(event.target.closest('#candidateWizardContent')) {
    collectCandidateWizardStep();
    renderCandidateWizardStrength();
  }
  const input=event.target;
  if(input.closest('#candidateSearchForm'))renderCandidateSearch();
  try {
    if(input.name==='nationality') {
      const other=$('#candidate-nationality-other-wrap');
      if(other)other.hidden=input.value!=='Lainnya';
    }
    if(input.id==='candidatePhotoFile'&&input.files[0]) {
      const file=input.files[0];
      if(!['image/jpeg','image/png'].includes(file.type)||file.size>5*1024*1024)throw new Error('Foto harus JPG, JPEG, atau PNG maksimal 5 MB.');
      candidateWizardFiles.photo=file;
      const previewBlob=await cropCandidatePhoto(file,1);
      const reader=new FileReader();
      reader.onload=()=>{candidateWizardData.photoData=String(reader.result);candidateWizardData.photoZoom=1;renderCandidateWizard();};
      reader.readAsDataURL(previewBlob);
    }
    if(input.id==='candidateCoverFile'&&input.files[0]) {
      const file=input.files[0];
      if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)throw new Error('Foto sampul harus JPG, PNG, atau WEBP maksimal 5 MB.');
      candidateWizardFiles.cover=file;
      const previewBlob=await resizeCandidateCover(file);
      const reader=new FileReader();
      reader.onload=()=>{candidateWizardData.coverData=String(reader.result);renderCandidateWizard();};
      reader.readAsDataURL(previewBlob);
    }
    if(input.id==='candidateCvFile'&&input.files[0]) {
      const file=input.files[0];
      if(file.type!=='application/pdf'&&!file.name.toLowerCase().endsWith('.pdf'))throw new Error('CV harus berupa PDF.');
      if(file.size>5*1024*1024)throw new Error('Ukuran CV maksimal 5 MB.');
      candidateWizardFiles.cv=file;
      candidateWizardData.cvId=await saveCvFile(file);
      candidateWizardData.cvName=file.name;
      candidateWizardData.cvPreviewUrl=URL.createObjectURL(file);
      renderCandidateWizard();
    }
    if(input.id==='candidateCertificateFiles'||input.id==='candidatePortfolioFiles'||input.id==='candidateDocumentFiles') {
      const files=[...input.files];
      if(files.some(file=>file.size>5*1024*1024))throw new Error('Setiap berkas maksimal 5 MB.');
      if(input.id==='candidateCertificateFiles') {
        if(files.some(file=>!['application/pdf','image/jpeg','image/png'].includes(file.type)))throw new Error('Sertifikat harus berupa PDF, JPG, atau PNG.');
        candidateWizardFiles.certificates=files;
      }
      if(input.id==='candidatePortfolioFiles') {
        if(files.some(file=>!['image/jpeg','image/png','video/mp4'].includes(file.type)))throw new Error('Portfolio hanya menerima foto JPG/PNG atau video MP4.');
        candidateWizardFiles.portfolio=files;
      }
      if(input.id==='candidateDocumentFiles') {
        if(files.some(file=>!['application/pdf','image/jpeg','image/png'].includes(file.type)))throw new Error('Dokumen harus berupa PDF, JPG, atau PNG.');
        const types=candidateWizardData.documentTypes||[];
        if(files.length>types.length)throw new Error('Jumlah file tidak boleh melebihi jenis dokumen yang dipilih.');
        candidateWizardFiles.documents=files;
      }
    }
  } catch(error) {
    toast(error.message||'File tidak dapat diproses.');
    input.value='';
  }
});
$('#resumeStudioControls').addEventListener('click',event=>{
  const addSection=event.target.closest('[data-resume-add-section]');
  if(addSection) {
    const title=$('#resumeNewSectionTitle').value.trim();
    const content=$('#resumeNewSectionContent').value.trim();
    if(!title||!content) {toast('Isi nama dan konten bagian baru terlebih dahulu.');return;}
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const state=readResumeStudioState(profile);
    state.extraSections=[...(state.extraSections||[]),{id:crypto.randomUUID(),title,content,column:$('#resumeNewSectionColumn').value,listStyle:$('#resumeNewSectionListStyle').value}];
    if(!saveResumeStudioState(state))return;
    renderCandidateResumeStudio();toast('Bagian baru ditambahkan ke layout.');return;
  }
  const removeSection=event.target.closest('[data-resume-remove-section]');
  if(removeSection) {
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const state=readResumeStudioState(profile);
    state.extraSections=(state.extraSections||[]).filter(item=>item.id!==removeSection.dataset.resumeRemoveSection);
    if(!saveResumeStudioState(state))return;renderCandidateResumeStudio();return;
  }
  const removeCertificate=event.target.closest('[data-resume-remove-certificate]');
  if(removeCertificate) {
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const state=readResumeStudioState(profile);
    state.certificateUploads=(state.certificateUploads||[]).filter((item,index)=>index!==Number(removeCertificate.dataset.resumeRemoveCertificate));
    if(!saveResumeStudioState(state))return;
    $('#resumeCertificateUploadList').innerHTML=resumeStudioCertificateRows(state.certificateUploads);
    renderResumeStudioPreview(state);return;
  }
  const addEducation=event.target.closest('[data-resume-add-education]');
  if(addEducation) {
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const controls=$('#resumeStudioControls');
    const state=readResumeStudioState(profile);
    const level=controls.querySelector('[data-resume-field="educationLevel"]').value;
    const school=controls.querySelector('[data-resume-field="educationSchool"]').value.trim();
    const major=controls.querySelector('[data-resume-field="educationMajor"]').value.trim();
    const years=[controls.querySelector('[data-resume-field="educationStart"]').value.trim(),controls.querySelector('[data-resume-field="educationEnd"]').value.trim()].filter(Boolean).join(' - ');
    if(!level||!school) {toast('Pilih jenjang dan isi nama sekolah atau universitas.');return;}
    const entry=[level,school,major,years].filter(Boolean).join(' | ');
    state.education=[...resumeStudioLines(state.education),entry].join('\n');
    state.educationListStyle='bullet';
    state.educationLevel='';state.educationSchool='';state.educationMajor='';state.educationStart='';state.educationEnd='';
    if(!saveResumeStudioState(state))return;
    renderCandidateResumeStudio();return;
  }
  const button=event.target.closest('[data-resume-template]');
  if(!button)return;
  const profile=getCurrentCandidateProfile();if(!profile)return;
  const state=readResumeStudioState(profile);
  state.template=button.dataset.resumeTemplate;
  state.documentMode=button.dataset.resumeTemplate.startsWith('letter-')?'cover-letter':'resume';
  if(!saveResumeStudioState(state))return;
  renderCandidateResumeStudio();
});
$('#resumeDocumentModeControl').addEventListener('click',event=>{
  const button=event.target.closest('[data-resume-mode]');if(!button)return;
  const profile=getCurrentCandidateProfile();if(!profile)return;
  const state=readResumeStudioState(profile);
  state.documentMode=button.dataset.resumeMode;
  if(state.documentMode==='cover-letter'&&!resumeLetterTemplates.includes(state.template))state.template='letter-classic';
  if(state.documentMode==='resume'&&resumeLetterTemplates.includes(state.template))state.template='executive';
  if(!saveResumeStudioState(state))return;
  renderCandidateResumeStudio();
});
function updateResumeStudioField(event) {
  const column=event.target.closest('[data-resume-section-column]');
  if(column) {
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const state=readResumeStudioState(profile);
    state.extraSections=(state.extraSections||[]).map(item=>item.id===column.dataset.resumeSectionColumn?{...item,column:column.value}:item);
    if(!saveResumeStudioState(state))return;renderResumeStudioPreview(state);return;
  }
  const field=event.target.closest('[data-resume-field]');
  if(!field)return;
  const profile=getCurrentCandidateProfile();if(!profile)return;
  const state=readResumeStudioState(profile);
  state[field.dataset.resumeField]=field.value;
  if(['summary','experience','skills','education','certificates','portfolio'].includes(field.dataset.resumeField))delete state[`${field.dataset.resumeField}Html`];
  if(field.dataset.resumeField.endsWith('ListStyle'))delete state[`${field.dataset.resumeField.slice(0,-9)}Html`];
  if(!saveResumeStudioState(state))return;
  renderResumeStudioPreview(state);
}
$('#resumeStudioControls').addEventListener('input',updateResumeStudioField);
$('#resumeStudioControls').addEventListener('change',updateResumeStudioField);
$('#resumeStudioPreview').addEventListener('input',event=>{
  const field=event.target.closest('[data-resume-inline],[data-resume-inline-title],[data-resume-inline-content]');
  if(!field)return;
  const profile=getCurrentCandidateProfile();if(!profile)return;
  const state=readResumeStudioState(profile);
  if(field.hasAttribute('data-resume-inline')) {
    const key=field.dataset.resumeInline;
    state[key]=field.textContent.trim();
    state[`${key}Html`]=resumeStudioSafeMarkup(field.innerHTML);
  }
  if(field.hasAttribute('data-resume-inline-title')) {
    const key=field.dataset.resumeInlineTitle;
    if(key.startsWith('extra_')) {
      const id=key.slice(6);
      const titleHtml=resumeStudioSafeMarkup(field.innerHTML);
      state.extraSections=(state.extraSections||[]).map(item=>item.id===id?{...item,title:field.textContent.trim(),titleHtml}:item);
      state[`${key}TitleHtml`]=titleHtml;
    } else {
      state[`${key}Title`]=field.textContent.trim();
      state[`${key}TitleHtml`]=resumeStudioSafeMarkup(field.innerHTML);
    }
  }
  if(field.hasAttribute('data-resume-inline-content')) {
    const key=field.dataset.resumeInlineContent;
    const content=field.innerText.trim();
    const markup=resumeStudioSafeMarkup(field.innerHTML);
    if(key.startsWith('extra_')) {
      const id=key.slice(6);
      state.extraSections=(state.extraSections||[]).map(item=>item.id===id?{...item,content,contentHtml:markup}:item);
    } else {
      state[key]=content;
      state[`${key}Html`]=markup;
    }
  }
  if(!saveResumeStudioState(state))return;
});
$('#resumeStudioPreview').addEventListener('focusin',event=>{
  const editor=event.target.closest('[data-resume-inline-content]');
  if(editor)resumeStudioActiveEditor=editor;
});
$('#resumeStudioPreview').addEventListener('click',event=>{
  const current=event.target.closest('[data-resume-inline-content]');
  if(current) {
    resumeStudioActiveEditor=current;
    return;
  }
  const section=event.target.closest('.resume-paper-section');
  const sectionContent=section?.querySelector('[data-resume-inline-content]');
  if(sectionContent) {
    resumeStudioActiveEditor=sectionContent;
    sectionContent.focus();
    const selection=window.getSelection();
    const range=document.createRange();range.selectNodeContents(sectionContent);range.collapse(false);
    selection.removeAllRanges();selection.addRange(range);rememberResumeStudioSelection();
  }
});
function rememberResumeStudioSelection() {
  const selection=window.getSelection();
  if(selection?.rangeCount&&$('#resumeStudioPreview').contains(selection.anchorNode))resumeStudioSelectionRange=selection.getRangeAt(0).cloneRange();
}
function applyResumeSelectionStyle(property,value) {
  const range=resumeStudioSelectionRange;
  if(!range||range.collapsed)return;
  const wrapper=document.createElement('span');wrapper.style[property]=value;
  try {
    range.surroundContents(wrapper);
  } catch {
    wrapper.append(range.extractContents());range.insertNode(wrapper);
  }
  const selection=window.getSelection();selection.removeAllRanges();
  const nextRange=document.createRange();nextRange.selectNodeContents(wrapper);selection.addRange(nextRange);
  resumeStudioSelectionRange=nextRange.cloneRange();
  const editor=wrapper.closest('[data-resume-inline-content],[data-resume-inline-title],[data-resume-inline]');
  editor?.dispatchEvent(new Event('input',{bubbles:true}));
}
$('#resumeStudioPreview').addEventListener('mouseup',rememberResumeStudioSelection);
$('#resumeStudioPreview').addEventListener('keyup',rememberResumeStudioSelection);
$('#resumeCanvasToolbar').addEventListener('mousedown',event=>{
  if(event.target.closest('button'))event.preventDefault();
});
$('#resumeCanvasToolbar').addEventListener('click',event=>{
  const listButton=event.target.closest('[data-resume-list-style]');
  if(listButton) {
    const node=resumeStudioSelectionRange?.commonAncestorContainer;
    const selected=node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement;
    const editor=(selected?.closest('[data-resume-inline-content]')&&$('#resumeStudioPreview').contains(selected.closest('[data-resume-inline-content]'))?selected.closest('[data-resume-inline-content]'):null)
      ||(resumeStudioActiveEditor&&$('#resumeStudioPreview').contains(resumeStudioActiveEditor)?resumeStudioActiveEditor:null)
      ||document.activeElement?.closest?.('#resumeStudioPreview [data-resume-inline-content]');
    if(!editor) {toast('Klik area isi salah satu bagian resume terlebih dahulu.');return;}
    const key=editor.dataset.resumeInlineContent;
    const content=editor.innerText.trim()||'Tulis poin baru di sini';
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const state=readResumeStudioState(profile);
    if(key.startsWith('extra_')) {
      const id=key.slice(6);
      state.extraSections=(state.extraSections||[]).map(item=>item.id===id?{...item,content,contentHtml:'',listStyle:listButton.dataset.resumeListStyle}:item);
    } else {
      state[key]=content;
      state[`${key}Html`]='';
      state[`${key}ListStyle`]=listButton.dataset.resumeListStyle;
    }
    if(!saveResumeStudioState(state))return;
    renderResumeStudioPreview(state);
    resumeStudioActiveEditor=$(`#resumeStudioPreview [data-resume-inline-content="${CSS.escape(key)}"]`);
    resumeStudioActiveEditor?.focus();
    toast(listButton.dataset.resumeListStyle==='check'?'List centang diterapkan.':'List titik diterapkan.');return;
  }
  const button=event.target.closest('[data-resume-command]');
  if(!button||!resumeStudioSelectionRange)return;
  const selection=window.getSelection();selection.removeAllRanges();selection.addRange(resumeStudioSelectionRange);
  if(button.dataset.resumeCommand.startsWith('justify')) {
    const align={justifyLeft:'left',justifyCenter:'center',justifyRight:'right'}[button.dataset.resumeCommand];
    const node=resumeStudioSelectionRange.commonAncestorContainer;
    const selected=(node.nodeType===Node.ELEMENT_NODE?node:node.parentElement);
    const editor=selected?.closest('[data-resume-inline-content],[data-resume-inline-title],[data-resume-inline]');
    const block=selected?.closest('p,li,div')||editor;
    const target=editor&&block&&!editor.contains(block)?editor:block;
    if(target)target.style.textAlign=align;
    editor?.dispatchEvent(new Event('input',{bubbles:true}));
    return;
  }
  document.execCommand(button.dataset.resumeCommand,false,null);
  rememberResumeStudioSelection();
  const range=resumeStudioSelectionRange;
  const node=range?.commonAncestorContainer;
  const editor=(node?.nodeType===Node.ELEMENT_NODE?node:node?.parentElement)?.closest('[data-resume-inline-content],[data-resume-inline-title],[data-resume-inline]');
  editor?.dispatchEvent(new Event('input',{bubbles:true}));
});
$('#resumeInlineFontSize').addEventListener('change',event=>applyResumeSelectionStyle('fontSize',`${Math.min(36,Math.max(9,Number(event.target.value)||14))}px`));
$('#resumeInlineTextColor').addEventListener('input',event=>applyResumeSelectionStyle('color',event.target.value));
$('#resumeStudioControls').addEventListener('change',async event=>{
  if(event.target.id==='resumeCertificateFiles') {
    const files=[...event.target.files];if(!files.length)return;
    if(files.some(file=>!['application/pdf','image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)) {
      toast('Sertifikat harus PDF, JPG, PNG, atau WEBP maksimal 5 MB per file.');event.target.value='';return;
    }
    try {
      const profile=getCurrentCandidateProfile();if(!profile)return;
      const state=readResumeStudioState(profile);
      if((state.certificateUploads||[]).length+files.length>12)throw new Error('Maksimal 12 file sertifikat pada satu resume.');
      setResumeStudioLoading(true,'Memproses sertifikat...');
      const uploads=await Promise.all(files.map(resumeCertificateEntry));
      state.certificateUploads=[...(state.certificateUploads||[]),...uploads];
      if(!saveResumeStudioState(state))return;
      $('#resumeCertificateUploadList').innerHTML=resumeStudioCertificateRows(state.certificateUploads);
      renderResumeStudioPreview(state);event.target.value='';toast('Sertifikat ditambahkan ke layout resume.');
    } catch(error) {
      toast(error.message||'Sertifikat tidak dapat disimpan.');event.target.value='';
    } finally {
      setResumeStudioLoading(false);
    }
    return;
  }
  if(event.target.id!=='resumeStudioPhoto')return;
  const file=event.target.files[0];if(!file)return;
  if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024) {
    toast('Foto harus JPG, PNG, atau WEBP maksimal 5 MB.');event.target.value='';return;
  }
  try {
    setResumeStudioLoading(true,'Memproses foto profil...');
    const blob=await cropCandidatePhoto(file,1);
    const photo=await new Promise((resolve,reject)=>{
      const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(new Error('Foto tidak dapat dibaca.'));reader.readAsDataURL(blob);
    });
    const profile=getCurrentCandidateProfile();if(!profile)return;
    const state=readResumeStudioState(profile);state.photo=photo;
    if(!saveResumeStudioState(state))return;renderResumeStudioPreview(state);
    toast('Foto resume diperbarui.');
  } catch(error) {
    toast(error.message||'Foto tidak dapat diproses.');
  } finally {
    setResumeStudioLoading(false);
  }
});
$('#printResumeStudio').addEventListener('click',()=>window.print());
$('#downloadResumeStudio').addEventListener('click',downloadResumeStudio);
$('#candidateWizardForm').addEventListener('submit',event=>event.preventDefault());
$('#candidateSearchForm').addEventListener('submit',event=>{event.preventDefault();renderCandidateSearch();});
$('#candidateSearchForm').insertAdjacentHTML('beforeend','<input name="salaryMin" type="number" min="0" placeholder="Gaji minimum"><input name="salaryMax" type="number" min="0" placeholder="Gaji maksimum"><input name="experience" type="number" min="0" placeholder="Pengalaman minimal (tahun)"><select name="jobType"><option value="">Semua jenis kerja</option><option>Full Time</option><option>Part Time</option><option>Freelance</option><option>Contract</option><option>Internship</option><option>Remote</option></select>');
routes['candidate-create-profile']='candidateWizardView';
routes['candidate-public']='candidatePublicView';
routes['candidate-resume-studio']='candidateResumeStudioView';
routes['candidate-search']='candidateSearchView';
if(location.hash.startsWith('#/candidate/create-profile'))renderCandidateWizard();
else if(location.hash==='#/candidate/search')renderCandidateSearch();
else if(location.hash==='#/candidate/resume-studio')go('candidate-resume-studio');
else if(location.hash.startsWith('#/candidate/')&&!['talent-post','search','create-profile','resume-studio'].includes(location.hash.slice('#/candidate/'.length)))go('candidate-public',decodeURIComponent(location.hash.slice('#/candidate/'.length)));
