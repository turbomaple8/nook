/* Klaro Consent Manager — Nook Co-Living
 * UK GDPR + PECR compliant cookie consent
 * Self-hosted (klaro.js v0.7) — no third-party CDN
 *
 * On change: edit services[] below + redeploy
 * Spec: INTAKE-20260425-nookrent/artifacts/specs/spec-analytics-tracking.json
 */

var klaroConfig = {
  version: 1,
  elementID: 'klaro',
  styling: { theme: ['light', 'top', 'wide'] },
  noAutoLoad: false,
  htmlTexts: true,
  embedded: false,
  groupByPurpose: true,
  storageMethod: 'cookie',
  cookieName: 'klaro',
  cookieExpiresAfterDays: 365,
  default: false,
  mustConsent: false,
  acceptAll: true,
  hideDeclineAll: false,
  hideLearnMore: false,
  noticeAsModal: false,
  privacyPolicy: '/cookie-policy',

  translations: {
    en: {
      consentModal: {
        title: 'Cookies & Privacy at Nook',
        description:
          'We use cookies to make the site work and — only if you say yes — to understand how visitors use the site so we can make it better. You decide what to allow. Read more in our <a href="/cookie-policy">cookie policy</a>.'
      },
      consentNotice: {
        changeDescription:
          'There were changes since your last visit, please renew your consent.',
        description:
          'Hi! Could we please enable {purposes} so we can understand how the site is used? You can always change your mind later.',
        learnMore: 'Let me choose'
      },
      acceptAll: 'Accept all',
      acceptSelected: 'Accept selected',
      decline: 'Reject all',
      ok: 'Save choices',
      poweredBy: 'Built with Klaro',
      privacyPolicy: {
        name: 'cookie policy',
        text: 'For full details on the cookies we use, please read our {privacyPolicy}.'
      },
      purposes: {
        essential: {
          title: 'Essential',
          description: 'Required for the site to function (consent storage, security).'
        },
        analytics: {
          title: 'Analytics',
          description: 'Helps us understand which pages and rooms visitors are interested in. Anonymous, no cross-site tracking.'
        },
        marketing: {
          title: 'Marketing',
          description: 'Lets us measure whether ads are reaching the right people. Used by Meta and Google when ad campaigns are running.'
        }
      },
      service: {
        disableAll: { title: 'Reject all optional services', description: 'Use this to reject all optional services at once.' },
        optOut: { title: '(opt-out)', description: 'Loaded by default. Opt out below.' },
        required: { title: '(required)', description: 'Always loaded — needed for site to function.' },
        purposes: 'Purposes',
        purpose: 'Purpose'
      }
    }
  },

  services: [
    {
      name: 'klaro',
      title: 'Klaro Consent Manager',
      purposes: ['essential'],
      required: true,
      cookies: [/^klaro/]
    }
    // Analytics services (GA4, GTM) added in INTAKE-R-004
    // Marketing services (Meta Pixel) added in INTAKE-R-005
  ]
};

if (typeof window !== 'undefined') {
  window.klaroConfig = klaroConfig;
}
