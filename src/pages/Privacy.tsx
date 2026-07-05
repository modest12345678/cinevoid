import SEO from '../components/SEO';

export default function Privacy() {
  return (
    <main className="pt-28 pb-20 max-w-3xl mx-auto px-6 text-on-surface">
      <SEO title="Privacy Policy | CINEVIDEO" canonicalUrl="https://cinevideo.xyz/privacy" />
      <h1 className="text-4xl font-extrabold text-primary-container mb-6">Privacy Policy</h1>
      <p className="text-on-surface-variant mb-4">Last updated: July 2026</p>
      <section className="space-y-6 text-on-surface-variant leading-relaxed">
        <p>CINEVIDEO ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you visit our website at <strong className="text-on-surface">CINEVIDEO.com</strong>.</p>
        <h2 className="text-xl font-bold text-on-surface">Information We Collect</h2>
        <p>We do not require you to create an account and we do not collect any personally identifiable information. We may collect anonymous usage data (such as pages visited and device type) via third-party analytics tools to improve the service.</p>
        <h2 className="text-xl font-bold text-on-surface">Cookies & Advertising</h2>
        <p>We use third-party advertising partners who may place cookies on your device to serve relevant advertisements. These partners collect data in accordance with their own privacy policies. You may opt out of personalised advertising through your browser settings or via the IAB opt-out portal.</p>
        <h2 className="text-xl font-bold text-on-surface">Third-Party Services</h2>
        <p>We use the following third-party APIs to power content on this site: The Movie Database (TMDb), Jikan (MyAnimeList), Studio Ghibli API, and Watchmode. Each of these services has its own privacy policy.</p>
        <h2 className="text-xl font-bold text-on-surface">Children's Privacy</h2>
        <p>Our service is not directed to children under the age of 13. We do not knowingly collect personal information from children.</p>
        <h2 className="text-xl font-bold text-on-surface">Contact</h2>
        <p>If you have questions about this policy, please contact us at <strong className="text-on-surface">privacy@CINEVIDEO.com</strong>.</p>
      </section>
    </main>
  );
}
