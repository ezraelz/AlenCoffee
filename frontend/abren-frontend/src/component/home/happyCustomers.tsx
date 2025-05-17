import React from 'react'
import img from '../../assets/images/happy.jpeg';
import img1 from '../../assets/images/measuring-customer-satisfaction-408402166[1].jpg';
import img2 from '../../assets/images/customer.jpg';

const HappyCustomers: React.FC = () => {
  const customer = [
    {name: 'Taylor', img:img, description: 'Its so wonderfull experiance..'},
    {name: 'Lisa', img:img1, description: 'Nice day nice coffee..'},
    {name: 'Jack', img:img2, description: 'Moments to memorize..'},
  ]

  return (
    <div className='customers'>
        <h2>Happy Customers</h2>
        <div className="customers_container">
            {
            customer.map((customer, index)=>(
                <div className='customer_card' key={index}>
                    <img src={customer.img} alt="" />
                    <div className="detail">
                        <h3>{customer.name}</h3>
                        <p>{customer.description}</p>
                    </div>
                </div>
            ))
        }
        </div>
      
    </div>
  )
}

export default HappyCustomers
