# Analyzer

This directory will contain NLP and trend analysis logic.

**Planned modules:**
- Keyword extraction (TF-IDF, noun phrase extraction)
- Sentiment analysis
- Topic categorization
- Co-occurrence matrix (related keywords)

**Integration point:**
Analyzer will be called by `trendService.detectTrends()` to process headlines.
```

---

## Architecture Decisions Explained

### **1. Why This Layered Architecture?**
```
Routes → Controllers → Services → Models → Database
```

- **Routes**: Define endpoints, no logic
- **Controllers**: Handle HTTP (parse query params, set status codes)
- **Services**: Pure business logic, reusable, testable
- **Models**: Data schema and validation
- **Database**: MongoDB via Mongoose

**Benefit**: Swap out Express for Fastify? Only touch routes/controllers. Change trend algorithm? Only touch `trendService.ts`. Add GraphQL? Import services directly.

---

### **2. Data Flow**
```
Scraper → headlineService.bulkCreateHeadlines() → Headline collection
                                                          ↓
                                              trendService.detectTrends() (cron)
                                                          ↓
                                                   Trend collection
                                                          ↓
                                              insightService.generateInsights() (cron)
                                                          ↓
                                                  Insight collection
                                                          ↓
                                              newsletterJob (weekly cron)
                                                          ↓
                                              emailService.sendNewsletter()