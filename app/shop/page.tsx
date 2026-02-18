// Store page — browse, filter, and explore Afropop merchandise
'use client'

import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { Button } from '@/app/components/Button'

type Product = {
  id: number
  name: string
  price: string
  priceValue: number
  image: string
  imageAlt: string
  description: string
  category: string
  tags: string[]
  badge?: string
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Afropop Worldwide T-Shirt',
    price: '$25',
    priceValue: 25,
    image: '/images/store/store-tshirt.webp',
    imageAlt: 'Folded black Afropop t-shirt with geometric coral and amber artwork',
    description: '100% cotton, soft and comfortable. Available in multiple colorways.',
    category: 'Apparel',
    tags: ['cotton', 'unisex', 'bestseller'],
    badge: 'Bestseller',
  },
  {
    id: 2,
    name: 'Afropop Worldwide Mug',
    price: '$15',
    priceValue: 15,
    image: '/images/store/store-mug.webp',
    imageAlt: 'Ceramic Afropop mug with warm geometric stripe motif',
    description: 'Ceramic mug featuring the classic APW logo. Dishwasher safe.',
    category: 'Accessories',
    tags: ['ceramic', 'logo', 'gift'],
  },
  {
    id: 3,
    name: 'Afropop Worldwide Tote Bag',
    price: '$20',
    priceValue: 20,
    image: '/images/store/store-tote.webp',
    imageAlt: 'Canvas tote bag with rhythmic pan-African inspired pattern blocks',
    description: 'Heavy-duty reusable cotton tote. Perfect for vinyl runs.',
    category: 'Accessories',
    tags: ['cotton', 'reusable', 'vinyl'],
  },
  {
    id: 4,
    name: 'Afropop Worldwide Cap',
    price: '$22',
    priceValue: 22,
    image: '/images/store/store-cap.webp',
    imageAlt: 'Black snapback cap styled on dark studio backdrop',
    description: 'Adjustable snapback with embroidered AP logo.',
    category: 'Apparel',
    tags: ['snapback', 'embroidered', 'unisex'],
  },
  {
    id: 5,
    name: 'Afropop Worldwide Hoodie',
    price: '$45',
    priceValue: 45,
    image: '/images/store/store-hoodie.webp',
    imageAlt: 'Folded hoodie with textured fabric and warm accent patterning',
    description: 'Warm and cozy fleece-lined hoodie with front pocket.',
    category: 'Apparel',
    tags: ['fleece', 'unisex', 'winter'],
    badge: 'New',
  },
  {
    id: 6,
    name: 'Afropop Worldwide Stickers',
    price: '$8',
    priceValue: 8,
    image: '/images/store/store-stickers.webp',
    imageAlt: 'Vinyl sticker set with abstract music and festival-inspired icons',
    description: 'Set of 5 vinyl stickers with iconic APW designs.',
    category: 'Accessories',
    tags: ['vinyl', 'waterproof', 'gift'],
  },
  {
    id: 7,
    name: 'APW Archive Print - Vol. 1',
    price: '$35',
    priceValue: 35,
    image: '/images/store/store-featured-collection.webp',
    imageAlt: 'Afropop archive art print from the featured collection set',
    description: 'Limited-run archival print from the APW design studio. 12x18 matte.',
    category: 'Prints',
    tags: ['archival', 'limited', 'art'],
    badge: 'Limited',
  },
  {
    id: 8,
    name: 'APW Archive Print - Vol. 2',
    price: '$35',
    priceValue: 35,
    image: '/images/store/store-featured-collection.webp',
    imageAlt: 'Second edition Afropop archive print from the featured collection',
    description: 'Second edition archival print. 12x18 matte, signed.',
    category: 'Prints',
    tags: ['archival', 'limited', 'signed'],
  },
  {
    id: 9,
    name: 'Afropop Enamel Pin Set',
    price: '$12',
    priceValue: 12,
    image: '/images/store/store-stickers.webp',
    imageAlt: 'Afropop enamel pin set presented alongside sticker artwork',
    description: 'Pack of 3 enamel pins with custom APW motifs.',
    category: 'Accessories',
    tags: ['enamel', 'gift', 'collectible'],
  },
]

const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Prints'] as const
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'name'
const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name', label: 'Name A-Z' },
]

