
# Onboarding pattern reference: post-payment activation, parent-for-child, required setup, reassurance

Compiled for the Illuminairy enrollment spec. One section per category. Sources cited inline.

## 1. Parent-buys-for-child, multi-profile data model

### Outschool (parent enrolls a learner for a class)

Source: [Children's Privacy Notice](https://outschool.com/pages/privacy-COPPA), [Managing Learner Settings](https://support.outschool.com/en/articles/1481632-managing-learner-settings-and-preferences), [Learner Privacy Guide](https://support.outschool.com/en/articles/5195573-learner-privacy-guide)

- Parent account is the umbrella; child is a **learner profile** that lives under it (`Settings > Account & Profile > Learner Account Settings > View Learner Profiles`). Each learner has its own name, birth month/year, pronouns, schooling approach, interests, schedule, learning needs.
- Each learner must be enrolled separately for each class section. There is no shared family checkout that auto-enrolls every learner.
- Learner email is **optional** and only collected so the learner can get @-mention notifications inside the classroom; everything routes to the parent by default.
- Privacy is framed in the learner's voice (the Learner Privacy Guide reads like an explainer for the child, not the parent): "When your parent / legal guardian creates an Outschool account, they give us information about you, like your name and your age... They always have access to your account and whatever happens there, including any messages to teachers."
- Parents can review learner posts, class messages, teacher DMs, and recordings from the parent dashboard.

Why this works: parents see one account that holds all of their kids, but each kid has a real, editable profile and a teacher-visible identity. They don't feel like they're handing the child over to a separate system.

### Greenlight (parent funds child financial account)

Source: [How do I sign up for Greenlight?](https://help.greenlight.com/hc/en-us/articles/115007225408-How-do-I-sign-up-for-Greenlight), [Adding or Removing Child in Greenlight](https://cbna.com/faq/adding-or-removing-child-in-greenlight)

- Primary Accountholder signs up first: legal name, address, DOB, SSN (Patriot Act KYC; explicitly called out as "we don't run a credit check"). Up to 5 kids.
- Funding source is required to complete registration; Greenlight justifies the upfront load as a way to "offset fees and verify your debit card or bank account."
- Each child is added from `Settings > Family > Add a child` with their own name and DOB. A debit card is auto-created and ships in 7–10 business days.
- Child cannot fund their own account: "Cardholders cannot have their own funding source on file. All transfers must be funded by the Primary Accountholder or the Authorized Approver." Kids and parents both use the same Greenlight app but with different logins and views.
- Removing a child is a hard manual flow (transfer funds out → liquidate investments → support form) — protective by design.

Why this works: the parent is unambiguously the financial principal, but the child gets a real card with their name on it. The asymmetric permissions (parent can do everything, child cannot fund) keep parents in control while still giving the kid a sense of ownership.

### GoHenry (briefer; for triangulation)

Source: [GoHenry kids debit card](https://www.gohenry.com/uk/kids-debit-card)

- 3-step welcome on the marketing site: "Sign up for your 1-month free trial" → "Use your parent app to set up pocket money, tasks & top up your child's card" → "Your customised card will arrive within one week, ready to go!"
- Parent app and child app are **separate apps** with separate logins, not a profile-switcher inside one app.
- Activation is two-stage: card arrives → parent activates online or via app with a $5 minimum deposit.

---

## 2. Pay → intake → schedule = activation

### Headway (insurance-based therapy marketplace)

Source: [Headway's client intake and experience](https://help.headway.co/hc/en-us/articles/4403895592724-Headway-s-client-intake-and-experience), [First session with a client on Headway](https://help.headway.co/hc/en-us/articles/360058741911-First-session-with-a-client-on-Headway), [Scheduling a session](https://help.headway.co/hc/en-us/articles/4428834071956-Scheduling-a-session)

- Order of operations for the patient: pick provider → book first session (or 15-min phone consultation) directly from provider profile → receive Headway welcome email with steps to complete the account → complete intake forms (informed consent, biopsychosocial, practice policies) → attend first session.
- The booked first session is the activation event. Headway treats the provider profile's "Book session" / "Book phone call" green button as the conversion, not the account creation.
- Headway operationalizes the wait: welcome email when added → reminders to complete intake → outreach if insurance/payment is missing "with clear instructions and links to edit ahead of their sessions" → pre-session reminders including estimated price and cancellation policies → invoices after each session.
- After session #1, follow-ups are direct: "After your first appointment, message your provider directly to schedule all follow-up sessions." The "first booking" page is sealed off ("Your provider's unique booking link is for new clients only").
- As of April 2026, "direct booking is enabled by default for new providers" — clients book follow-ups themselves once they've had one billed session.

Why this works: parents/clients never sit in a "you have an account, now what?" limbo. The booked appointment is the contract; everything else (forms, insurance, payment) becomes pre-appointment to-do, not a separate onboarding wall.

### Cerebral (mental health subscription + scheduled care)

Source: [Cerebral sign-up flow](https://cerebral.com/app/signup?cabt=price%3Aweek), [Get Started with Medication](https://cerebral.com/get-started/medication), [Cerebral patient FAQ (legal filing)](https://storage.courtlistener.com/recap/gov.uscourts.flsd.665602/gov.uscourts.flsd.665602.66.11.pdf), [Cerebral 2026 review](https://virtualcarefinder.com/providers/cerebral)

- 3-card "what happens next" pattern on the signup page is the entire activation promise: **Compassionate care** ("Choose a therapist or prescriber that you want to work with and schedule your first session") → **Set and track your goals** → **Measure your progress** (every 90 days).
- After payment: pick service (medication / therapy / both) → see all available providers licensed in your state → see availability → book first session in the same flow. "Most clients are able to meet with someone within 3 days of signing up."
- The intake **assessment is a precondition** to the intake session: "Complete an initial assessment before your first intake session, and then about once every 30 days to keep track of how your mental health changes throughout your treatment."
- First payment is anchored as the intake bundle, not a generic month: "Your first payment of $180 only includes the initial intake session and three months of [medication if appropriate]."
- The first session itself is named and scoped: "Your intake session includes a professional evaluation, personalized treatment plan, and typically a diagnosis."

Why this works: the booked first appointment is the activation. The 3-day "you'll meet someone within 3 days" promise inverts the usual telehealth fear ("am I going to be ghosted by a faceless app?").

### ZocDoc (booking-first model)

Source: [How does Zocdoc show real-time availability?](https://www.zocdoc.com/blog/facts/real-time-availability-instant-booking/), [How do I make an appointment?](https://www.zocdoc.com/patient-help/en/articles/8724858-how-do-i-make-an-appointment)

- Booking precedes account creation: "Select the appointment time you'd like and follow the prompts to create an account or login to book your appointment instantly."
- Confirmation copy answers "what happens next" before the user has to ask, with explicit handoff to the provider: "You will receive an email with your appointment details as well as appointment reminders... Zocdoc will also get in touch if the office needs more information, there's an issue, or your appointment needs rescheduling, and the provider may reach out directly with additional instructions."
- "When you see an appointment on Zocdoc, it's there to be booked." (homepage / blog pull-quote)
- Booking writes directly into the provider's EHR/calendar in real time; ZocDoc emphasizes "No phone tag, no double-booking, no dead ends" as the activation promise.

---

## 3. Required-setup-with-status

### Stripe Atlas (incorporation + post-formation checklist)

Source: [Stripe Atlas docs](https://docs.stripe.com/atlas), [Atlas signup](https://docs.stripe.com/atlas/signup), [Atlas product page](https://stripe.com/atlas)

- Linear 3-stage promise on the marketing site, restated on the post-sign-up dashboard: (1) "Tell Atlas about your company and co-founders, then sign documents" → (2) "Delaware incorporates your company. Atlas gets your EIN, issues equity, and files your 83(b) election" → (3) "Atlas guides you through a post-incorporation checklist."
- The checklist is the dashboard, not a separate onboarding overlay. Atlas Dashboard items include: open a bank account, accept payments, file 83(b), set tax elections, claim partner perks ($50K), claim $2,500 Stripe credits.
- Asynchronous, multi-actor items are handled by email: "Any cofounders will receive emails inviting them to e-sign their documents."
- Pre-completion enablement is explicit so the user doesn't feel stuck waiting: "Atlas enables pre-EIN payments and banking, so you can start accepting payments and making transactions before your EIN arrives."
- Time-to-value commitment is stated on the homepage: "Within two business days, you'll be incorporated and ready to bank, fundraise, and accept payments."

Why this works: every required step is visible, every wait state has a parallel "what you can do right now," and the partner perks turn an admin checklist into a reward list.

### Plaid Link (state-machine UI for a hard, ambiguous step)

Source: [Plaid Link overview](https://plaid.com/docs/link/), [Plaid Link web](https://plaid.com/docs/link/web/), [Plaid-style UI walkthrough](https://vp0.com/blogs/plaid-style-bank-link-ui-component)

- Plaid's published guidance is to model the bank-link flow as a small state machine, mapping each step to one honest UI state. The canonical states are: choose a bank → explain access (consent screen) → authenticate (handed off to Plaid) → exchange token ("Connecting...") → linked (success with account name) → failed/cancelled (with retry).
- The success state names the connected account specifically (institution name + account nickname), not a generic "connected."
- Cancellation/failure is treated as a first-class state with a retry CTA, not a generic error toast.
- Plaid pre-initializes the Link handler when the screen mounts, before the user clicks the button, "to reduce UI latency upon calling open" — the only way users perceive the connection as instant.
- OAuth handoffs (bank's site → back to your app) are stitched together with Universal Links so the user never lands on a dead "you came back here" page.

Why this works: the user always knows exactly which step is theirs vs Plaid's vs the bank's, and a stalled bank handoff doesn't look like the app is broken.

### Linear (workspace setup)

Source: [Linear Start Guide](https://linear.app/docs/start-guide), [Invite members](https://linear.app/docs/invite-members), [How to use Linear: startups & mid-size](https://linear.app/docs/how-to-use-linear-startups-mid-size-companies)

- Sign-up routes users into a **role-specific** onboarding guide: "Onboarding guide that fits your needs — Admins: How to use Linear: Small teams / Startups & mid-size / Large & scaling. Team members: Tips for joining your team on Linear."
- Demo workspace is available without setup: "Explore our demo workspace to see how issues, projects, and workflows fit together. Changes are local to your browser and reset on refresh."
- Invite flow is bulk-friendly by default (comma-separated emails) and admin-controlled by default; teams to auto-join are picked at invite time.
- Pending invites appear in the members list with "invited" status until accepted, so admins can see who has and hasn't joined.

---

## 4. Post-purchase reassurance for one-time + subscription products

### Ritual (subscription supplement)

Source: [Ritual Subscription and Sales Terms](https://ritual.com/pages/subscription-and-sales-terms), [Ritual subscription dashboard](https://ritual.com/pages/account/dashboard), [DTC Patterns teardown](https://www.dtcpatterns.com/dtc-patterns-articles/get-better-gut-health-daily-with-rituals-subscription-program)

- Order confirmation is explicitly **provisional**, not a fait accompli: "Ritual's confirmation of receipt of your order does not constitute Ritual's acceptance of your order. Ritual is only deemed to have accepted your order once the Product(s) you ordered have been shipped."
- Renewals are never silent: "We will send you an email reminder prior to charging your payment provider each subscription period."
- Post-checkout, the user lands on a **personalized landing page** with their name, what they ordered, and educational content about habit-building. Refer-a-friend offer ($35 credit) is right there.
- "Reschedule Shipment" and "Snooze for up to 2 months" are first-class buttons on the dashboard — not hidden behind cancel.
- 30-day money-back guarantee plus the snooze flow turn cancel-pressure into pause-pressure. Cancel funnel ends with a 40% reactivation discount in email.
- Checkout trust strip: "30 Day Money-Back Guarantee. Don't love it within 30 days? It's on us. Your Ritual, Your Way. With flexible delivery options and easy anytime cancellation. Subscriptions Ship Free. Even if you need to snooze or rush your order."

Why this works: every line about recurring billing is paired with a parent verb ("snooze," "reschedule," "edit," "skip") that says the user is in control of the calendar.

### Hims / Hers (prescription subscription)

Source: [Hims cancel article](https://support.hims.com/hc/en-us/articles/360000962263-How-do-I-cancel-my-subscription), [Hims terms](https://www.hims.com/terms-and-conditions), [PocketGuard cancel walkthrough](https://pocketguard.com/blog/how-to-cancel-hims-subscription/)

- Next-order date is always visible in account: "You can always view the next process date of your subscription in your online account."
- 48-hour pre-process cancellation rule is repeated on every cancellation-adjacent surface so users know the cutoff: "If you wish to discontinue your subscription, please take action at least 48 hours before your next order date."
- Pause is a first-class action alongside cancel: "We may also offer you the ability to pause your subscription for a specified period of time. If you do not cancel before the end of the pause period, charging to your payment device will resume automatically."
- Cancellation surfaces an end-of-period commitment: "Cancellation will take effect at the end of the current subscription period." (i.e., you're not throwing away what you've paid for).
- Multiple cancel channels listed in the terms: in-app, online account, Customer Help Center, or phone (1-800-368-0038) — TCPA-style "no walled garden" reassurance.

### Allbirds (one-time DTC purchase)

Source: [Allbirds shipping policy (IE)](https://www.allbirds.ie/policies/shipping-policy), [Order confirmation email teardown (Privy)](https://www.privy.com/blog/order-confirmation), [NotifyVisitors teardown](https://www.nvecta.com/blog/best-order-confirmation-emails/)

- Two-email pattern: order confirmation (immediately, with order number, itemized total, shipping address, processing-time promise) → separate shipping confirmation with tracking link.
- Processing time is stated, not implied: "All online orders are processed and shipped within 48 business hours."
- Confirmation email reuses brand voice / sustainability messaging in the receipt itself ("a beautiful message is flashed below the order details, which states how they are concerned for animal welfare and sustainability") — turns a receipt into a brand touchpoint.
- Spam-folder fallback called out in the policy itself: "If you do not receive an email confirmation, please check your spam or junk mailbox before reaching out to us."

### Warby Parker (post-checkout reassurance with optionality)

Note: Home Try-On was discontinued at the end of 2025. The replacement pattern still demonstrates the reassurance principle.

Source: [Warby Parker Home Try-On (current)](https://www.warbyparker.com/home-try-on), [How to Buy Glasses Online](https://www.warbyparker.com/learn/how-to-buy-glasses-online)

- 30-day return/exchange window stated alongside the order CTA: "We give you 30 days to decide if the frames you've ordered are right for you. You can return or exchange them at any point during that window."
- "Three ways to shop and try on frames at home" pattern (Virtual Try-On, Style Quiz, in-store) — each one is a way to reduce the "did I buy the wrong thing" anxiety before the box arrives.
- Free shipping and free returns on every order, stated prominently — recurring trust strip.

---

## 5. Named-human continuity

### Brooklinen (founder-voice welcome email, transactional)

Source: [Inverse interview with Rich Fulop](https://www.inverse.com/article/38358-brooklinen-rich-fulop-interview), [Adweek profile](https://www.adweek.com/brand-marketing/brooklinen-email-marketing-personalization-transparency-triggered-sends/), [Zendesk founder interview](https://www.zendesk.com/blog/industries/brooklinen-industry-going-direct-consumer/)

- Founder-signed triggered email sent 7 days after account creation if no purchase. Subject: "Can I Help?" Body opens: "My name is Rich Fulop and I'm CEO and one of the Founders of Brooklinen. I see you previously checked us out but haven't purchased just yet so I wanted to see if there's any way our team can help you find what you're looking for."
- Tone is intentionally conversational, even cheeky: "If you're ready to jump into bed with us right now..."
- The CEO/founder voice was bootstrapped from a real practice. Fulop personally handled the first ~5,000 customer service tickets and wrote each reply "like I was writing you an email or a friend or my brother." The patterns from those replies (e.g., "short side/long side" tags on king sheets) became product features.
- The reply-to is a real inbox, not no-reply; customer replies surfaced product changes (sturdier cardboard, sizing tags).

Why this works: the email frames the company as one identifiable person who is accountable for your purchase, not a brand voice.

### Alloy (assigned clinician + named human ongoing)

Source: [How does Alloy work?](https://myalloy.zendesk.com/hc/en-us/articles/25033598566035-How-does-Alloy-work), [What to expect after sign up?](https://myalloy.zendesk.com/hc/en-us/articles/24367408146067-What-to-expect-after-sign-up), [How do I get support?](https://myalloy.zendesk.com/hc/en-us/articles/46682088793747-How-do-I-get-support), [How is Alloy different from traditional telemedicine?](https://myalloy.zendesk.com/hc/en-us/articles/49081453195155-How-is-Alloy-different-from-traditional-telemedicine)

- Post-intake state has explicit named ownership: "Your consultation is placed in your assigned Alloy doctor's queue. You can usually expect to hear from your doctor within 1-2 business days."
- Doctor is a real person you message, not a chatbot or "care team" abstraction: "Alloy gives you ongoing messaging access to your dedicated, menopause-trained physician after your initial MD consult and while your subscription is active. No appointments. No waiting rooms. Just direct access when you need it."
- Clinical and non-clinical inboxes are explicitly separated, each with a named home: clinical → message your doctor in the dashboard; non-clinical → email `support@myalloy.com`. Both have visible response-time expectations.
- "Alloy is the only platform connecting women with physicians trained specifically in menopause care" — credentialing of the human is the primary trust lever, not the brand.

### Headspace (founder-as-product)

Source: [Headspace welcome email teardown (Email Mastery)](https://emailmastery.org/teardown/the-headspace-email-marketing-teardown/), [CleverTap onboarding teardown](https://medium.com/mobile-marketing-insights-by-clevertap/how-headspace-struck-gold-with-onboarding-emails-best-practices-for-retaining-new-users-64bd384c907c), [How They Grow profile](https://www.howtheygrow.co/p/how-headspace-grows-the-monk-who)

- Welcome email subject: "Welcome to Headspace" / preview "Get ready to learn the life-changing skill of meditation." Personalized greeting using the subscriber's name. Sent within minutes of signup.
- Single primary CTA: "Start With Basics" — points to a foundational course narrated by founder Andy Puddicombe.
- The founder is the product voice. Andy narrates the meditations; users describe their daily session as "Andy for 10 minutes every morning." The brand never abstracts away from him.
- Email 2+ in the sequence pushes habit formation ("add Headspace into your morning or evening routine... imagine how you'll feel after a 30-day course"). Habit framing replaces feature framing.

---

## 6. Parent-on-behalf-of-minor TCPA + SMS / contact consent

### Legal frame (important context)

Source: [Manatt TCPA Connect: Can a Minor Provide Consent?](https://www.manatt.com/insights/newsletters/tcpa-connect/can-a-minor-provide-consent-for-tcpa-calls), [Duane Morris alert](https://www.duanemorris.com/alerts/plaintiffs_assert_minors_cannot_give_consent_automated_calls_messages_under_tcpa_1221.html), [TCPA Blog on Hall v. Smosh](https://tcpablog.com/2023/ninth-circuit-finds-that-one-text-can-cause-concrete-harm-remands-for-decision-regarding-whether-minors-can-consent/)

- Whether a minor can give TCPA-valid consent to marketing texts is **unresolved** in federal court (Hall v. Smosh Dot Com, ongoing). The 9th Circuit has held that the **phone subscriber** (typically the parent) has standing to sue for unsolicited texts to that line even if their child consented and used the phone.
- Practical takeaway from defense bar (Duane Morris): "Businesses would do well to know whether their customer bases include minors... and if so, to obtain the consent of a minor's parent in a manner that permits actual verification."
- COPPA already requires verifiable parental consent for any collection of personal info (including a mobile number) from a child under 13, with a narrow exception for collecting the number solely to send the parent-consent request.

### Outschool (parent consent + child sign-up with parent notification)

Source: [Children's Privacy Notice](https://outschool.com/pages/privacy-COPPA), [Privacy](https://outschool.com/privacy), [Children's data retention](https://outschool.com/pages/childrens-personal-data-retention-policy)

- Default model is parent-creates-child: "Once we have verified parental consent of Parents / Guardians, we collect information directly from Children in our platform."
- Side-door for kids who try to self-sign: "We collect a little information from Children under a 'limited consent' (see more below) when Children sign up for Outschool directly and alert Parents / Guardians." That limited account can "like classes and choose an avatar," but cannot enroll or be shared with teachers/peers until the parent verifies consent.
- Parent identity verification uses credit card verification (the COPPA-acceptable monetary-transaction method): "We verify the identity of the individual giving consent through a combination of authentication methods, including but not limited to credit card verification."
- Parent rights are stated explicitly and operationalized in the parent dashboard: review the child's data, correct it, refuse further collection, or request deletion via `privacy@outschool.com`.
- Direct-notice email is sent to parents for every Service the child enters.

### Khan Academy (parent-creates-child OR child-with-parent-email)

Source: [Login options for under-13](https://support.khanacademy.org/hc/en-us/articles/202487460-If-my-child-is-younger-than-age-13-what-login-options-are-there), [COPPA community post](https://support.khanacademy.org/hc/en-us/community/posts/360030542371-Children-s-Online-Privacy-Protection-Act-COPPA), [Khan parent guide PDF](https://core-docs.s3.amazonaws.com/documents/asset/uploaded_file/900743/Parent_Guide.pdf), [Kids privacy policy](https://www.khanacademy.org/kids/privacy-policy)

- Under-13 users **must** have a restricted "child account" linked to a parent. Three paths: parent creates child at `khanacademy.org/parent → Add your child`; teacher creates the account assuming parental permission has been obtained offline; or the child self-creates and is forced to submit a parent email.
- Child-initiated path has a hard time limit: "Parents will then receive an email asking to approve the child account within 7 days." Unapproved accounts are deleted at day 7.
- Birthdate is asked first because it determines the account type: "Your child's birthday is needed to determine permissions available. Accounts for students under 13 are managed by a parent to protect the child's privacy."
- For child accounts the email is optional ("the child accounts associated with a parent account do NOT require separate email addresses") — Khan strips the surface area for collecting contact info from the minor where possible.
- Parent account becomes the child's "permanent coach" — the relationship is modeled explicitly, not just a permission grant.

### Talkspace Teens (clinical, video + SMS-verified consent)

Source: [Teen Therapy at Talkspace](https://help.talkspace.com/hc/en-us/articles/18987676345883-Teen-Therapy-at-Talkspace-What-Parents-Guardians-and-Teens-Should-Know), [Online Therapy for Teens](https://www.talkspace.com/online-therapy/teens/), [NYC Teenspace FAQ for parents](https://www.nyc.gov/assets/doh/downloads/pdf/mh/teenspace-faq-parents-guardians.pdf), [NYC Teenspace](https://nycteenspace.org/), [Under 18 — No Consent](https://helpnow.talkspace.com/under-18-no-consent)

- Two entry points, parent-first by design: teen-initiated ("I'm a teen") → required to enter parent/guardian email and Talkspace sends the parent the consent form; parent-initiated ("I'm a guardian of a teen") → 4-step flow (enter teen's age and zip code → confirm eligibility → provide consent → share invitation link with teen).
- Consent verification is **multi-channel**: "Your parent will need to affirm their consent both via video message (with you present), and via text message, all on the Talkspace app." The video step is unique among teen mental-health platforms and is meant to prevent forged consent.
- The consent form itself bundles informed consent + Notice of Privacy Practices + Privacy Policy + agreement to therapy. Parent reviews their name and relationship to the teen before submitting.
- Hard fail-closed for unverified minors: page exists at `helpnow.talkspace.com/under-18-no-consent` — "Talkspace cannot provide service to individuals under the age of 18 without parental consent" with crisis resources listed instead of an upsell.
- Post-consent, confidentiality is inverted: parents cannot see session content without the teen's separate written authorization. "Privacy is a fundamental part of therapy for teens, allowing you to express your emotions freely without fear of judgment."
- Age-out is pre-announced, not silent: NYC Teenspace policy says "If a client turns 18 before then, they can work with their provider until June 30 of that year, when the provider will share options for continued care."
- Under-13 funnel is deferred, not refused: "If you are a parent or guardian to a child younger than 13, share your email address and the child's birthdate. When the child reaches 13 we'll email a reminder that they're eligible..."

### Synthesis: SMS consent block for parent-on-behalf-of-minor

Based on the three patterns above plus current TCPA case law:

- Collect the **parent's** phone number, not the child's, for any transactional or marketing SMS related to the minor's account. The parent is the phone subscriber with TCPA standing.
- The consent block should be checkbox-style, in the parent's voice, and bundle: (a) consent for SMS to that number, (b) acknowledgment that the parent will receive messages about the minor's enrollment/scheduling, (c) link to TCPA/messaging T&Cs, (d) STOP/HELP language.
- If the child has their own phone you want to text (e.g., session reminders), use a **second consent step** that the parent grants on behalf of the minor — keep that separate from the parent's own consent.
- Verify the parent's phone via confirmation text **before** activating the relationship. Talkspace pairs SMS with a video step for the highest-risk case; for a tutoring product, an SMS-only code is generally proportionate.
- Sunset behavior at 18: pre-announce that the minor will be asked to re-consent on their own behalf when they turn 18 (Talkspace's pattern is the cleanest reference).

 Now I'm organizing the markdown document with clear sections and product breakdowns, making sure each entry includes specific pattern observations, a note on user reassurance, and any relevant quotes I've found.