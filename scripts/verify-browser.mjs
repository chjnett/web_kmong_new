import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

await mkdir('/private/tmp/aero-qa', { recursive: true });
const browser = await chromium.launch({
 executablePath: '/Users/cheonhyeonjun/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
 headless: true,
 args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'],
});
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.message));
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await page.screenshot({ path: '/private/tmp/aero-qa/desktop-hero.png' });
assert.equal(await page.locator('.hero h1').count(), 1);
assert.equal(await page.locator('.project').count(), 3);
assert(await page.locator('video').evaluate(el => el.paused), 'Reduced motion must pause autoplay');
await page.getByRole('button', { name: '배경 영상 재생' }).click();
assert(await page.locator('video').evaluate(el => !el.paused), 'Manual video play must work');
await page.getByRole('button', { name: '배경 영상 일시정지' }).click();

await page.getByRole('button', { name: '견적 문의' }).click();
assert(await page.locator('.contact-dialog').evaluate(el => el.open));
await page.locator('.contact-form button[type=submit]').click();
assert.equal(await page.locator('.success-state').count(), 0, 'Empty form must be rejected');
await page.locator('[name=name]').fill('시연 고객');
await page.locator('[name=phone]').fill('010-1234-5678');
await page.locator('[name=location]').fill('서울 서초구 반포동');
await page.locator('[name=type]').selectOption({ label: '아파트' });
await page.locator('[name=area]').fill('54');
await page.locator('[name=budget]').selectOption({ label: '1억 ~ 2억 원' });
await page.locator('[name=schedule]').selectOption({ label: '3 ~ 6개월 이내' });
await page.locator('[type=checkbox]').check();
await page.locator('.contact-form button[type=submit]').click();
await page.locator('.success-state').waitFor();
await page.getByRole('button', { name: '공간 더 둘러보기' }).click();
assert.equal(await page.locator('.contact-dialog').evaluate(el => el.open), false);
assert(await page.getByRole('button', { name: '견적 문의' }).evaluate(el => el === document.activeElement), 'Dialog should restore focus');
await page.locator('.project-image').first().click();
assert(await page.locator('.project-dialog').evaluate(el => el.open));
await page.keyboard.press('Escape');
assert.equal(await page.locator('.project-dialog').evaluate(el => el.open), false);

await page.locator('#showroom').scrollIntoViewIfNeeded();
const modelResponse = page.waitForResponse(response => response.url().endsWith('/models/showroom.glb'));
await page.getByRole('button', { name: '3D 공간 둘러보기' }).click();
assert.equal((await modelResponse).status(), 200);
await page.locator('canvas').waitFor();
await page.waitForTimeout(1800);
await page.locator('canvas').screenshot({ path: '/private/tmp/aero-qa/showroom-living.png' });
await page.locator('.viewer-label, .viewer-index').evaluateAll(elements => elements.forEach(el => el.style.visibility = 'hidden'));
await page.locator('canvas').screenshot({ path: 'public/images/showroom-poster.png' });
await page.locator('.viewer-label, .viewer-index').evaluateAll(elements => elements.forEach(el => el.style.visibility = ''));
await page.getByRole('tab', { name: /다이닝/ }).click();
assert.equal(await page.getByRole('tab', { name: /다이닝/ }).getAttribute('aria-selected'), 'true');
await page.waitForTimeout(350);
await page.locator('canvas').screenshot({ path: '/private/tmp/aero-qa/showroom-dining.png' });
await page.keyboard.press('ArrowRight');
assert.equal(await page.getByRole('tab', { name: /마감 디테일/ }).getAttribute('aria-selected'), 'true');
await page.locator('canvas').screenshot({ path: '/private/tmp/aero-qa/showroom-detail.png' });
await page.screenshot({ path: '/private/tmp/aero-qa/desktop-full.png', fullPage: true });
assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Desktop must not overflow horizontally');
for (const width of [390, 320]) {
 await page.setViewportSize({ width, height: 844 });
 await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
 assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px mobile must not overflow`);
 await page.getByRole('button', { name: '메뉴 열기' }).click();
 await page.locator('#mobile-nav').getByRole('link', { name: '프로젝트' }).click();
 assert.equal(await page.locator('#mobile-nav').count(), 0);
 await page.evaluate(() => scrollTo(0,0));
 await page.waitForTimeout(150);
 await page.screenshot({ path: `/private/tmp/aero-qa/mobile-${width}.png` });
 await page.screenshot({ path: `/private/tmp/aero-qa/mobile-full-${width}.png`, fullPage: true });
}
const images = await page.locator('img').evaluateAll(elements => elements.map(el => ({ src: el.getAttribute('src'), loaded: el.complete && el.naturalWidth > 0 })));
assert(images.every(image => image.loaded), JSON.stringify(images));
assert.equal(errors.length, 0, errors.join('\n'));
console.log('PASS: Desktop + 390/320px mobile, video controls, form validation and success, modal focus/escape, GLB loading, 3D viewpoints and keyboard tabs, images, no horizontal overflow or runtime errors.');
await browser.close();
