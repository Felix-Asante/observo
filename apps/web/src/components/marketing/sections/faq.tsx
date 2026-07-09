import { Accordion, AccordionItem, Section, SectionHeading } from '@observo/ui'

import { Reveal } from '#/components/animations/reveal'
import { faqs } from '#/data/content'

export function Faq() {
  return (
    <Section id="faq" containerClassName="max-w-3xl">
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered"
        description="Everything engineers ask before pointing production at us."
      />

      <Reveal>
        <Accordion className="border-y border-border-subtle">
          {faqs.map((faq) => (
            <AccordionItem key={faq.question} question={faq.question}>
              {faq.answer}
            </AccordionItem>
          ))}
        </Accordion>
      </Reveal>
    </Section>
  )
}
