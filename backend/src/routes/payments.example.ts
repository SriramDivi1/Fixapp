/**
 * Example Payment Routes - Demonstrates best practices for:
 * - Input validation for payment data
 * - Strict rate limiting for payment endpoints
 * - Signature verification for webhooks
 * - Type safety
 * 
 * This is a reference implementation for Razorpay integration.
 */

import { Router } from 'express';
import { validate } from '@/middleware/validation';
import { paymentLimiter } from '@/middleware/rateLimiter';
import { authenticateUser } from '@/middleware/auth';
import { 
  createPaymentOrderSchema, 
  verifyPaymentSchema 
} from '@/validators/schemas';
import type { Request, Response } from 'express';
import crypto from 'crypto';

const router = Router();

// All payment routes require authentication
router.use(authenticateUser);

/**
 * POST /api/payments/create-order
 * Create a Razorpay payment order
 * 
 * Rate limit: 3 requests per minute (strict to prevent abuse)
 * Authentication: Required
 * Validation: Valid appointment ID and reasonable amount
 */
router.post(
  '/create-order',
  paymentLimiter, // Strict rate limiting
  validate(createPaymentOrderSchema),
  async (req: Request, res: Response) => {
    try {
      const { appointment_id, amount } = req.body;
      
      // TODO: Implement order creation
      // 1. Verify appointment exists and belongs to user
      // 2. Verify amount matches consultation fee
      // 3. Create Razorpay order
      // 4. Store order details in database
      
      // Example Razorpay order creation:
      // const order = await razorpay.orders.create({
      //   amount: amount * 100, // Convert to paise
      //   currency: 'INR',
      //   receipt: `apt_${appointment_id}`,
      //   notes: {
      //     appointment_id,
      //     user_id: req.user.id
      //   }
      // });
      
      res.status(201).json({
        success: true,
        data: {
          order_id: 'order_mock_123',
          amount: amount,
          currency: 'INR'
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create payment order',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature
 * 
 * Rate limit: 3 requests per minute
 * Authentication: Required
 * Validation: All Razorpay IDs and signature required
 */
router.post(
  '/verify',
  paymentLimiter, // Strict rate limiting
  validate(verifyPaymentSchema),
  async (req: Request, res: Response) => {
    try {
      const { 
        razorpay_order_id, 
        razorpay_payment_id, 
        razorpay_signature,
        appointment_id 
      } = req.body;
      
      // Verify signature
      const isValid = verifyRazorpaySignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
      );
      
      if (!isValid) {
        return res.status(400).json({
          success: false,
          message: 'Invalid payment signature'
        });
      }
      
      // TODO: Update appointment payment status
      // 1. Mark payment as completed
      // 2. Update appointment status
      // 3. Send confirmation notification
      // 4. Generate receipt
      
      res.json({
        success: true,
        message: 'Payment verified successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Payment verification failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
);

/**
 * POST /api/payments/webhook
 * Handle Razorpay webhook events
 * 
 * No authentication (uses signature verification instead)
 * No rate limiting (webhooks should not be rate limited)
 */
router.post('/webhook', async (req: Request, res: Response) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'] as string;
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      throw new Error('Webhook secret not configured');
    }
    
    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');
    
    if (webhookSignature !== expectedSignature) {
      return res.status(400).json({
        success: false,
        message: 'Invalid webhook signature'
      });
    }
    
    // Handle different event types
    const { event, payload } = req.body;
    
    switch (event) {
      case 'payment.captured':
        // TODO: Handle successful payment
        break;
      case 'payment.failed':
        // TODO: Handle failed payment
        break;
      case 'refund.created':
        // TODO: Handle refund
        break;
      default:
        console.log('Unhandled webhook event:', event);
    }
    
    // Always respond with 200 to acknowledge receipt
    res.json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed'
    });
  }
});

/**
 * Helper function to verify Razorpay payment signature
 */
function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string
): boolean {
  try {
    const keySecret = process.env.RAZORPAY_KEY_SECRET;
    
    if (!keySecret) {
      throw new Error('Razorpay key secret not configured');
    }
    
    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', keySecret)
      .update(body)
      .digest('hex');
    
    return expectedSignature === signature;
  } catch (error) {
    console.error('Signature verification error:', error);
    return false;
  }
}

export default router;
