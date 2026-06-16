import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Illuminairy Terms of Service for programs, enrollment, and website use."
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Policy"
        title="Terms of Service"
        text="These Terms govern your use of Illuminairy’s website, programs, and consultations."
      />
      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="legal-copy mx-auto max-w-4xl rounded-3xl border border-line bg-ivory-50 p-7 shadow-editorial sm:p-12">
          <p>Effective date: May 17, 2026</p>

          <h2>Overview</h2>
          <p>
            These Terms govern your use of Illuminairy’s website, consultations,
            programs, and educational services.
          </p>

          <h2>Educational services</h2>
          <p>
            Illuminairy provides educational programs, including
            program-based SAT preparation, mentorship, coaching, diagnostics, study
            support, and related learning programs. Services may be delivered
            through live sessions, private coaching, digital materials, email,
            scheduling tools, and third-party video or communication platforms.
          </p>

          <h2>Nature of services</h2>
          <p>
            Illuminairy provides educational services, including SAT
            diagnostics, personalized SAT improvement planning, tutoring,
            coaching, study support, curriculum, and related learning support.
          </p>
          <p>
            Illuminairy is a service provider. Any worksheets, study plans,
            diagnostics, score reports, recordings, digital materials,
            practice assignments, or other materials provided through the
            program are supporting materials used to deliver the services.
            These materials are not sold separately and do not create a
            product purchase, license, or ownership right beyond the limited
            personal educational use described in these Terms.
          </p>

          <h2>Program changes</h2>
          <p>
            Illuminairy may adjust tutors, session format, curriculum, lesson
            plans, tools, or schedules as needed to support the student.
          </p>

          <h2>Students under 18</h2>
          <p>
            For students under 18, a parent or legal guardian must approve
            enrollment, payment, scheduling, and participation. By enrolling a
            minor student, the parent or guardian agrees to these Terms on the
            student’s behalf.
          </p>

          <h2>Parent responsibility</h2>
          <p>
            The parent or legal guardian is responsible for enrollment,
            payment, scheduling, making sure the student attends sessions, and
            making sure the student has a quiet space, working internet, and
            any materials needed for tutoring.
          </p>

          <h2>Student expectations</h2>
          <p>
            Students are expected to complete assigned homework, practice
            between sessions, bring questions to the next session, and track
            their assigned skill practice.
          </p>

          <h2>Payments and enrollment</h2>
          <p>
            When you enroll, you will be charged $249 immediately for the
            diagnostic assessment and personalized SAT improvement plan. This
            includes scheduling the diagnostic, reviewing the results, creating
            a personalized SAT improvement plan, and preparing the student’s
            first week of lessons.
          </p>
          <p>
            By enrolling, you also authorize Illuminairy to charge $99 per week
            for ongoing SAT tutoring beginning 7 days after enrollment. Each
            weekly charge is billed in advance and covers tutoring services for
            the following week.
          </p>
          <p>
            The weekly tutoring program includes 2 tutoring sessions per week.
            Session times are scheduled based on student and tutor
            availability.
          </p>
          <p>
            You may cancel future weekly tutoring charges by contacting{" "}
            {site.supportEmail} before your next weekly billing date. Canceling
            stops future weekly charges but does not automatically refund
            amounts already paid for the current week or for services already
            prepared or provided.
          </p>
          <p>
            If a weekly payment fails, Illuminairy may pause scheduling, access
            to tutoring sessions, or continued program participation until
            payment is resolved.
          </p>
          <p>
            Payments are processed through third-party payment providers such
            as Stripe. By enrolling, you authorize Illuminairy and its payment
            provider to charge your selected payment method for the initial
            $249 diagnostic and personalized plan fee and the recurring $99
            weekly tutoring fee unless and until you cancel.
          </p>

          <h2>Diagnostic and personalized plan</h2>
          <p>
            The $249 diagnostic assessment and personalized SAT improvement
            plan includes scheduling the diagnostic, reviewing the student’s
            results, identifying priority skill gaps, creating a personalized
            SAT improvement plan, and preparing the student’s first week of
            tutoring lessons.
          </p>
          <p>
            This fee is charged at enrollment. Because personalized work begins
            during the first 7 days after enrollment, the fee is non-refundable
            once the diagnostic has been scheduled, the diagnostic has been
            completed, or personalized planning work has begun.
          </p>

          <h2>Ongoing SAT tutoring</h2>
          <p>
            Ongoing SAT tutoring is provided as a recurring weekly service. By
            enrolling, you authorize Illuminairy to charge your selected
            payment method $99 per week beginning 7 days after enrollment.
            Each weekly payment is billed in advance and covers tutoring
            services for the following week.
          </p>

          <h2>Recurring billing authorization</h2>
          <p>
            By enrolling, you authorize Illuminairy and its payment provider
            to charge your selected payment method for the $249 diagnostic
            assessment and personalized SAT improvement plan at enrollment.
            You also authorize Illuminairy to charge your selected payment
            method $99 per week beginning 7 days after enrollment for ongoing
            SAT tutoring.
          </p>
          <p>
            Each $99 weekly payment is charged in advance and covers tutoring
            services for the following week. Weekly billing continues until
            you cancel.
          </p>
          <p>
            You may cancel future weekly charges before your next billing date
            by emailing{" "}
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> or
            using any cancellation method provided at enrollment or through
            your account. Cancellation stops future weekly charges. It does
            not automatically refund charges that have already been processed.
          </p>

          <h2>Chargebacks</h2>
          <p>
            If you have a question or concern about a charge, please contact
            us first at{" "}
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> so
            we can review it with you. Filing a chargeback or payment dispute
            with your bank or card issuer does not cancel future weekly
            subscription payments. To stop weekly billing, you must cancel
            separately as described in the Recurring billing authorization
            section above.
          </p>

          <h2>No guaranteed outcomes</h2>
          <p>
            Illuminairy does not guarantee any specific SAT score, score
            increase, admissions result, scholarship result, academic result,
            or other outcome. Our services are designed to support preparation,
            skill development, accountability, and confidence. Results depend
            on many factors, including the student’s starting point,
            attendance, practice, effort, schedule, and test-day performance.
          </p>

          <h2>Score estimates and projections</h2>
          <p>
            Any score estimates, practice test results, or projected
            improvement ranges Illuminairy provides are estimates only based on
            the information available at the time. They are not guarantees of
            future results.
          </p>

          <h2>Professional opinion; no professional advice</h2>
          <p>
            Illuminairy provides educational support, tutoring, coaching,
            diagnostics, study planning, and test preparation guidance. Any
            recommendations, score estimates, study plans, pacing guidance, or
            academic suggestions are provided as professional opinions based
            on the information available at the time.
          </p>
          <p>
            Illuminairy does not provide legal, financial, medical,
            psychological, college admissions, or tax advice. Families should
            consult qualified professionals for advice in those areas.
          </p>
          <p>
            Illuminairy may provide general information about testing, college
            readiness, academic planning, scholarships, or admissions-related
            topics. This information is for educational purposes only and
            should not be treated as a guarantee, formal admissions advice,
            financial advice, or professional counseling.
          </p>

          <h2>No relationship with College Board</h2>
          <p>
            Illuminairy is not affiliated with, endorsed by, or sponsored by
            the College Board, ACT, Inc., or any school district, college, or
            university. SAT and PSAT are trademarks of the College Board, which
            is not affiliated with Illuminairy.
          </p>

          <h2>Participant expectations</h2>
          <p>
            Students are expected to participate respectfully, attend scheduled
            sessions, complete assigned practice where applicable, and avoid
            disruptive conduct. Illuminairy may remove a participant from a
            program for abusive, unsafe, dishonest, or disruptive behavior.
          </p>

          <h2>Respectful conduct and prohibited misuse</h2>
          <p>
            Customers and students may not harass, threaten, abuse,
            impersonate, or intentionally interfere with Illuminairy, its
            tutors, employees, contractors, students, or families.
          </p>
          <p>
            Customers and students may not share private, confidential, or
            personal information about Illuminairy tutors, employees,
            contractors, students, or families without permission.
          </p>
          <p>
            Nothing in these Terms prevents a customer or student from sharing
            an honest opinion about Illuminairy’s services. However, customers
            and students may not knowingly make false statements, misuse
            Illuminairy’s proprietary materials, disclose confidential
            information, violate another person’s privacy, or engage in
            unlawful conduct.
          </p>

          <h2>Attendance, rescheduling, and missed sessions</h2>
          <p>
            Students are expected to attend scheduled sessions on time and
            ready to participate.
          </p>
          <p>
            If you need to reschedule a session, you must notify Illuminairy at
            least 24 hours before the scheduled session time. Sessions canceled
            with less than 24 hours’ notice may be treated as missed sessions.
          </p>
          <p>
            If a student misses a scheduled session or arrives too late to
            complete the session, Illuminairy is not required to provide a
            refund or makeup session.
          </p>
          <p>
            If Illuminairy cancels a session, we will reschedule the session or
            provide a credit for a future session.
          </p>

          <h2>Technology requirements</h2>
          <p>
            Families are responsible for internet, device access, video
            platform access, and a quiet environment for sessions. Illuminairy
            is not required to provide refunds or makeup sessions for problems
            caused by the family’s device, internet, schedule, or environment.
          </p>

          <h2>Communication consent</h2>
          <p>
            By enrolling, the parent or legal guardian agrees that Illuminairy
            may contact them and the student by email, text message, phone,
            scheduling tools, or learning platforms about enrollment, payment,
            scheduling, student progress, and program updates.
          </p>

          <h2>Privacy and student information</h2>
          <p>
            Illuminairy collects student and parent information needed to
            provide services, including diagnostic results, practice data,
            attendance, homework, and communications. How we collect, use,
            and protect this information is described in our{" "}
            <a href="/privacy">Privacy Policy</a>.
          </p>

          <h2>Session recordings</h2>
          <p>
            Illuminairy records tutoring sessions for student support,
            quality, safety, training, documentation, lesson review, and the
            protection of students, families, and tutors.
          </p>
          <p>
            By enrolling a student, the parent or legal guardian consents to
            Illuminairy recording the student’s tutoring sessions. This
            consent applies to all scheduled tutoring sessions unless
            Illuminairy agrees otherwise in writing.
          </p>
          <p>
            Recordings help Illuminairy support student learning, review
            lesson quality, document attendance, resolve concerns, protect
            minors, and maintain a safe and professional learning
            environment.
          </p>
          <p>
            Recordings may include the student’s name, voice, image, screen,
            lesson materials, questions, answers, tutor feedback, and other
            information shared during the session.
          </p>
          <p>
            Illuminairy uses recordings internally to provide services,
            support instruction, improve curriculum, train tutors, document
            attendance, resolve disputes, and support safety. Illuminairy
            will not sell session recordings.
          </p>
          <p>
            Customers and students may not record, screenshot, download,
            copy, publish, post, share, or distribute tutoring sessions,
            recordings, lesson materials, tutor communications, student
            work, or platform content without written permission from
            Illuminairy.
          </p>
          <p>
            Access to recordings, if provided, is for personal educational
            use only and may be limited, revoked, or removed at
            Illuminairy’s discretion.
          </p>

          <h2>Proprietary materials</h2>
          <p>
            Illuminairy’s curriculum, worksheets, diagnostics, score analysis,
            personalized SAT improvement plans, lesson plans, practice
            assignments, explanations, templates, recordings, website content,
            designs, and program materials are owned by Illuminairy or its
            licensors.
          </p>
          <p>
            Customers and students may use Illuminairy materials only for
            their own personal educational use. Customers and students may not
            copy, reproduce, publish, post, sell, share, distribute, teach
            from, create derivative works from, or use Illuminairy materials
            for any commercial purpose without written permission from
            Illuminairy.
          </p>
          <p>
            Access to Illuminairy materials ends when enrollment, tutoring, or
            program participation ends, unless Illuminairy gives written
            permission otherwise.
          </p>

          <h2>Refunds and cancellations</h2>
          <p>
            The $249 diagnostic and personalized SAT improvement plan fee is
            charged at enrollment. Because this work begins during the first 7
            days after enrollment, this fee is non-refundable once the
            diagnostic has been scheduled, the diagnostic has been completed,
            or personalized planning work has begun.
          </p>
          <p>
            Weekly tutoring is billed in advance at $99 per week. Each weekly
            payment covers the following week of tutoring. Weekly tutoring
            payments are non-refundable once the billing period begins, except
            where required by law or approved by Illuminairy.
          </p>
          <p>
            You may cancel future weekly tutoring charges before your next
            billing date by emailing {site.supportEmail}. Cancellation stops
            future weekly charges. It does not cancel or refund charges that
            have already been processed for the current billing period.
          </p>
          <p>
            If Illuminairy cancels a session, we will reschedule the session or
            provide a credit for a future session. If a student misses or
            cancels a session, the missed session policy provided at enrollment
            will apply.
          </p>

          <h2>Right to refuse service or cancel enrollment</h2>
          <p>
            Illuminairy reserves the right to refuse service, cancel
            enrollment, pause services, or end a student’s participation in a
            program when we determine that continued participation is not
            appropriate.
          </p>
          <p>
            This may include, but is not limited to, nonpayment, repeated
            missed sessions, disruptive behavior, abusive or disrespectful
            conduct, academic dishonesty, safety concerns, misuse of program
            materials, or a mismatch between the student’s needs and the
            services Illuminairy provides.
          </p>
          <p>
            If Illuminairy ends a student’s participation for reasons
            unrelated to misconduct or nonpayment, we may refund any prepaid
            fees for tutoring sessions that have not yet been provided. The
            $249 diagnostic and personalized SAT improvement plan fee is not
            refundable once the diagnostic has been scheduled, completed, or
            personalized planning work has begun.
          </p>
          <p>
            If enrollment is canceled due to misconduct, nonpayment, repeated
            missed sessions, or violation of these Terms, Illuminairy is not
            required to provide a refund except where required by law.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Illuminairy is not liable
            for indirect, incidental, consequential, special, punitive, or
            exemplary damages. This includes damages related to lost
            opportunities, admissions outcomes, scholarship outcomes, academic
            outcomes, test results, lost profits, business interruption, or
            emotional distress.
          </p>
          <p>
            Illuminairy’s total liability for any claim related to the
            services will not exceed the amount paid by the customer to
            Illuminairy for the services giving rise to the claim during the
            30 days before the claim arose.
          </p>
          <p>
            Nothing in these Terms limits liability that cannot be limited
            under applicable law.
          </p>

          <h2>Dispute resolution</h2>
          <p>
            If you have a concern about billing, services, scheduling, or
            your student’s program, you agree to contact Illuminairy first at{" "}
            <a href={`mailto:${site.supportEmail}`}>{site.supportEmail}</a> so
            we can try to resolve the issue directly.
          </p>
          <p>
            Both parties agree to make a good-faith effort to resolve disputes
            informally before starting a legal claim, except where immediate
            legal action is needed or where this requirement is not allowed
            by law.
          </p>

          <h2>Governing law</h2>
          <p>
            These Terms are governed by the laws of Georgia, United States.
            Contact {site.supportEmail} with questions.
          </p>
        </div>
      </section>
    </>
  );
}
