/**
 * Fuggs CTA Section Component
 * Final call-to-action section
 */

class FuggsCtaSection extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section id="newsletter" class="gradient-cta py-20 px-4 text-white">
        <div class="container mx-auto text-center">
          <h2 class="text-4xl md:text-5xl font-bold mb-6">
            Jetzt für Public Beta anmelden
          </h2>

          <p class="text-xl md:text-2xl mb-10 max-w-3xl mx-auto opacity-90">
            Fuggs befindet sich aktuell in der Closed Beta. Melden Sie sich für unseren Newsletter an
            und erhalten Sie als Erste:r Zugang zur Public Beta.
          </p>

          <!-- Newsletter Signup Form (Listmonk) -->
          <div class="max-w-md mx-auto mb-8">
            <form method="post" action="https://newsletter.fuggs.de/subscription/form" class="listmonk-form flex flex-col gap-4">
              <input type="hidden" name="nonce" />

              <div class="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Ihre E-Mail-Adresse"
                  required
                  class="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Name (optional)"
                  class="flex-1 px-6 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>

              <div class="flex items-center justify-center gap-2">
                <input
                  id="fuggs-betalist"
                  type="checkbox"
                  name="l"
                  checked
                  value="80666e36-7523-4afa-a897-1a0f3c67f90d"
                  class="w-4 h-4 text-fuggs-orange bg-white border-gray-300 rounded focus:ring-2 focus:ring-white"
                />
                <label for="fuggs-betalist" class="text-sm font-medium">
                  Fuggs Beta-Liste (Produktupdates & Early Access)
                </label>
              </div>

              <button
                type="submit"
                class="bg-white text-fuggs-orange px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Anmelden
              </button>
            </form>
          </div>

          <p class="text-sm opacity-75">
            Kostenlos • Self-Hosting mit Docker • Open Source • DSGVO-konform
          </p>
        </div>
      </section>
    `;
  }
}

customElements.define('fuggs-cta-section', FuggsCtaSection);
