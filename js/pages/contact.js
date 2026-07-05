const ContactPage = {

render() {
return `
<div class="max-w-6xl mx-auto px-6 py-12 fade-in space-y-12">

    <!-- Header (Hero Style) -->
    <div class="text-center space-y-4">
        <h1 class="text-5xl font-bold text-textPrimary tracking-tight">
            Contact <span class="text-brand-red">Us</span>
        </h1>
        <p class="text-textSecondary max-w-2xl mx-auto text-lg">
            Let’s build something amazing together. Send a message or connect instantly through any platform below.
        </p>
    </div>

    <div class="grid lg:grid-cols-3 gap-8 items-start">

        <!-- Contact Form (Bigger + Highlighted) -->
        <div class="lg:col-span-2 relative">

            <!-- Subtle glow background -->
            <div class="absolute -inset-1 bg-brand-red/5 blur-2xl rounded-3xl"></div>

            <div class="relative bg-card border border-borderDivider rounded-3xl p-8 shadow-2xl">

                <h2 class="text-2xl font-semibold text-textPrimary mb-6">
                    ✉️ Send a Message
                </h2>

                <form id="contact-form" class="space-y-5">


                    <input type="text" id="name" placeholder="Your Name"
                        class="w-full bg-bgMain/50 border border-borderDivider rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-brand-red">

                    <input type="email" id="email" placeholder="Your Email"
                        class="w-full bg-bgMain/50 border border-borderDivider rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-brand-red">

                    <textarea id="message" rows="6" placeholder="Write your message..."
                        class="w-full bg-bgMain/50 border border-borderDivider rounded-xl px-4 py-3 text-textPrimary focus:outline-none focus:border-brand-red"></textarea>

                    <button type="submit"
                        class="w-full bg-brand-red hover:bg-brand-redHover transition-all py-3 rounded-xl font-semibold text-white shadow-lg">
                        Send Message 🚀
                    </button>

                    <p id="contact-msg" class="text-sm text-textSecondary text-center"></p>
                </form>
            </div>
        </div>

        <!-- Contact Info Cards -->
        <div class="space-y-4">

          <div class="bg-card border border-borderDivider rounded-2xl p-5 hover:scale-[1.02] transition">
                     <p class="text-sm text-textSecondary">WhatsApp</p>
                     <a href="https://wa.me/923315248626"
                         target="_blank"
                         class="text-textPrimary font-medium hover:text-brand-red">
                         +92 331 5248626
                     </a>
                </div>

            <div class="bg-card border border-borderDivider rounded-2xl p-5 hover:scale-[1.02] transition">
                <p class="text-sm text-textSecondary">Facebook</p>
                <a href="https://www.facebook.com/Ibziinnovations" target="_blank"
                   class="text-textPrimary font-medium hover:text-brand-red">
                   Ibzi Innovations
                </a>
            </div>

            <div class="bg-card border border-borderDivider rounded-2xl p-5 hover:scale-[1.02] transition">
                <p class="text-sm text-textSecondary">Instagram</p>
                <a href="https://www.instagram.com/ibziinnovations?igsh=MW5lMTRzanFsbHViOQ%3D%3D"
                   target="_blank"
                   class="text-textPrimary font-medium hover:text-brand-red">
                   @ibziinnovations
                </a>
            </div>

            <div class="bg-card border border-borderDivider rounded-2xl p-5 hover:scale-[1.02] transition">
                <p class="text-sm text-textSecondary">LinkedIn</p>
                <a href="https://www.linkedin.com/company/ibzi-innovations/"
                   target="_blank"
                   class="text-textPrimary font-medium hover:text-brand-red">
                   Company Page
                </a>
            </div>


            <div class="bg-card border border-borderDivider rounded-2xl p-5 hover:scale-[1.02] transition">
                <p class="text-sm text-textSecondary">Email</p>
                <a href="mailto:info@ibziinnovations.com"
                   class="text-textPrimary font-medium hover:text-brand-red">
                   info@ibziinnovations.com
                </a>
            </div>

        </div>

    </div>

</div>
`;
},
    init() {
        document.getElementById('contact-form').addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            const msg = document.getElementById('contact-msg');
            msg.textContent = "Sending...";

            try {
                await API.post('/contact/send', {
                    name,
                    email,
                    message
                });

                msg.textContent = "Message sent successfully ✔";
                e.target.reset();
                msg.innerHTML = `
<div class="flex flex-col items-center justify-center space-y-2 animate-bounce">
    <div class="text-brand-red text-4xl">✔</div>
        <p class="text-brand-red font-semibold">Message Sent Successfully</p>
</div>
`;

            } catch (err) {
                msg.textContent = err.message || "Failed to send message";
            }
        });
    }
};

window.ContactPage = ContactPage;