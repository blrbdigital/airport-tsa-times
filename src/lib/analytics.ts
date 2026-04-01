/**
 * GA4 Analytics — lightweight wrapper around gtag
 *
 * Events:
 *   report_submitted  — user submits a wait time report
 *   airport_viewed    — user views an airport detail page
 *   near_me_used      — user taps the geolocation "Near me" button
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag(...args);
  }
}

/** Fire a custom GA4 event */
export function trackEvent(
  eventName: string,
  params?: Record<string, string | number | boolean>,
) {
  gtag('event', eventName, params);
}

/** User submitted a wait time report */
export function trackReportSubmitted(airportCode: string, checkpoint: string, waitMinutes: number) {
  trackEvent('report_submitted', {
    airport_code: airportCode,
    checkpoint,
    wait_minutes: waitMinutes,
  });
}

/** User viewed an airport detail page */
export function trackAirportViewed(airportCode: string, city: string) {
  trackEvent('airport_viewed', {
    airport_code: airportCode,
    city,
  });
}

/** User tapped "Near me" geolocation button */
export function trackNearMeUsed(nearestAirportCode?: string, distanceMiles?: number) {
  trackEvent('near_me_used', {
    nearest_airport: nearestAirportCode ?? 'unknown',
    distance_miles: distanceMiles ?? 0,
  });
}
