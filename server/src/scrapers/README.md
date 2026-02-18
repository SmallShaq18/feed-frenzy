# Scrapers

This directory will contain web scraping logic.

**Planned scrapers:**
- RSS feed parser
- Cheerio-based HTML scraper
- Source-specific scrapers (TechCrunch, HN, etc.)

**Integration point:**
Scrapers will be called by `src/jobs/scrapeJob.ts` and will use `headlineService.bulkCreateHeadlines()` to save results.