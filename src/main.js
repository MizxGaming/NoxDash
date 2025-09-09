// ---- Utilities
const $ = (sel) => document.querySelector(sel)

// Global state
const state = {
  dark: false,
  time12h: false,
  focus: '',
  commands: [],
  weather: null,
}

// ---- Theme
function loadTheme() {
  const saved = localStorage.getItem('theme')
  state.dark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  document.querySelector('#app').classList.toggle('theme-dark', state.dark)
  document.querySelector('#app').classList.toggle('theme-light', !state.dark)
}
function toggleTheme() {
  state.dark = !state.dark
  document.querySelector('#app').classList.toggle('theme-dark', state.dark)
  document.querySelector('#app').classList.toggle('theme-light', !state.dark)
  localStorage.setItem('theme', state.dark ? 'dark' : 'light')
}

// ---- Clock and Greeting
function pad(n){ return n.toString().padStart(2,'0') }
function formatTime(d) {
  let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds()
  if (state.time12h) {
    const suffix = h >= 12 ? 'PM' : 'AM'
    h = h % 12 || 12
    return `${pad(h)}:${pad(m)}:${pad(s)} ${suffix}`
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
function greetingForHour(h) {
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}
function tick() {
  const now = new Date()
  $('#clock').textContent = formatTime(now)
  $('#date').textContent = now.toLocaleDateString(undefined, { weekday:'long', year:'numeric', month:'long', day:'numeric' })
  $('#greeting').textContent = greetingForHour(now.getHours())
}
setInterval(tick, 1000)

// ---- Quotes
const quotes = [
  ['Simplicity is the ultimate sophistication.', 'Leonardo da Vinci'],
  ['Perfection is achieved when there is nothing left to take away.', 'Antoine de Saint‑Exupéry'],
  ['Well begun is half done.', 'Aristotle'],
  ['Make it work, make it right, make it fast.', 'Kent Beck'],
  ['The details are not the details. They make the design.', 'Charles Eames'],
]
let qi = Math.floor(Math.random() * quotes.length)
function rotateQuote() {
  const [q, by] = quotes[qi]
  $('#quote').textContent = `“${q}”`
  $('#quoteBy').textContent = `— ${by}`
  qi = (qi + 1) % quotes.length
}
setInterval(rotateQuote, 15000)

// ---- Weather (Open‑Meteo)
const weatherMap = {
  0: 'Clear', 1: 'Mainly clear', 2: 'Partly cloudy', 3: 'Overcast',
  45: 'Fog', 48: 'Rime fog',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Rain',
  71: 'Snow', 73: 'Snow', 75: 'Snow',
  80: 'Showers', 81: 'Showers', 82: 'Showers',
  95: 'Thunderstorm', 96: 'Thunderstorm', 99: 'Thunderstorm'
}
async function fetchWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Weather request failed')
  const data = await res.json()
  const cw = data.current_weather
  state.weather = cw
  $('#temp').textContent = `${Math.round(cw.temperature)}°C`
  $('#wind').textContent = `${Math.round(cw.windspeed)} km/h`
  $('#sky').textContent = weatherMap[cw.weathercode] ?? `Code ${cw.weathercode}`
  $('#weatherStatus').textContent = 'Now'
}
function geoWeather() {
  $('#weatherStatus').textContent = 'Locating…'
  if (!('geolocation' in navigator)) {
    $('#weatherStatus').textContent = 'Geolocation unavailable'
    return
  }
  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      try {
        await fetchWeather(pos.coords.latitude, pos.coords.longitude)
      } catch (e) {
        $('#weatherStatus').textContent = 'Weather error'
        console.error(e)
      }
    },
    (err) => {
      $('#weatherStatus').textContent = 'Allow location to show weather'
      console.warn(err)
    },
    { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
  )
}

// ---- Focus card
function startFocus() {
  const val = $('#focusInput').value.trim()
  if (!val) return
  state.focus = val
  localStorage.setItem('focus', state.focus)
  $('#focusDisplay').textContent = val
  $('#focusDisplay').classList.remove('hidden')
  $('#focusInput').classList.add('hidden')
}
function clearFocus() {
  state.focus = ''
  localStorage.removeItem('focus')
  $('#focusDisplay').classList.add('hidden')
  $('#focusInput').classList.remove('hidden')
  $('#focusInput').value = ''
}

