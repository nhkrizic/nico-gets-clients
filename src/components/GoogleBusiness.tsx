import { Button } from "@/components/ui/button";

type Props = {
  /** Paste the EXACT value of your Google Maps <iframe src="..."> */
  iframeSrc: string;
  /** Optional: Google Place ID to enable “Write a review” & open-in-Maps links */
  placeId?: string;
  /** Optional: clickable phone number */
  phone?: string;
  /** Optional: displayed business name */
  businessName?: string;
};

export default function GoogleBusiness({
  iframeSrc,
  placeId,
  phone = "+41 79 887 44 23",
  businessName = "Knicc IT Services",
}: Props) {
  const reviewUrl = placeId
    ? `https://search.google.com/local/writereview?placeid=${placeId}`
    : undefined;

  const mapsUrl = placeId
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        businessName
      )}&query_place_id=${placeId}`
    : `https://www.google.com/maps?q=${encodeURIComponent(businessName)}`;

  return (
    <section className="py-12 bg-gradient-to-b from-background to-card/20">
      <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-8 items-center">
        {/* Map embed */}
        <div className="rounded-2xl overflow-hidden shadow-sm border border-border">
          <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
            <iframe
              title={`${businessName} — Google Maps`}
              src={iframeSrc}
              width="100%"
              height="100%"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              allowFullScreen
            />
          </div>
        </div>

        {/* Business blurb + actions */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{businessName}</h2>
          <p className="text-muted-foreground">
            IT-Support, Cloud-Migration, Webentwicklung & IT-Sicherheit in der
            ganzen Schweiz. Vor Ort & remote – schnelle Reaktion, klare SLAs.
          </p>

          <div className="flex flex-wrap gap-3">
            <a href={`tel:${phone.replace(/\s+/g, "")}`}>
              <Button>Jetzt anrufen</Button>
            </a>
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <Button variant="outline">In Google Maps öffnen</Button>
            </a>
            {reviewUrl && (
              <a href={reviewUrl} target="_blank" rel="noreferrer">
                <Button variant="secondary">Google-Bewertung abgeben</Button>
              </a>
            )}
          </div>

          <ul className="text-sm text-muted-foreground list-disc pl-5">
            <li>Service-Areas: Zürich, St. Gallen, Bern, Basel, Luzern, Zug</li>
            <li>Leistungen: Managed IT, Netzwerk, Cybersecurity, M365, Web</li>
          </ul>
        </div>
      </div>
    </section>
  );
}

