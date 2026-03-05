REFACTORING OPPORTUNITIES
1. Authentication system
typescript// Current: No auth (public API)
// Should add:
import { authenticate } from '../middleware/auth';
router.post('/scraper/trigger', authenticate, controller.trigger);
2. Validation layer
typescript// Current: Manual validation in controllers
if (!email) throw new AppError('Email required', 400);

// Better: Use validation library
import { body, validationResult } from 'express-validator';
router.post('/subscribe',
  body('email').isEmail(),
  controller.subscribe
);
3. Queue system
typescript// Current: Cron jobs run directly
// Better: Use queue (Bull/BullMQ)
import Queue from 'bull';
const scrapeQueue = new Queue('scrape', redisUrl);
scrapeQueue.process(async (job) => {
  await scraperService.scrapeAll();
});
4. Cache layer
typescript// Current: Every request hits database
// Better: Add Redis cache
const headlines = await cache.get('headlines:tech');
if (!headlines) {
  headlines = await Headline.find({ category: 'tech' });
  await cache.set('headlines:tech', headlines, 300); // 5 min TTL
}
5. Testing
typescript// Current: No tests
// Should add:
describe('HeadlineService', () => {
  it('should return filtered headlines', async () => {
    const headlines = await service.getHeadlines({ category: 'tech' });
    expect(headlines).toHaveLength(10);
  });
});