// ---- Command Palette
const palette = {
  open: false,
  idx: 0,
  el: null, list: null, input: null, backdrop: null, closeBtn: null,
}
function defineCommands() {
  state.commands = [
    { name: 'Toggle Theme', run: () => toggleTheme() },
    { name: 'Switch Time Format', run: () => { state.time12h = !state.time12h; tick() } },
    { name: 'Refresh Weather', run: () => geoWeather() },
    { name: 'Focus Mode: Start', run: () => startFocus() },
    { name: 'Focus Mode: Clear', run: () => clearFocus() },
    { name: 'About', run: () => window.open('https://github.com/YOUR_USERNAME/NoxDash', '_blank') },
  ]
}
function renderPalette(list, activeIdx = 0) {
  palette.list.innerHTML = ''
  list.forEach((cmd, i) => {
    const li = document.createElement('li')
    li.textContent = cmd.name
    if (i === activeIdx) li.classList.add('active')
    li.addEventListener('click', () => { cmd.run(); closePalette() })
    palette.list.appendChild(li)
  })
}
function openPalette() {
  palette.open = true
  palette.idx = 0
  palette.el.classList.remove('hidden')
  palette.backdrop.classList.remove('hidden')
  palette.input.value = ''
  const filtered = state.commands
  renderPalette(filtered, palette.idx)
  palette.el.setAttribute('aria-hidden', 'false')
  palette.input.focus()
}
function closePalette() {
  palette.open = false
  palette.el.classList.add('hidden')
  palette.backdrop.classList.add('hidden')
  palette.el.setAttribute('aria-hidden', 'true')
}
function filterPalette() {
  const q = palette.input.value.toLowerCase()
  const filtered = state.commands.filter(c => c.name.toLowerCase().includes(q))
  palette.idx = 0
  renderPalette(filtered, palette.idx)
}

// ---- Keyboard handling
function onGlobalKey(e) {
  const metaK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'
  if (metaK) { e.preventDefault(); openPalette(); return }
  if (!palette.open) return
  const q = palette.input.value.toLowerCase()
  const filtered = state.commands.filter(c => c.name.toLowerCase().includes(q))
  if (e.key === 'Escape') { closePalette(); return }
  if (e.key === 'ArrowDown') { e.preventDefault(); palette.idx = Math.min(palette.idx + 1, filtered.length - 1); renderPalette(filtered, palette.idx); return }
  if (e.key === 'ArrowUp') { e.preventDefault(); palette.idx = Math.max(palette.idx - 1, 0); renderPalette(filtered, palette.idx); return }
  if (e.key === 'Enter') { e.preventDefault(); if (filtered[palette.idx]) { filtered[palette.idx].run(); closePalette() } }
}

// ---- Wire-up
window.addEventListener('DOMContentLoaded', () => {
  // Palette refs
  palette.el = document.getElementById('palette')
  palette.list = document.getElementById('paletteList')
  palette.input = document.getElementById('paletteInput')
  palette.backdrop = document.getElementById('paletteBackdrop')
  palette.closeBtn = document.getElementById('paletteClose')

  // Init
  loadTheme()
  tick()
  rotateQuote()
  const savedFocus = localStorage.getItem('focus'); if (savedFocus) { document.getElementById('focusInput').value = savedFocus; startFocus() }
  defineCommands()
  geoWeather()

  // UI events
  document.getElementById('themeToggle').addEventListener('click', toggleTheme)
  document.getElementById('refreshWeather').addEventListener('click', geoWeather)
  document.getElementById('focusStart').addEventListener('click', startFocus)
  document.getElementById('focusClear').addEventListener('click', clearFocus)
  document.getElementById('openPalette').addEventListener('click', openPalette)
  palette.input.addEventListener('input', filterPalette)
  palette.backdrop.addEventListener('click', closePalette)
  palette.closeBtn.addEventListener('click', closePalette)
  document.addEventListener('keydown', onGlobalKey)
})
