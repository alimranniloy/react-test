export default function ExtraApp() {
  const perks = [
    {
      name: "Free delivery",
      imageSrc:
        "https://tailwindui.com/img/ecommerce/icons/icon-delivery-light.svg",
      description:
        "Order now and you'll get delivery absolutely free. Well, it's not actually free, we just price it into the products.",
    },
    {
      name: "10-year warranty",
      imageSrc:
        "https://tailwindui.com/img/ecommerce/icons/icon-warranty-light.svg",
      description:
        "We have a 10 year warranty with every product that you purchase, whether thats a new pen or organizer.",
    },
    {
      name: "Exchanges",
      imageSrc:
        "https://tailwindui.com/img/ecommerce/icons/icon-returns-light.svg",
      description:
        "We understand that when your product arrives you might not particularly like it, or you ordered the wrong thing. Conditions apply.",
    },
    {
      name: "For the planet",
      imageSrc:
        "https://tailwindui.com/img/ecommerce/icons/icon-planet-light.svg",
      description:
        "Like you, we love the planet, and so we've pledged 1% of all sales to the preservation and restoration of the natural environment.",
    },
  ];

  return (
    <main className="px-4 pb-16 pt-0">
      <h2 className="sr-only">Our perks</h2>
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-12 gap-x-8 px-4 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
          {perks.map((perk) => (
            <div key={perk.name} className="sm:flex">
              <div className="sm:flex-shrink-0">
                <div className="flow-root">
                  <img className="h-24 w-28" src={perk.imageSrc} alt="" />
                </div>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <h3 className="text-sm font-medium text-slate-900">
                  {perk.name}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{perk.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

