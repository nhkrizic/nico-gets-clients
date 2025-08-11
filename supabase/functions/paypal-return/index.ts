import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const url = new URL(req.url)
    const pathSegments = url.pathname.split('/')
    const action = pathSegments[pathSegments.length - 1] // 'success' or 'cancel'
    
    const orderId = url.searchParams.get('token')
    const payerId = url.searchParams.get('PayerID')

    console.log('PayPal return:', { action, orderId, payerId })

    if (action === 'success' && orderId && payerId) {
      // In a real implementation, you would:
      // 1. Capture the PayPal payment using orderId and payerId
      // 2. Update the payment status in your database
      // 3. Redirect to a success page with proper confirmation
      
      const redirectUrl = `${url.origin}/?payment=success&orderId=${orderId}`
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl
        }
      })
    } else if (action === 'cancel') {
      const redirectUrl = `${url.origin}/?payment=cancelled&orderId=${orderId || ''}`
      
      return new Response(null, {
        status: 302,
        headers: {
          ...corsHeaders,
          'Location': redirectUrl
        }
      })
    }

    // Default response for invalid requests
    return new Response('Invalid PayPal return request', {
      status: 400,
      headers: corsHeaders
    })

  } catch (error) {
    console.error('Error in paypal-return function:', error)
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})