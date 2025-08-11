import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
  recaptchaToken: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, phone, service, message, recaptchaToken }: ContactEmailRequest = await req.json();

    // Verify reCAPTCHA token
    const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=6LeM0H8qAAAAADJxM6B1GaLoeHvywDkWPNngU4Ldh&response=${recaptchaToken}`,
    });

    const recaptchaResult = await recaptchaResponse.json();
    
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
      console.error("reCAPTCHA verification failed:", recaptchaResult);
      return new Response(
        JSON.stringify({ error: "reCAPTCHA verification failed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Send email to Nico
    const emailToNico = await resend.emails.send({
      from: "Contact Form <noreply@resend.dev>",
      to: ["Nico.krizic@knicc.shop"],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        ${service ? `<p><strong>Service Interest:</strong> ${service}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    });

    // Send confirmation email to user
    const confirmationEmail = await resend.emails.send({
      from: "Nico IT Services <noreply@resend.dev>",
      to: [email],
      subject: "Thank you for contacting Nico IT Services!",
      html: `
        <h1>Thank you for your message, ${name}!</h1>
        <p>I have received your message and will get back to you within 2 hours during business hours.</p>
        <p><strong>Your message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <br>
        <p>Best regards,<br>
        Nico Krizic<br>
        Nico IT Services<br>
        Phone: +41 79 887 4423<br>
        Email: Nico.krizic@knicc.shop</p>
      `,
    });

    console.log("Emails sent successfully:", { emailToNico, confirmationEmail });

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);