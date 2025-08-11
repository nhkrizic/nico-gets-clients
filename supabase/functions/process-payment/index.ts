import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const PAYPAL_CLIENT_ID = Deno.env.get('PAYPAL_CLIENT_ID')
    const PAYPAL_CLIENT_SECRET = Deno.env.get('PAYPAL_CLIENT_SECRET')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
      throw new Error('PayPal credentials not configured')
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
    const { paymentMethod, amount, currency, serviceId, userId, appointmentId, guestEmail } = await req.json()

    // Validate required fields (userId is now optional for guest payments)
    if (!paymentMethod || !amount || !currency || !serviceId) {
      throw new Error('Missing required payment fields')
    }

    // Use guestEmail if no userId provided
    const emailForPayment = userId ? null : (guestEmail || 'guest@example.com')

    console.log('Processing payment:', { paymentMethod, amount, currency, serviceId, userId, appointmentId, guestEmail })

    // Get PayPal access token
    const getPayPalAccessToken = async () => {
      const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en_US',
          'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'grant_type=client_credentials'
      })
      
      const data = await response.json()
      return data.access_token
    }

    if (paymentMethod === 'paypal') {
      const accessToken = await getPayPalAccessToken()
      
      // Create PayPal order
      const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': crypto.randomUUID()
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: currency.toUpperCase(),
              value: (amount / 100).toFixed(2)
            },
            description: `IT Service Payment - Service ID: ${serviceId}`
          }],
          application_context: {
            return_url: 'https://cesqzqdqsgflioyrjvuh.supabase.co/functions/v1/process-payment/success',
            cancel_url: 'https://cesqzqdqsgflioyrjvuh.supabase.co/functions/v1/process-payment/cancel'
          }
        })
      })

      const orderData = await orderResponse.json()
      console.log('PayPal order created:', orderData)

      if (orderData.id) {
        // Save payment record to database
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId, // Can be null for guest payments
            amount: amount,
            currency: currency,
            payment_method: 'paypal',
            payment_status: 'pending',
            transaction_id: orderData.id,
            appointment_id: appointmentId
          })
          .select()
          .single()

        if (paymentError) {
          console.error('Error saving payment:', paymentError)
          throw new Error('Failed to save payment record')
        }

        // Return the approval URL for PayPal checkout
        const approvalUrl = orderData.links?.find((link: any) => link.rel === 'approve')?.href
        
        return new Response(JSON.stringify({
          success: true,
          paymentId: payment.id,
          approvalUrl: approvalUrl,
          orderId: orderData.id
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    } else if (paymentMethod === 'card') {
      // Use PayPal for credit card processing as well
      const accessToken = await getPayPalAccessToken()
      
      // Create PayPal order for credit card payment (same as PayPal flow)
      const orderResponse = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'PayPal-Request-Id': crypto.randomUUID()
        },
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [{
            amount: {
              currency_code: currency.toUpperCase(),
              value: (amount / 100).toFixed(2)
            },
            description: `IT Service Payment - Service ID: ${serviceId}`
          }],
          application_context: {
            return_url: 'https://cesqzqdqsgflioyrjvuh.supabase.co/functions/v1/process-payment/success',
            cancel_url: 'https://cesqzqdqsgflioyrjvuh.supabase.co/functions/v1/process-payment/cancel'
          }
        })
      })

      const orderData = await orderResponse.json()
      console.log('PayPal order created for card payment:', orderData)

      if (orderData.id) {
        // Save payment record to database
        const { data: payment, error: paymentError } = await supabase
          .from('payments')
          .insert({
            user_id: userId, // Can be null for guest payments
            amount: amount,
            currency: currency,
            payment_method: 'card',
            payment_status: 'pending', // Changed to pending until payment is completed
            transaction_id: orderData.id,
            appointment_id: appointmentId
          })
          .select()
          .single()

        if (paymentError) {
          console.error('Error saving card payment:', paymentError)
          throw new Error('Failed to save payment record')
        }

        // Return the approval URL for PayPal checkout (allows both PayPal and card payments)
        const approvalUrl = orderData.links?.find((link: any) => link.rel === 'approve')?.href
        
        return new Response(JSON.stringify({
          success: true,
          paymentId: payment.id,
          approvalUrl: approvalUrl,
          orderId: orderData.id,
          message: 'Redirecting to secure payment processing'
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    throw new Error('Invalid payment method')

  } catch (error) {
    console.error('Error in process-payment function:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})