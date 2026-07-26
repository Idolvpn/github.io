# سایت IdolVPN

سایت معرفی کانال و ربات تلگرام **IdolVPN**، دو زبانه (فارسی/انگلیسی)، با تم تیره/روشن، که بخش «آخرین پست‌ها»ی آن هر روز به‌صورت خودکار از کانال تلگرام همگام‌سازی می‌شود. کاملاً استاتیک است و روی **GitHub Pages** رایگان اجرا می‌شود.

## ساختار پروژه
```
index.html              صفحهٔ اصلی (تمام بخش‌ها)
css/style.css           استایل کامل سایت (توکن‌های رنگ/تایپوگرافی در بالای فایل)
js/i18n.js              دیکشنری متن فارسی/انگلیسی — همهٔ متن‌های سایت اینجاست
js/main.js              زبان، تم، انیمیشن اسکرول، رفتار iframe تست سرعت
js/posts.js             خواندن data/posts.json و ساخت فید «آخرین پست‌ها»
data/posts.json         داده‌ی پست‌ها (هر روز به‌صورت خودکار آپدیت می‌شود)
scripts/fetch-posts.mjs اسکریپت Node که پست‌های کانال را می‌خواند
.github/workflows/update-posts.yml   جاب زمان‌بندی‌شدهٔ روزانه
assets/                 لوگو و فاویکون (از لوگوی خود IdolVPN ساخته شده)
```

## راه‌اندازی روی GitHub Pages (بدون نیاز به کدنویسی)

1. یک ریپازیتوری جدید در گیت‌هاب بسازید (مثلاً `idolvpn-site`) و تمام فایل‌های این پوشه را در آن آپلود/پوش کنید.
2. به تب **Settings → Pages** بروید. زیر «Build and deployment»، گزینهٔ **Deploy from a branch** را انتخاب کنید؛ برنچ `main` و پوشهٔ `/ (root)` را انتخاب و ذخیره کنید.
   - بعد از چند دقیقه، سایت روی آدرسی شبیه `https://USERNAME.github.io/idolvpn-site/` در دسترس است.
3. برای اینکه جاب روزانهٔ همگام‌سازی پست‌ها بتواند تغییرات را کامیت کند، به **Settings → Actions → General** بروید، پایین صفحه بخش «Workflow permissions» را روی **Read and write permissions** بگذارید و ذخیره کنید.
4. همین! از این به بعد، هر روز ساعت ۳ بامداد UTC (تقریباً ۶:۳۰ صبح ایران)، جاب گیت‌هاب به‌صورت خودکار آخرین پست‌های عمومی کانال `t.me/s/Idolvpn` را می‌خواند و در `data/posts.json` ذخیره می‌کند؛ سایت هم همان لحظه که کاربر صفحه را باز کند، این فایل را می‌خواند و بخش «آخرین پست‌ها» را می‌سازد.

برای اجرای فوری (بدون صبر تا فردا)، به تب **Actions** بروید، روی workflow با نام «Sync latest Telegram posts» کلیک کنید و دکمهٔ **Run workflow** را بزنید.

## نکات مهم دربارهٔ همگام‌سازی خودکار

- این اسکریپت از صفحهٔ پیش‌نمایش عمومی تلگرام (`https://t.me/s/Idolvpn`) می‌خواند؛ همان صفحه‌ای که بدون لاگین و بدون توکن ربات در دسترس است. بنابراین فقط برای **کانال‌های عمومی** کار می‌کند و نیازی به هیچ کلید یا رمزی ندارد.
- اگر ساختار HTML تلگرام در آینده تغییر کند، ممکن است لازم باشد سلکتورهای CSS داخل `scripts/fetch-posts.mjs` به‌روزرسانی شوند.
- اگر جاب به هر دلیلی (قطعی موقت شبکه و مانند آن) شکست بخورد، فایل قبلی دست‌نخورده باقی می‌ماند تا فید خالی نشود.
- محدودیت تعداد پست‌ها در بالای اسکریپت با متغیر `MAX_POSTS` قابل تغییر است.

## ویرایش متن‌ها

تمام متن‌های فارسی و انگلیسی سایت (تیتر‌ها، توضیحات، دکمه‌ها، سوالات متداول) در یک فایل جمع شده‌اند: **`js/i18n.js`**. برای تغییر هر متنی، همان کلید را زیر هر دو بخش `fa` و `en` ویرایش کنید — نیازی به دست‌زدن به HTML نیست.

## تغییر لینک‌ها

اگر آدرس کانال، ربات یا ابزار تست سرعت تغییر کرد، این سه آدرس را در `index.html` جای‌گزین کنید:
- کانال: `https://t.me/Idolvpn`
- ربات: `https://t.me/Idolvpn_robot`
- ابزار تست سرعت/نشتی: `https://idolvpn.testplus.workers.dev/`

## دامنهٔ اختصاصی (اختیاری)

اگر دامنهٔ شخصی دارید، کافی است در **Settings → Pages → Custom domain** آن را وارد کنید؛ گیت‌هاب فایل `CNAME` را خودش می‌سازد.

---

### About this project (EN)

A bilingual (Persian/English) static landing site for the IdolVPN Telegram channel & bot, with dark/light themes and a "Latest Posts" section that auto-syncs daily from the channel's public preview page via a scheduled GitHub Action (see `.github/workflows/update-posts.yml` and `scripts/fetch-posts.mjs`). No backend, no build step — just enable GitHub Pages (`Settings → Pages → Deploy from a branch → main → / (root)`) and turn on write permissions for Actions (`Settings → Actions → General → Workflow permissions → Read and write`).
