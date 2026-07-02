import { dictionaryTerms } from "../data/dictionary";

export default function Dictionary() {
  return (
    <section className="section dark" id="dictionary">
      <p className="eyebrow">AFIP DICTIONARY</p>

      <h2>Learn the Language of Trust</h2>

      <p>
        Every financial system has its own terminology.
        AFIP introduces a simple language designed to make digital finance
        understandable for everyone.
      </p>

      <div className="dictionary">

        {dictionaryTerms.map((item) => (

          <article key={item.term}>

            <span className="level">
              {item.level}
            </span>

            <h3>{item.term}</h3>

            <p>{item.definition}</p>

          </article>

        ))}

      </div>

    </section>
  );
}