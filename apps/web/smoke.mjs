import { chromium } from 'playwright'

const routes = process.argv.slice(2)
const browser = await chromium.launch()
const page = await browser.newPage()

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(`[console.error] ${msg.text()}`)
})
page.on('pageerror', (err) => {
  errors.push(`[pageerror] ${err.message}\n${(err.stack ?? '').split('\n').slice(0, 6).join('\n')}`)
})

// sign in first (mock auth)
await page.goto('http://localhost:5173/sign-in', { waitUntil: 'networkidle' })
await page.fill('input[name="email"]', 'analyst@stemintel.gov.my')
await page.fill('input[name="password"]', 'Analyst#123')
await page.click('button:has-text("Sign in")')
await page.waitForURL('http://localhost:5173/', { timeout: 15000 })
errors.length = 0 // ignore sign-in page noise

for (const route of routes) {
  errors.length = 0
  await page.goto(`http://localhost:5173${route}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const body = await page.textContent('body')
  const is500 = body.includes("Something's wrong") || body.includes('500')
  console.log(`\n=== ${route} === ${is500 ? 'ERROR PAGE SHOWN' : 'OK'}`)
  if (errors.length) {
    console.log(errors.slice(0, 6).join('\n---\n'))
  }
}

await browser.close()
