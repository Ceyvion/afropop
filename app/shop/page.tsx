// Shop page with refined design
import React from 'react'

export default function Shop() {
  // Sample product data
  const products = [
    {
      id: 1,
      name: 'Afropop Worldwide T-Shirt',
      price: '$25',
      image: '',
      description: '100% cotton, soft and comfortable'
    },
    {
      id: 2,
      name: 'Afropop Worldwide Mug',
      price: '$15',
      image: '',
      description: 'Ceramic mug with our logo'
    },
    {
      id: 3,
      name: 'Afropop Worldwide Tote Bag',
      price: '$20',
      image: '',
      description: 'Reusable cotton tote bag'
    },
    {
      id: 4,
      name: 'Afropop Worldwide Cap',
      price: '$22',
      image: '',
      description: 'Adjustable snapback cap'
    },
    {
      id: 5,
      name: 'Afropop Worldwide Hoodie',
      price: '$45',
      image: '',
      description: 'Warm and cozy hoodie'
    },
    {
      id: 6,
      name: 'Afropop Worldwide Stickers',
      price: '$8',
      image: '',
      description: 'Set of 3 vinyl stickers'
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8f7f2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-12 fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-ink mb-6">Shop</h1>
          <p className="text-lg text-gray-600 max-w-3xl">
            Support Afropop Worldwide while showing your style
          </p>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 fade-in delay-100">
          {products.map((product, index) => (
            <div key={product.id} className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover fade-in delay-${(index + 1) * 100}`}>
              <div className="bg-gray-200 border-2 border-dashed aspect-square w-full" />
              <div className="p-6">
                <h3 className="font-bold text-ink text-lg mb-2">{product.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-accent-2">{product.price}</span>
                  <button className="px-4 py-2 bg-accent-2 text-white text-sm font-bold rounded-md hover:bg-accent transition-colors duration-200">
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Featured Collection */}
        <div className="mb-16 fade-in delay-200">
          <h2 className="text-2xl font-bold text-ink mb-8">Featured Collection</h2>
          <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 ease-in-out card-hover">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="bg-gray-200 border-2 border-dashed aspect-square lg:aspect-auto lg:h-full" />
              <div className="p-8 flex flex-col justify-center">
                <div className="inline-block bg-accent-100 text-accent-2 text-xs font-bold px-3 py-1 rounded-full mb-4">
                  NEW COLLECTION
                </div>
                <h3 className="text-2xl font-bold text-ink mb-4">Afropop Worldwide 2025 Collection</h3>
                <p className="text-gray-600 mb-6">
                  Celebrate 35 years of Afropop Worldwide with our special anniversary collection. 
                  Each item features exclusive artwork inspired by our favorite album covers.
                </p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-6 py-3 bg-accent-2 text-white font-bold rounded-md hover:bg-accent transition-colors duration-200">
                    Shop Collection
                  </button>
                  <button className="px-6 py-3 border border-gray-300 text-ink font-bold rounded-md hover:bg-gray-50 transition-colors duration-200">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* External Link */}
        <div className="text-center fade-in delay-300">
          <h2 className="text-2xl font-bold text-ink mb-6">Full Collection</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Our full collection is available in our external store with even more merchandise and exclusive items.
          </p>
          <button className="px-8 py-4 border border-transparent text-base font-bold rounded-md text-white bg-accent-2 hover:bg-accent transition-colors duration-200 uppercase tracking-wider">
            Visit External Store
          </button>
        </div>
      </div>
    </div>
  )
}