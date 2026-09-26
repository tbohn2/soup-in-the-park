import Image from "next/image";
import gmaGpaPic from "@/assets/main-page-gma.jpg";
import { SOUP_AFTER } from "@/lib/events";
import { PinIcon, PlusIcon } from "./icons";
import Logo from "./Logo";

export default function SoupHero() {
  return (
    <section className="hero wrap">
      <h1 className="visually-hidden">Soup in the Park</h1>
      <Logo className="hero-logo" />
      {/* A paper invitation card holding the facts people come here to find */}
      <div className="invite">
        <span className="tape" aria-hidden="true" />
        <dl className="invite-facts">
          <div className="fact">
            <dt>When</dt>
            <dd>
              <span className="fact-main">October 19, 2026</span>
              <span className="fact-time">5:00 PM</span>
            </dd>
          </div>
          <div className="fact">
            <dt>Where</dt>
            <dd>
              <span className="fact-main">Gene Autry Park</span>
              <span className="fact-note">(due to Sheepherder&apos;s construction)</span>
            </dd>
          </div>
        </dl>
        <a className="key key-edit key-sm invite-maps" href="https://maps.app.goo.gl/dFQU244ewSoQVw9C7" target="_blank" rel="noopener noreferrer">
          <PinIcon />
          Open in Maps
        </a>
        <p className="invite-after">
          <span>After</span>
          {SOUP_AFTER}
        </p>
      </div>
      {/* Phones get the RSVP key in the first screen; desktop has it next to the head count */}
      <a href="#sheet-attendees" className="key key-add key-lg hero-rsvp">
        <PlusIcon />
        RSVP
      </a>
      <figure className="hero-photo">
        <span className="tape" aria-hidden="true" />
        <div className="photo-print">
          <Image
            src={gmaGpaPic}
            alt="Grandma and Grandpa at the lake"
            sizes="(max-width: 900px) 280px, 460px"
            placeholder="blur"
            priority
          />
        </div>
        <figcaption>Grandma and Grandpa</figcaption>
      </figure>
    </section>
  );
}
