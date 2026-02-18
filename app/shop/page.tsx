// Shop page with refined design
import React from 'react'
import Image from 'next/image'
import { getStaggeredDelayClass } from '@/app/lib/animation-utils'
import { Button } from '@/app/components/Button'

export default function Shop() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Afropop Worldwide T-Shirt',
      price: '$25',
      image: '/images/store/store-tshirt.webp',
      imageAlt: 'Folded black Afropop t-shirt with geometric coral and amber artwork',
      description: '100% cotton, soft and comfortable'
    },
    {
      id: 2,
      name: 'Afropop Worldwide Mug',
      price: '$15',
      image: '/images/store/store-mug.webp',
      imageAlt: 'Ceramic Afropop mug with warm geometric stripe motif',
      description: 'Ceramic mug with signature geometric artwork'
    },
    {
      id: 3,
      name: 'Afropop Worldwide Tote Bag',
      price: '$20',
      image: '/images/store/store-tote.webp',
      imageAlt: 'Canvas tote bag with rhythmic pan-African inspired pattern blocks',
      description: 'Reusable cotton tote bag'
    },
    {
      id: 4,
      name: 'Afropop Worldwide Cap',
      price: '$22',
      image: '/images/store/store-cap.webp',
      imageAlt: 'Black snapback cap styled on dark studio backdrop',
      description: 'Adjustable snapback cap'
    },
    {
      id: 5,
      name: 'Afropop Worldwide Hoodie',
      price: '$45',
      image: '/images/store/store-hoodie.webp',
      imageAlt: 'Folded hoodie with textured fabric and warm accent patterning',
      description: 'Warm and cozy hoodie'
    },
    {
      id: 6,
      name: 'Afropop Worldwide Stickers',
      price: '$8',
      image: '/images/store/store-stickers.webp',
      imageAlt: 'Vinyl sticker set with abstract music and festival-inspired icons',
      description: 'Set of 3 vinyl stickers'
    },
  ]

  return (
    <div className="min-h-screen bg-page text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 fade-in space-y-4">
          <p className="page-kicker">Shop</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Support the archive.</h1>
          <p className="text-lg text-white/60 max-w-3xl">
            Show your style while supporting Afropop Worldwide’s mission to share African music and culture.
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16 fade-in delay-100">
          {products.map((product, index) => (
            <div key={product.id} className={`ra-panel ra-panel-strong overflow-hidden hover:border-accent-v/40 transition fade-in ${getStaggeredDelayClass(index, 100)}`}>
              <div className="relative aspect-square w-full overflow-hidden bg-white/5">
                <Image
                  src={product.image}
                  alt={product.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                  priority={index < 3}
                />
              </div>
              <div className="p-6 space-y-3">
                <h3 className="font-semibold text-white text-lg">{product.name}</h3>
                <p className="text-white/60 text-sm">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-accent-v">{product.price}</span>
                  <button className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-black transition hover:bg-accent-v hover:text-white">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Featured Collection */}
        <div className="mb-16 fade-in delay-200">
          <p className="section-label mb-6">Featured Collection</p>
          <div className="ra-panel-strong rounded-[32px] border border-white/10 overflow-hidden hover:border-accent-v/40 transition">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-square lg:aspect-auto lg:h-full min-h-[320px]">
                <Image
                  src="/images/store/store-featured-collection.webp"
                  alt="Afropop featured merchandise collection including hoodie, tee, tote, cap, mug, and sticker set"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="p-8 flex flex-col justify-center space-y-4">
                <div className="inline-flex self-start">
                  <span className="ra-chip">NEW COLLECTION</span>
                </div>
                <h3 className="text-3xl font-display-condensed uppercase tracking-tight">Afropop Worldwide 2025 Collection</h3>
                <p className="text-white/70 leading-relaxed">
                  Celebrate 35 years of Afropop Worldwide with our special anniversary collection.
                  Each item features exclusive artwork inspired by our favorite album covers.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <Button variant="primary" size="lg">
                    Shop Collection
                  </Button>
                  <Button variant="outline" size="lg">
                    Learn More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* External Link */}
        <div className="text-center fade-in delay-300 space-y-6">
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Full Collection</h2>
          <p className="text-white/70 mb-8 max-w-2xl mx-auto">
            Our full collection is available in our external store with even more merchandise and exclusive items.
          </p>
          <Button variant="primary" size="lg">
            Visit External Store
          </Button>
        </div>
      </div>
    </div>
  )
}
