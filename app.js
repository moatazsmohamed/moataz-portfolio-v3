/* ===== coverflow ===== */
const flow = document.getElementById('coverflow')
const posters = [...flow.querySelectorAll('.poster')]
const dotsRow = document.getElementById('dots')
const cfCount = document.getElementById('cfCount')
const btnPrev = document.getElementById('prev')
const btnNext = document.getElementById('next')

const N = posters.length
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = matchMedia('(pointer: fine)').matches

let target = 0
let pos = 0
let vel = 0
let dragging = false
let dragFrom = 0
let dragPx = 0
let dragX = 0
let dragT = 0
let dragV = 0
let movedPx = 0
let raf = 0
let lastActive = 0
let wheelAcc = 0
let wheelAt = 0
let seen = false
let stamps = null
let started = reduced

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const pad2 = (n) => String(n).padStart(2, '0')

posters.forEach((_, i) => {
  const d = document.createElement('i')
  d.addEventListener('click', () => go(i))
  dotsRow.appendChild(d)
})
const dots = [...dotsRow.children]

posters.forEach((p) => {
  const ar = p.querySelector('.p-shot')?.style.getPropertyValue('--ar')
  if (ar) p.style.setProperty('--ar', ar)
})

let M = null

function metrics() {
  if (M) return M
  const mobile = window.innerWidth <= 760
  let w = 360
  for (const p of posters) w = Math.max(w, p.offsetWidth)
  M = {
    mobile,
    step: w * (mobile ? 0.6 : 0.66),
    tilt: mobile ? 15 : 25,
    tiltMax: mobile ? 20 : 32,
    zPop: mobile ? 26 : 58,
    zStep: mobile ? 84 : 148,
    sStep: mobile ? 0.13 : 0.1,
    yStep: mobile ? 5 : 9,
    fade: mobile ? 1.25 : 2.5
  }
  return M
}

function revealAt(i, now) {
  if (!stamps) return 1
  const t = (now - stamps[i]) / 640
  if (t <= 0) return 0
  if (t >= 1) return 1
  return 1 - Math.pow(1 - t, 3)
}

function render(now) {
  const m = metrics()
  const focus = clamp(Math.round(pos), 0, N - 1)

  posters.forEach((p, i) => {
    const rv = revealAt(i, now)
    const d = i - pos
    const ad = Math.abs(d)
    const dn = Math.min(ad, 3)
    const x = -d * m.step
    const z = ad < 0.02 ? m.zPop : -dn * m.zStep
    const ry = clamp(-d * m.tilt, -m.tiltMax, m.tiltMax)
    const sc = Math.max(0.6, 1 - dn * m.sStep)
    const y = dn * m.yStep + (1 - rv) * 78
    const op = clamp(1 - Math.max(0, ad - 0.5) / m.fade, 0, 1) * rv

    p.style.transform =
      `translate3d(${x.toFixed(1)}px, ${y.toFixed(2)}px, ${z.toFixed(1)}px) ` +
      `rotateY(${ry.toFixed(2)}deg) scale(${sc.toFixed(3)})`
    p.style.opacity = op.toFixed(3)
    p.style.setProperty('--df', (ad < 0.04 ? 0 : Math.min(1.9, dn * 0.82)).toFixed(2) + 'px')
    p.style.zIndex = String(40 - Math.round(ad * 10))
    p.style.pointerEvents = ad < 1.3 ? 'auto' : 'none'
    p.classList.toggle('is-active', i === focus)
    p.setAttribute('aria-hidden', i === focus ? 'false' : 'true')
  })

  if (focus !== lastActive) {
    const p = posters[focus]
    p.classList.remove('sweep')
    void p.offsetWidth
    if (!reduced) p.classList.add('sweep')
    setTimeout(() => p.classList.remove('sweep'), 1150)
    lastActive = focus
  }

  dots.forEach((el, i) => el.classList.toggle('on', i === focus))
  if (cfCount) cfCount.innerHTML = `<b>${pad2(focus + 1)}</b> / ${pad2(N)}`
  btnPrev.style.opacity = focus === 0 ? 0.35 : 1
  btnNext.style.opacity = focus === N - 1 ? 0.35 : 1
}

function settled() {
  return dragging === false && Math.abs(target - pos) < 0.001 && Math.abs(vel) < 0.001
}

function revealing(now) {
  if (!stamps) return false
  return stamps.some((s) => now - s < 660)
}

function tick(now) {
  raf = 0
  if (dragging) {
    pos = clamp(dragFrom + dragPx / metrics().step, -0.4, N - 0.6)
    render(now)
    raf = requestAnimationFrame(tick)
    return
  }
  if (reduced) {
    pos = target
    render(now)
    return
  }
  vel = (vel + (target - pos) * 0.155) * 0.71
  pos += vel
  if (Math.abs(target - pos) < 0.0009 && Math.abs(vel) < 0.0009) {
    pos = target
    vel = 0
  }
  render(now)
  if (!settled() || revealing(now)) raf = requestAnimationFrame(tick)
}

