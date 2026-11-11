/* ============================================================
   portfolio v3 — app
   المشاريع كلها من projects.js (مصدر واحد)
   ============================================================ */

const $ = (s, r = document) => r.querySelector(s)
const $$ = (s, r = document) => [...r.querySelectorAll(s)]
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const pad2 = (n) => String(n).padStart(2, '0')
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
const finePointer = matchMedia('(pointer: fine)').matches

/* ---------- icons ---------- */
const ICON_GO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12H5m0 0 6-6m-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const ICON_EXT = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 4h6v6M20 4l-8 8M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
const ICON_REPO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.5-4-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.3 4.3 0 0 0-.1-3.2s-1-.3-3.4 1.3a11.6 11.6 0 0 0-6 0C6.8 1.8 5.8 2.1 5.8 2.1a4.3 4.3 0 0 0-.1 3.2A4.6 4.6 0 0 0 4.4 8.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>'

/* ============================================================
   1. COVERFLOW — featured projects
   ============================================================ */
const featured = PROJECTS.filter((p) => p.featured)
const flow = $('#coverflow')
const dotsRow = $('#dots')
const cfCount = $('#cfCount')
const btnPrev = $('#prev')
const btnNext = $('#next')

flow.insertAdjacentHTML('beforeend', featured.map((p, i) => `
  <article class="poster" data-idx="${i}" style="--i:${i}">
    <div class="p-bar"><i></i><i></i><i></i><span class="p-url" dir="ltr">${esc(p.live ? p.live.replace(/^https?:\/\//, '') : 'private')}</span></div>
    <div class="p-shot" style="--ar:${p.ar}">
      <img src="${esc(p.img)}" alt="واجهة ${esc(p.title)}" loading="${i < 2 ? 'eager' : 'lazy'}" decoding="async" />
      <span class="p-sheen" aria-hidden="true"></span>
    </div>
    <div class="p-veil"></div>
    <div class="p-top"><span class="p-kind">${esc(p.kind)}</span><span class="p-no">${pad2(i + 1)}</span></div>
    <div class="p-bot">
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.desc)}</p>
      <span class="p-go">${p.live ? 'زيارة المشروع' : 'مشروع خاص'} ${ICON_GO}</span>
    </div>
    ${p.live ? `<a class="p-link" href="${esc(p.live)}" target="_blank" rel="noopener" aria-label="افتح ${esc(p.title)}"></a>` : ''}
  </article>
`).join(''))

const posters = $$('.poster', flow)
const N = posters.length

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
  if (btnPrev) btnPrev.style.opacity = focus === 0 ? 0.35 : 1
  if (btnNext) btnNext.style.opacity = focus === N - 1 ? 0.35 : 1
}

const settled = () => dragging === false && Math.abs(target - pos) < 0.001 && Math.abs(vel) < 0.001
const revealing = (now) => (stamps ? stamps.some((s) => now - s < 660) : false)

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

btnPrev?.addEventListener('click', () => go(target - 1))
btnNext?.addEventListener('click', () => go(target + 1))

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

if (reduced) {
  render(performance.now())
} else {
  posters.forEach((p) => { p.style.opacity = '0' })
  const workSec = $('#work')
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
  if (workSec) enterIO.observe(workSec)
  setTimeout(() => { if (!stamps) { seen = true; startCascade() } }, 2600)
}

window.addEventListener('resize', () => { M = null; kick() })
kick()

/* ============================================================
   2. ALL WORK — filters, search, sort
   ============================================================ */
const grid = $('#workGrid')
const filtersEl = $('#wFilters')
const searchEl = $('#wSearch')
const clearEl = $('#wClear')
const sortEl = $('#wSort')
const countEl = $('#wCount')
const emptyEl = $('#wEmpty')
const resetEl = $('#wReset')

let activeCat = 'all'
let query = ''
let sortBy = 'featured'

const catCount = (id) => (id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.cat === id).length)

filtersEl.innerHTML = CATS.map((c) => `
  <button type="button" role="tab" data-cat="${c.id}" class="${c.id === 'all' ? 'on' : ''}"
          aria-selected="${c.id === 'all'}">${esc(c.label)}<span class="n">${catCount(c.id)}</span></button>
`).join('')

function cardHTML(p) {
  const live = p.live
    ? `<a class="wc-live" href="${esc(p.live)}" target="_blank" rel="noopener">${ICON_EXT} زيارة</a>`
    : `<span class="wc-none">مش منشور</span>`
  const repo = p.repo
    ? `<a class="wc-repo" href="${esc(p.repo)}" target="_blank" rel="noopener">${ICON_REPO} الكود</a>`
    : `<span class="wc-none">كود خاص</span>`
  return `
  <article class="wcard" data-id="${esc(p.id)}">
    <div class="wc-shot">
      <img src="${esc(p.img)}" alt="واجهة ${esc(p.title)}" loading="lazy" decoding="async" />
      <span class="wc-badge${p.private ? ' priv' : ''}">${esc(p.kind)}</span>
    </div>
    <div class="wc-body">
      <div class="wc-top">
        <h3>${esc(p.title)}</h3>
        <span class="wc-year" dir="ltr">${esc(p.year)}</span>
      </div>
      <p>${esc(p.desc)}</p>
      <div class="wc-tech">${p.tech.map((t) => `<span dir="ltr">${esc(t)}</span>`).join('')}</div>
      <div class="wc-links">${live}${repo}</div>
    </div>
  </article>`
}

