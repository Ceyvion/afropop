// About page with refined design
import React from 'react'

export default function About() {
  return (
    <div className="min-h-screen bg-page text-white">
      <div className="page-shell py-12 space-y-20">
        {/* Hero */}
        <div className="fade-in space-y-6">
          <p className="page-kicker">About Afropop</p>
          <h1 className="page-title text-4xl md:text-5xl leading-tight">Public-service music journalism from the global Black diaspora.</h1>
          <p className="text-xl text-white/70 leading-relaxed max-w-4xl">
            Afropop Worldwide is dedicated to storytelling that explores the rich diversity of African music and its global influence.
            We believe in the power of sound to connect cultures, tell stories, and foster understanding.
          </p>
        </div>
        
        {/* History */}
        <div className="fade-in delay-100 space-y-8">
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Our History</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 text-white/70">
              <p>
                Afropop Worldwide began as a radio program on WNYE 91.5 FM in New York City. 
                Founded by Sean Barlow, the show was initially called "The African Show" 
                and focused on traditional African music. Over time, the program evolved 
                to encompass the full spectrum of African music, including contemporary 
                genres and diaspora sounds.
              </p>
              <p>
                In the 1990s, Afropop Worldwide expanded to public radio stations across 
                the United States and began producing documentaries and special series. 
                The organization also started hosting live events, bringing artists 
                together with audiences for intimate performances and discussions.
              </p>
              <p>
                Today, Afropop Worldwide continues to innovate in the digital age, 
                producing podcasts, online features, and multimedia content that reaches 
                a global audience. Our commitment to quality journalism and cultural 
                exchange remains as strong as ever.
              </p>
            </div>
            <div className="bg-white/5 border border-white/10 aspect-video rounded-[32px]" />
          </div>
        </div>
        
        {/* Values */}
        <div className="fade-in delay-200 space-y-8">
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <div key={index} className="ra-panel ra-panel-strong space-y-3 h-full">
                <p className="page-kicker">{String(index + 1).padStart(2, '0')}</p>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-white/70">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Team */}
        <div className="fade-in delay-300 space-y-8">
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Our Team</h2>
          <p className="text-lg text-white/70 max-w-3xl">
            Meet the people behind Afropop Worldwide.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-elevated p-5 shadow-[0_20px_30px_rgba(0,0,0,0.35)]">
                <div className="bg-white/10 border border-white/10 rounded-full w-20 h-20" />
                <div>
                  <h3 className="font-semibold text-lg">Team Member Name</h3>
                  <p className="text-accent-v font-medium mb-1 uppercase tracking-[0.35em] text-xs">Role/Title</p>
                  <p className="text-sm text-white/60">Specialty or department</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <button className="btn-outline-ra">View all contributors</button>
          </div>
        </div>
        
        {/* Press Kit */}
        <div className="fade-in delay-400 space-y-8">
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Press Kit</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Press Releases', copy: 'Official announcements and news', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              ) },
              { title: 'Media Assets', copy: 'Logos, photos, and brand guidelines', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              ) },
              { title: 'Financial Reports', copy: 'Annual reports and financial information', icon: (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              ) },
            ].map((item) => (
              <div key={item.title} className="ra-panel text-center space-y-4">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-v/10">
                  <svg className="h-8 w-8 text-accent-v" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {item.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-white/70">{item.copy}</p>
                <button className="text-xs uppercase tracking-[0.35em] text-accent-v hover:text-white transition">
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact */}
        <div className="fade-in delay-500 space-y-8">
          <h2 className="text-3xl font-display-condensed uppercase tracking-tight">Contact Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="ra-panel space-y-3">
              <p className="page-kicker">General</p>
              <h3 className="text-xl font-semibold">General Inquiries</h3>
              <p className="text-white/70">For general questions and information</p>
              <a href="mailto:info@afropop.org" className="text-accent-v hover:text-white transition">
                info@afropop.org
              </a>
            </div>
            
            <div className="ra-panel space-y-3">
              <p className="page-kicker">Press</p>
              <h3 className="text-xl font-semibold">Press Requests</h3>
              <p className="text-white/70">For media and press inquiries</p>
              <a href="mailto:press@afropop.org" className="text-accent-v hover:text-white transition">
                press@afropop.org
              </a>
            </div>
            
            <div className="ra-panel space-y-3">
              <p className="page-kicker">HQ</p>
              <h3 className="text-xl font-semibold">Mailing Address</h3>
              <p className="text-white/70 leading-relaxed">
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