function kick() {
  if (!started) return
  if (!raf) raf = requestAnimationFrame(tick)
}

function go(i) {
  const next = clamp(Math.round(i), 0, N - 1)
  if (next === target && settled()) return
  target = next
  kick()
}

btnPrev.addEventListener('click', () => go(target - 1))
btnNext.addEventListener('click', () => go(target + 1))

flow.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') { e.preventDefault(); go(target + 1) }
  if (e.key === 'ArrowRight') { e.preventDefault(); go(target - 1) }
  if (e.key === 'Home') { e.preventDefault(); go(0) }
  if (e.key === 'End') { e.preventDefault(); go(N - 1) }
})

function onDragMove(e) {
  if (!dragging) return
  const dx = e.clientX - dragX
  dragX = e.clientX
  dragPx += dx
  movedPx += Math.abs(dx)
  const dt = Math.max(1, e.timeStamp - dragT)
  dragT = e.timeStamp
  dragV = dragV * 0.65 + (dx / dt) * 0.35
}

function endDrag() {
  if (!dragging) return
  dragging = false
  flow.classList.remove('is-drag')
  window.removeEventListener('pointermove', onDragMove)
  window.removeEventListener('pointerup', endDrag)
  window.removeEventListener('pointercancel', endDrag)
  const m = metrics()
  const fling = clamp(dragV * 90 / m.step, -2.2, 2.2)
  target = clamp(Math.round(dragFrom + (dragPx + fling * m.step * 0.45) / m.step), 0, N - 1)
  vel = clamp(fling * 0.28, -0.45, 0.45)
  kick()
}

/* native link-drag would steal the pointer before our track can move */
flow.addEventListener('dragstart', (e) => e.preventDefault())

flow.addEventListener('pointerdown', (e) => {
  if (e.button !== 0) return
  dragging = true
  dragFrom = pos
  dragPx = 0
  movedPx = 0
  dragX = e.clientX
  dragT = e.timeStamp
  dragV = 0
  flow.classList.add('is-drag')
  window.addEventListener('pointermove', onDragMove)
  window.addEventListener('pointerup', endDrag)
  window.addEventListener('pointercancel', endDrag)
  kick()
})

/* a drag must not open the card it started on */
flow.addEventListener('click', (e) => {
  const wasDrag = movedPx > 8
  movedPx = 0
  if (wasDrag) {
    e.stopPropagation()
    e.preventDefault()
    return
  }
  const card = e.target.closest('.poster')
  if (card) go(Number(card.dataset.idx))
}, true)

flow.addEventListener('wheel', (e) => {
  if (!seen) return
  const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY
  if (Math.abs(delta) < 3) return
  const focus = clamp(Math.round(target), 0, N - 1)
  if ((delta > 0 && focus >= N - 1) || (delta < 0 && focus <= 0)) return
  e.preventDefault()
  const now = performance.now()
  wheelAcc = now - wheelAt > 260 ? delta : wheelAcc + delta
  wheelAt = now
  if (Math.abs(wheelAcc) > 46) {
    go(target + (wheelAcc > 0 ? 1 : -1))
    wheelAcc = 0
  }
}, { passive: false })

/* ===== tilt the live preview like a real screen ===== */
if (finePointer && !reduced) {
  posters.forEach((p) => {
    const shot = p.querySelector('.p-shot')
    if (!shot) return
    p.addEventListener('pointermove', (e) => {
      if (dragging) return
      const r = shot.getBoundingClientRect()
      const nx = clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2), -1, 1)
      const ny = clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2), -1, 1)
      shot.style.setProperty('--ry', (nx * 9).toFixed(2) + 'deg')
      shot.style.setProperty('--rx', (-ny * 7).toFixed(2) + 'deg')
    })
    p.addEventListener('pointerleave', () => {
      shot.style.setProperty('--ry', '0deg')
      shot.style.setProperty('--rx', '0deg')
    })
  })
}

/* ===== entry cascade ===== */
if (reduced) {
  render(performance.now())
} else {
  posters.forEach((p) => { p.style.opacity = '0' })
  const workSec = document.getElementById('work')
  const startCascade = () => {
    if (stamps) return
    const now = performance.now()
    stamps = posters.map((_, i) => now + i * 68)
    started = true
    kick()
  }
  const enterIO = new IntersectionObserver((entries) => {
    if (entries.some((en) => en.isIntersecting)) {
      seen = true
      startCascade()
      enterIO.disconnect()
    }
  }, { threshold: 0.25 })
  enterIO.observe(workSec)
  setTimeout(() => { if (!stamps) { seen = true; startCascade() } }, 2600)
}

window.addEventListener('resize', () => { M = null; kick() })
kick()


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
