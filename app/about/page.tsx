// About page with refined design
import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero */}
        <div className="mb-20 fade-in">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-ink mb-8">Our Mission</h1>
          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-600 leading-relaxed">
              Afropop Worldwide is dedicated to public-service music journalism that 
              explores the rich diversity of African music and its global influence. 
              We believe in the power of sound to connect cultures, tell stories, 
              and foster understanding.
            </p>
          </div>
        </div>
        
        {/* History */}
        <div className="mb-20 fade-in delay-100">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">Our History</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-6">
                Afropop Worldwide began as a radio program on WNYE 91.5 FM in New York City. 
                Founded by Sean Barlow, the show was initially called "The African Show" 
                and focused on traditional African music. Over time, the program evolved 
                to encompass the full spectrum of African music, including contemporary 
                genres and diaspora sounds.
              </p>
              <p className="text-gray-700 mb-6">
                In the 1990s, Afropop Worldwide expanded to public radio stations across 
                the United States and began producing documentaries and special series. 
                The organization also started hosting live events, bringing artists 
                together with audiences for intimate performances and discussions.
              </p>
              <p className="text-gray-700">
                Today, Afropop Worldwide continues to innovate in the digital age, 
                producing podcasts, online features, and multimedia content that reaches 
                a global audience. Our commitment to quality journalism and cultural 
                exchange remains as strong as ever.
              </p>
            </div>
            <div className="bg-gray-200 border-2 border-dashed aspect-video rounded-xl" />
          </div>
        </div>
        
        {/* Values */}
        <div className="mb-20 fade-in delay-200">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                title: 'Cultural Exchange', 
                description: 'We bridge cultures through the universal language of music.' 
              },
              { 
                title: 'Quality Journalism', 
                description: 'We uphold the highest standards of accuracy and integrity.' 
              },
              { 
                title: 'Community Focus', 
                description: 'We center the voices of artists and communities we serve.' 
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-ink mb-4">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team */}
        <div className="mb-20 fade-in delay-300">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">Our Team</h2>
          <p className="text-lg text-gray-600 mb-12 max-w-3xl">
            Meet the people behind Afropop Worldwide
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-center p-6 bg-white rounded-xl shadow-sm">
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-20 h-20 mr-6" />
                <div>
                  <h3 className="font-bold text-ink text-lg">Team Member Name</h3>
                  <p className="text-accent-2 font-medium mb-2">Role/Title</p>
                  <p className="text-sm text-gray-600">Specialty or department</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <button className="text-accent-2 hover:text-accent font-bold uppercase tracking-wider transition-colors duration-200">
              View all contributors
            </button>
          </div>
        </div>
        
        {/* Press Kit */}
        <div className="mb-20 fade-in delay-400">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">Press Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="border border-gray-200 rounded-xl p-8 text-center hover:shadow-md transition-shadow duration-200">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink mb-4">Press Releases</h3>
              <p className="text-gray-600 mb-6">Official announcements and news</p>
              <button className="text-sm text-accent-2 hover:text-accent font-bold uppercase tracking-wider transition-colors duration-200">
                Download
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-8 text-center hover:shadow-md transition-shadow duration-200">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink mb-4">Media Assets</h3>
              <p className="text-gray-600 mb-6">Logos, photos, and brand guidelines</p>
              <button className="text-sm text-accent-2 hover:text-accent font-bold uppercase tracking-wider transition-colors duration-200">
                Download
              </button>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-8 text-center hover:shadow-md transition-shadow duration-200">
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="h-8 w-8 text-accent-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-ink mb-4">Financial Reports</h3>
              <p className="text-gray-600 mb-6">Annual reports and financial information</p>
              <button className="text-sm text-accent-2 hover:text-accent font-bold uppercase tracking-wider transition-colors duration-200">
                Download
              </button>
            </div>
          </div>
        </div>
        
        {/* Contact */}
        <div className="fade-in delay-500">
          <h2 className="text-2xl md:text-3xl font-bold text-ink mb-8">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-ink mb-4">General Inquiries</h3>
              <p className="text-gray-600 mb-4">For general questions and information</p>
              <a href="mailto:info@afropop.org" className="text-accent-2 hover:text-accent transition-colors duration-200">
                info@afropop.org
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-ink mb-4">Press Requests</h3>
              <p className="text-gray-600 mb-4">For media and press inquiries</p>
              <a href="mailto:press@afropop.org" className="text-accent-2 hover:text-accent transition-colors duration-200">
                press@afropop.org
              </a>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h3 className="text-xl font-bold text-ink mb-4">Mailing Address</h3>
              <p className="text-gray-600">
                Afropop Worldwide<br />
                123 Music Street<br />
                Brooklyn, NY 11201
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
