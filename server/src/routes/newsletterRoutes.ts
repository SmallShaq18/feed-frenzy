import { Router } from 'express';
import * as newsletterController from '../controllers/newsletterController';

const router = Router();

/**
 * @route   POST /api/newsletter/subscribe
 * @desc    Subscribe to newsletter
 */
router.post('/subscribe', newsletterController.subscribe);

/**
 * @route   GET /api/newsletter/unsubscribe/:token
 * @desc    Unsubscribe via unique token
 */

router.get('/', newsletterController.getSubscribers);
router.get('/unsubscribe/:token', newsletterController.unsubscribe);

/**
 * @route   POST /api/newsletter/test
 * @desc    Send test newsletter to a specific email
 */
router.post('/test', newsletterController.sendTestNewsletter);

router.get('/subscribers', newsletterController.getSubscribers);

export default router;