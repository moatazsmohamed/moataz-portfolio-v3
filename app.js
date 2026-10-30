/* ===== coverflow ===== */
const flow = document.getElementById('coverflow')
const posters = [...document.querySelectorAll('.poster')]
const dotsRow = document.getElementById('dots')
const btnPrev = document.getElementById('prev')
const btnNext = document.getElementById('next')

let active = 2

posters.forEach((_, i) => {
  const d = document.createElement('i')
  d.addEventListener('click', () => go(i))
  dotsRow.appendChild(d)
})
const dots = [...dotsRow.children]

function layout() {
  const mobile = window.matchMedia('(max-width: 760px)').matches
  const step = mobile ? 92 : 72
  posters.forEach((p, i) => {
    const d = i - active
    const ad = Math.abs(d)
    const x = -d * step
    const scale = ad === 0 ? 1 : ad === 1 ? 0.86 : 0.72
    const ry = d === 0 ? 0 : (d > 0 ? -9 : 9)
    const tz = ad === 0 ? 40 : -70 * ad
    const op = ad === 0 ? 1 : ad === 1 ? (mobile ? 0.45 : 0.88) : 0.5
    p.style.transform = `translateX(${x}%) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`
    p.style.opacity = ad > 1 ? 0 : op
    p.style.zIndex = String(20 - ad)
    p.style.pointerEvents = ad > 1 ? 'none' : 'auto'
    p.classList.toggle('is-active', ad === 0)
    p.setAttribute('aria-hidden', ad === 0 ? 'false' : 'true')
  })
  dots.forEach((d, i) => d.classList.toggle('on', i === active))
  btnPrev.style.opacity = active === 0 ? 0.35 : 1
  btnNext.style.opacity = active === posters.length - 1 ? 0.35 : 1
}

function go(i) {
  active = Math.max(0, Math.min(posters.length - 1, i))
  layout()
}

btnPrev.addEventListener('click', () => go(active - 1))
btnNext.addEventListener('click', () => go(active + 1))
posters.forEach((p, i) => p.addEventListener('click', () => i !== active && go(i)))

flow.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') go(active + 1)
  if (e.key === 'ArrowRight') go(active - 1)
})

let sx = 0
flow.addEventListener('pointerdown', (e) => { sx = e.clientX })
flow.addEventListener('pointerup', (e) => {
  const dx = e.clientX - sx
  if (Math.abs(dx) > 45) go(active + (dx > 0 ? -1 : 1))
})

layout()
window.addEventListener('resize', layout)

/* ===== portrait hover: tilt + spotlight ===== */
const faceWrap = document.querySelector('.face-wrap')
const hero = document.getElementById('home')

if (faceWrap && hero && matchMedia('(pointer: fine)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let frame = 0
  let nx = 0
  let ny = 0

  const paint = () => {
    frame = 0
    faceWrap.style.setProperty('--rx', (-ny * 11).toFixed(2) + 'deg')
    faceWrap.style.setProperty('--ry', (nx * 13).toFixed(2) + 'deg')
    faceWrap.style.setProperty('--gx', (50 + nx * 26).toFixed(1) + '%')
    faceWrap.style.setProperty('--gy', (42 + ny * 26).toFixed(1) + '%')
  }

  const readPointer = (e) => {
    const r = faceWrap.getBoundingClientRect()
    nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (r.width * 0.9)))
    ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (r.height * 0.9)))
    if (!frame) frame = requestAnimationFrame(paint)
  }

  hero.addEventListener('pointerenter', () => faceWrap.classList.add('is-hot'))
  hero.addEventListener('pointermove', readPointer)
  hero.addEventListener('pointerleave', () => {
    faceWrap.classList.remove('is-hot')
    nx = ny = 0
    if (!frame) frame = requestAnimationFrame(paint)
  })
}

/* ===== scroll spy ===== */
const pills = [...document.querySelectorAll('.pill')]
const map = { home: 1, work: 2, about: 3, stats: 4, contact: 0 }

const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return
    pills.forEach((p) => p.classList.remove('active'))
    const idx = map[en.target.id]
    if (idx) pills[idx].classList.add('active')
  })
}, { rootMargin: '-45% 0px -50% 0px' })