function matches(p) {
  if (activeCat !== 'all' && p.cat !== activeCat) return false
  if (!query) return true
  const hay = [p.title, p.kind, p.desc, ...p.tech, p.year].join(' ').toLowerCase()
  return query.split(/\s+/).filter(Boolean).every((w) => hay.includes(w))
}

function sortList(list) {
  const out = [...list]
  if (sortBy === 'new') out.sort((a, b) => b.year.localeCompare(a.year) || a.title.localeCompare(b.title, 'ar'))
  else if (sortBy === 'az') out.sort((a, b) => a.title.localeCompare(b.title, 'ar'))
  else out.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
  return out
}

let revealIO = null
function paint() {
  const list = sortList(PROJECTS.filter(matches))
  grid.innerHTML = list.map(cardHTML).join('')
  countEl.textContent = list.length === 1 ? 'مشروع واحد' : `${list.length} مشروع`
  emptyEl.hidden = list.length > 0
  grid.hidden = list.length === 0

  const cards = $$('.wcard', grid)
  if (reduced) {
    cards.forEach((c) => c.classList.add('in'))
  } else {
    revealIO?.disconnect()
    revealIO = new IntersectionObserver((entries, obs) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return
        en.target.classList.add('in')
        obs.unobserve(en.target)
      })
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' })
    cards.forEach((c, i) => {
      c.style.transitionDelay = `${Math.min(i, 8) * 40}ms`
      revealIO.observe(c)
    })
  }
}

filtersEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-cat]')
  if (!btn) return
  activeCat = btn.dataset.cat
  $$('button', filtersEl).forEach((b) => {
    const on = b === btn
    b.classList.toggle('on', on)
    b.setAttribute('aria-selected', String(on))
  })
  paint()
})

let searchTimer = 0
searchEl.addEventListener('input', () => {
  clearEl.hidden = !searchEl.value
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    query = searchEl.value.trim().toLowerCase()
    paint()
  }, 130)
})

clearEl.addEventListener('click', () => {
  searchEl.value = ''
  clearEl.hidden = true
  query = ''
  paint()
  searchEl.focus()
})

sortEl.addEventListener('change', () => {
  sortBy = sortEl.value
  paint()
})

resetEl.addEventListener('click', () => {
  activeCat = 'all'
  query = ''
  sortBy = 'featured'
  searchEl.value = ''
  clearEl.hidden = true
  sortEl.value = 'featured'
  $$('button', filtersEl).forEach((b) => {
    const on = b.dataset.cat === 'all'
    b.classList.toggle('on', on)
    b.setAttribute('aria-selected', String(on))
  })
  paint()
})

paint()

/* ============================================================
   3. portrait hover: tilt + spotlight
   ============================================================ */
const faceWrap = $('.face-wrap')
const hero = $('#home')

if (faceWrap && hero && finePointer && !reduced) {
  let frame = 0
  let nx = 0
  let ny = 0

  const paintFace = () => {
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
    if (!frame) frame = requestAnimationFrame(paintFace)
  }

  hero.addEventListener('pointerenter', () => faceWrap.classList.add('is-hot'))
  hero.addEventListener('pointermove', readPointer)
  hero.addEventListener('pointerleave', () => {
    faceWrap.classList.remove('is-hot')
    nx = ny = 0
    if (!frame) frame = requestAnimationFrame(paintFace)
  })
}

/* ============================================================
   4. scroll spy
   ============================================================ */
const pills = $$('.pill')
const map = { home: 1, work: 2, 'all-work': 2, about: 3, stats: 4, contact: 0 }

const spy = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return
    pills.forEach((p) => p.classList.remove('active'))
    const idx = map[en.target.id]
    if (idx) pills[idx]?.classList.add('active')
  })
}, { rootMargin: '-45% 0px -50% 0px' })

;['home', 'work', 'all-work', 'about', 'stats', 'contact'].forEach((id) => {
  const el = document.getElementById(id)
  if (el) spy.observe(el)
})

/* ============================================================
   5. reveal on scroll
   ============================================================ */
const targets = $$('.sec-head, .tech-grid li, .about-photo, .about-text, .stat, .contact > *')
targets.forEach((el) => el.setAttribute('data-reveal', ''))

const io = new IntersectionObserver((entries, obs) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return
    en.target.classList.add('is-in')
    obs.unobserve(en.target)
  })
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })
targets.forEach((el) => io.observe(el))

/* ============================================================
   6. lead form
   ============================================================ */
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

const leadForm = $('#leadForm')
const leadStatus = $('#leadStatus')
const leadBtn = leadForm?.querySelector('.lf-send')

function setLeadStatus(text, tone) {
  if (!leadStatus) return
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
      p_honeypot: ''
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

/* ============================================================
   7. year + counts
   ============================================================ */
const yearEl = $('#year')
if (yearEl) yearEl.textContent = new Date().getFullYear()

const totalEl = $('#projTotal')
if (totalEl) totalEl.textContent = PROJECTS.length

/* ============================================================
   8. mobile nav drawer
   ============================================================ */
const navEl = $('#nav')
const menuBtn = $('#menu')

if (navEl && menuBtn) {
  const setOpen = (open) => {
    navEl.classList.toggle('open', open)
    menuBtn.setAttribute('aria-expanded', String(open))
  }
  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation()
    setOpen(!navEl.classList.contains('open'))
  })
  navEl.addEventListener('click', (e) => {
    if (e.target.closest('.pill')) setOpen(false)
  })
  document.addEventListener('click', (e) => {
    if (!navEl.contains(e.target)) setOpen(false)
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false)
  })
}