export default function Shop() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('All')
  const [sort, setSort] = useState<SortOption>('featured')

  const filtered = useMemo(() => {
    let items = PRODUCTS

    if (activeCategory !== 'All') {
      items = items.filter((p) => p.category === activeCategory)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      items = items.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)) ||
          p.category.toLowerCase().includes(q)
      )
    }

    switch (sort) {
      case 'price-asc':
        items = [...items].sort((a, b) => a.priceValue - b.priceValue)
        break
      case 'price-desc':
        items = [...items].sort((a, b) => b.priceValue - a.priceValue)
        break
      case 'name':
        items = [...items].sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        break
    }

    return items
  }, [search, activeCategory, sort])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: PRODUCTS.length }
    PRODUCTS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [])

  return (
    <div className="min-h-screen bg-page text-white">
      {/* ─── Hero header ─── */}
      <div className="border-b border-[var(--border-subtle)] bg-gradient-to-b from-[var(--elevated)] to-[var(--bg)]">
        <div className="container-wide py-10 md:py-14 space-y-5">
          <div className="flex items-center gap-3 text-2xs uppercase tracking-[0.4em] text-white/30">
            <span className="inline-block h-px w-6 bg-white/15" />
            <span>Store</span>
          </div>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Support the archive.</h1>
          <p className="text-[15px] text-white/50 max-w-2xl leading-relaxed">
            Show your style while supporting Afropop Worldwide&apos;s mission to share African music and culture with the world.
          </p>
        </div>
      </div>

      <div className="container-wide py-8 md:py-10">
        {/* ─── Toolbar: Search + Filters + Sort ─── */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30 pointer-events-none"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35m0 0A7 7 0 1010.5 17a7 7 0 006.15-3.35z" />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-dark pl-9"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category tabs */}
            <div className="flex gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    text-2xs uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-lg transition-all
                    ${activeCategory === cat
                      ? 'bg-accent-v text-white'
                      : 'bg-[var(--elevated)] text-white/50 border border-[var(--border)] hover:text-white hover:border-white/20'
                    }
                  `}
                >
                  {cat}
                  <span className="ml-1 text-white/30">{categoryCounts[cat] ?? 0}</span>
                </button>
              ))}
            </div>

            {/* Sort select */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="input-dark w-auto text-sm py-1.5 px-3 cursor-pointer"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ─── Results count ─── */}
        <p className="text-2xs uppercase tracking-[0.3em] text-white/30 mb-5">
          {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          {activeCategory !== 'All' && ` in ${activeCategory}`}
          {search.trim() && ` matching "${search}"`}
        </p>

        {/* ─── Products Grid ─── */}
        {filtered.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <p className="text-white/40 text-lg">No products found.</p>
            <p className="text-white/25 text-sm">Try adjusting your search or filters.</p>
            <button
              type="button"
              onClick={() => { setSearch(''); setActiveCategory('All') }}
              className="text-2xs uppercase tracking-[0.25em] text-accent-v hover:text-white transition-colors mt-2"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group ra-panel ra-panel-strong overflow-hidden hover:border-[rgba(255,45,85,0.25)] transition-all"
              >
                {/* Product image */}
                <div className="relative bg-white/[0.03] border-b border-[var(--border-subtle)] aspect-[4/3] w-full overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.imageAlt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="w-full h-full object-cover"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 ra-chip bg-accent-v/90 text-white border-transparent text-[0.6rem]">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-white text-[15px] leading-snug group-hover:text-accent-v/90 transition-colors">{product.name}</h3>
                    <span className="text-lg font-bold text-accent-v flex-shrink-0">{product.price}</span>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{product.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {product.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[0.6rem] uppercase tracking-[0.15em] text-white/30 bg-white/[0.04] rounded px-1.5 py-0.5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action */}
                  <div className="pt-2">
                    <button
                      type="button"
                      className="w-full inline-flex items-center justify-center rounded-lg bg-white px-4 py-2 text-2xs font-semibold uppercase tracking-[0.25em] text-black transition-all hover:bg-accent-v hover:text-white"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── Featured Collection ─── */}
        <div className="mt-14 space-y-5">
          <p className="section-label">Featured Collection</p>
          <div className="ra-panel-strong rounded-xl border border-[var(--border)] overflow-hidden hover:border-[rgba(255,45,85,0.2)] transition-all">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative aspect-square lg:aspect-auto lg:min-h-[320px]">
                <Image
                  src="/images/store/store-featured-collection.webp"
                  alt="Afropop featured merchandise collection including hoodie, tee, tote, cap, mug, and sticker set"
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center space-y-4">
                <span className="ra-chip self-start">NEW COLLECTION</span>
                <h3 className="text-2xl md:text-3xl font-display-condensed uppercase tracking-tight">Afropop Worldwide 2025 Collection</h3>
                <p className="text-white/55 leading-relaxed text-sm">
                  Celebrate 35 years of Afropop Worldwide with our special anniversary collection.
                  Each item features exclusive artwork inspired by our favorite album covers.
                </p>
                <div className="flex flex-wrap gap-3 pt-1">
                  <Button variant="primary" size="lg">Shop Collection</Button>
                  <Button variant="outline" size="lg">Learn More</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── External store link ─── */}
        <div className="mt-14 text-center space-y-4 pb-4">
          <h2 className="text-2xl font-display-condensed uppercase tracking-tight">Full Collection</h2>
          <p className="text-white/50 max-w-lg mx-auto text-sm leading-relaxed">
            Our full collection is available in our external store with even more merchandise and exclusive items.
          </p>
          <div className="pt-1">
            <Button variant="primary" size="lg">Visit External Store</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