;['home', 'work', 'about', 'stats', 'contact'].forEach((id) => {
  const el = document.getElementById(id)
  if (el) spy.observe(el)
})

/* ===== reveal ===== */
const targets = document.querySelectorAll('.sec-head, .tech-grid li, .about-photo, .about-text, .stat, .contact > *')
targets.forEach((el) => el.setAttribute('data-reveal', ''))

const io = new IntersectionObserver((entries, obs) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return
    en.target.classList.add('is-in')
    obs.unobserve(en.target)
  })
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
targets.forEach((el) => io.observe(el))

/* ===== lead form ===== */
const SUPABASE_URL = 'https://ppihzxabbysozbdmweje.supabase.co'
const SUPABASE_KEY = 'sb_publishable_7Re-MNRopMsOjopgV2YNjg_fN0yUDiL'
const SUPABASE_ESM = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

let sbPromise = null
function getSupabase() {
  if (!sbPromise) {
    sbPromise = import(SUPABASE_ESM)
      .then((m) => m.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: false, autoRefreshToken: false } }))
      .catch((err) => { sbPromise = null; throw err })
  }
  return sbPromise
}

const leadForm = document.getElementById('leadForm')
const leadStatus = document.getElementById('leadStatus')
const leadBtn = leadForm?.querySelector('.lf-send')

function setLeadStatus(text, tone) {
  leadStatus.textContent = text
  leadStatus.classList.toggle('is-ok', tone === 'ok')
  leadStatus.classList.toggle('is-error', tone === 'error')
}

leadForm?.addEventListener('submit', async (event) => {
  event.preventDefault()
  if (leadBtn.disabled) return

  const data = new FormData(leadForm)
  const name = String(data.get('name') || '').trim()
  const email = String(data.get('email') || '').trim()
  const phone = String(data.get('phone') || '').trim()
  const kind = String(data.get('kind') || '').trim()
  const idea = String(data.get('message') || '').trim()
  const trap = String(data.get('site') || '').trim()

  if (trap) { leadForm.reset(); setLeadStatus('وصلت الفكرة — هرد عليك قريب.', 'ok'); return }
  if (!name) return setLeadStatus('اكتب اسمك الأول.', 'error')
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setLeadStatus('الإيميل مش صحيح.', 'error')
  if (idea.length < 10) return setLeadStatus('اكتب تفاصيل الفكرة (10 حروف على الأقل).', 'error')

  const label = leadBtn.querySelector('span')
  leadBtn.disabled = true
  label.textContent = 'بيبعت…'
  setLeadStatus('', '')

  try {
    const client = await getSupabase()
    const { error } = await client.rpc('portfolio_submit_lead', {
      p_full_name: name.slice(0, 120),
      p_email: email.toLowerCase().slice(0, 254),
      p_phone: phone ? phone.slice(0, 40) : null,
      p_message: (kind ? `نوع المشروع: ${kind}\n\n${idea}` : idea).slice(0, 4000),
      p_lang: 'ar',
      p_page: `${location.origin}${location.pathname}`.slice(0, 200),
      p_honeypot: '',
    })
    if (error) throw error
    leadForm.reset()
    setLeadStatus('وصلت الفكرة — هرجعلك في أقرب وقت.', 'ok')
  } catch (err) {
    const message = String((err && err.message) || '')
    let text = 'حصلت مشكلة في الإرسال — جرّب تاني أو كلّمني على واتساب.'
    if (message.includes('LEAD_THROTTLED')) text = 'بعته كذا مرة ورا بعض — استنى دقيقتين وجرّب تاني.'
    else if (message.includes('LEAD_RATE_LIMIT')) text = 'الرسائل كتير دلوقتي — جرّب بعد شوية.'
    else if (message.includes('LEAD_EMAIL_INVALID')) text = 'الإيميل مش صحيح.'
    else if (message.includes('LEAD_NAME_INVALID')) text = 'اكتب اسمك.'
    else if (message.includes('LEAD_MESSAGE_INVALID')) text = 'تفاصيل الفكرة مش مكتملة.'
    setLeadStatus(text, 'error')
  } finally {
    leadBtn.disabled = false
    label.textContent = 'ابعت الفكرة'
  }
})

/* ===== year ===== */
document.getElementById('year').textContent = new Date().getFullYear()
