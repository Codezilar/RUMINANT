import Image from 'next/image'
import React from 'react'

const page = () => {
  return (
    <div className='dashboard'>
        <div className="anal">
          <h1>Financial Analytics</h1>
          <p className='dffrs'>Comprehensive insights into your financial health with AI-powered recommendations.</p>
          <div className="ai">
            <h2>AI-Powered Insights</h2>
            <p className='dffrs'>Spending patterns and personalized recommendations</p>
            <div className="ai-component">
              <div className="ai-container">
                <div className="ai-top">
                  <h4>Weekend Overspending</h4>
                  <span>87% confidence</span>
                </div>
                <p>You spend 40% more on weekends compared to weekdays</p>
                <h3>💡 Set a weekend spending limit and use cash for discretionary purchases</h3>
              </div>
              <div className="ai-container">
                <div className="ai-top">
                  <h4>Subscription Creep</h4>
                  <span>92% confidence</span>
                </div>
                <p>Your monthly subscriptions have increased by $47 in the last 6 months</p>
                <h3>💡 Review and cancel unused subscriptions. Consider annual plans for active services</h3>
              </div>
              <div className="ai-container">
                <div className="ai-top">
                  <h4>Seasonal Shopping Spikes</h4>
                  <span>78% confidence</span>
                </div>
                <p>Shopping expenses increase by 65% during holiday seasons</p>
                <h3>💡 Create a holiday budget and start saving monthly for seasonal expenses</h3>
              </div>
              <div className="ai-container">
                <div className="ai-top">
                  <h4>Impulse Food Delivery</h4>
                  <span>83% confidence</span>
                </div>
                <p>Food delivery orders spike during stressful work periods</p>
                <h3>💡 Prepare easy meals in advance and set delivery spending alerts</h3>
              </div>
            </div>
          </div>
          <div className="anal-img">
            <Image className='gif' src={'/gi.gif'} height={200} width={200} alt='kjh' />
            <Image className='gif' src={'/giphy.gif'} height={200} width={200} alt='kjh' />
          </div>
        </div>
    </div>
  )
}

export default page