// Support page with refined design
import React from 'react'

export default function Support() {
  // Sample tier data
  const tiers = [
    {
      name: 'Listener',
      price: '$5/month',
      description: 'Support our mission with a monthly contribution',
      perks: [
        'Ad-free listening',
        'Early access to episodes',
        'Monthly newsletter'
      ]
    },
    {
      name: 'Aficionado',
      price: '$15/month',
      description: 'For devoted fans of African music',
      perks: [
        'All Listener benefits',
        'Exclusive interviews',
        'Discounts on Afropop events',
        'Behind-the-scenes content'
      ],
      featured: true
    },
    {
      name: 'Patron',
      price: '$30/month',
      description: 'Our highest level of support',
      perks: [
        'All Aficionado benefits',
        'Signed merchandise',
        'Invitation to annual Patron party',
        'Personal thanks from our hosts'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="text-center mb-16 fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-6">Support Afropop Worldwide</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Public-service music journalism, powered by listeners like you.
          </p>
          <div className="inline-flex items-center bg-accent-50 text-accent-v px-4 py-2 rounded-full text-sm font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your support helps us reach 10,000 monthly donors by 2026
          </div>
        </div>
        
        {/* Perks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 fade-in delay-100">
          {tiers.map((tier, index) => (
            <div 
              key={tier.name} 
              className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 ease-in-out card-hover ${
                tier.featured 
                  ? 'border-2 border-accent-v ring-2 ring-accent-2 ring-opacity-20 transform -translate-y-2' 
                  : 'border border-gray-200'
              }`}
            >
              {tier.featured && (
                <div className="bg-accent-v text-white text-center py-2 text-sm font-bold">
                  MOST POPULAR
                </div>
              )}
              <div className="p-8">
                <h2 className="text-2xl font-bold text-ink mb-3">{tier.name}</h2>
                <p className="text-4xl font-bold text-accent-v mb-4">{tier.price}</p>
                <p className="text-gray-600 mb-8">{tier.description}</p>
                
                <ul className="space-y-4 mb-10">
                  {tier.perks.map((perk) => (
                    <li key={perk} className="flex items-start">
                      <svg className="h-5 w-5 text-accent-v mr-3 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{perk}</span>
                    </li>
                  ))}
                </ul>
                
                <button 
                  className={`w-full py-4 px-6 border border-transparent text-base font-bold rounded-md transition-colors duration-200 uppercase tracking-wider ${
                    tier.featured 
                      ? 'btn-accent hover:bg-accent-strong-v text-white' 
                      : 'bg-ink text-white hover:bg-gray-900'
                  }`}
                >
                  Choose {tier.name}
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* One-time Donation */}
        <div className="bg-white rounded-xl p-10 mb-20 shadow-sm fade-in delay-200">
          <h2 className="text-2xl font-bold text-ink mb-6 text-center">One-time Donation</h2>
          <p className="text-gray-600 mb-8 text-center max-w-2xl mx-auto">
            Make a single contribution to support our work
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {['$10', '$25', '$50', '$100', 'Other'].map((amount) => (
              <button
                key={amount}
                className="px-6 py-3 border border-gray-300 text-base font-bold rounded-md text-ink bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                {amount}
              </button>
            ))}
          </div>
          
          <div className="text-center">
            <button className="px-8 py-4 border border-transparent text-base font-bold rounded-md text-white btn-accent transition-colors duration-200 uppercase tracking-wider">
              Donate Now
            </button>
          </div>
        </div>
        
        {/* Employer Match */}
        <div className="text-center mb-20 fade-in delay-300">
          <h2 className="text-2xl font-bold text-ink mb-6">Double Your Impact</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Many employers will match your donation to Afropop Worldwide. 
            Check with your HR department to see if your company participates.
          </p>
          <button className="text-accent-v hover:opacity-90 font-bold uppercase tracking-wider transition-colors duration-200">
            Learn about employer matching
          </button>
        </div>
        
        {/* Tax Deductible Info */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-8 fade-in delay-400">
          <div className="flex flex-col md:flex-row items-center">
            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <svg className="h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-blue-800 mb-2">Tax Deductible</h3>
              <p className="text-blue-700">
                Afropop Worldwide is a 501(c)(3) nonprofit organization. 
                Your donations are tax deductible to the extent allowed by law.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
